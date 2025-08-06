// Gerekli paketleri içe aktar
import admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import { onCall, CallableRequest, HttpsError } from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
import Stripe from "stripe";
import * as dotenv from "dotenv";

// .env dosyasını yükle
dotenv.config();

// Firebase Admin başlat (serviceAccountKey.json ile)
// serviceAccountKey.json'u içe aktar (CommonJS uyumlu)
import * as serviceAccount from '../serviceAccountKey.json';


if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

// Stripe başlat
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/* 
📌 initializeUserProgress
Kullanıcı giriş yaptığında çalışır. Firestore'da gerekli alanları başlatır.
*/
export const initializeUserProgress = onCall(async (request: CallableRequest<{}>) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "User is unauthenticated");

  try {
    const ref = admin.firestore().collection("users").doc(uid);
    await ref.set({
      progress: {},
      globalScore: 0,
      lives: 5,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    logger.info(`✅ User progress initialized for ${uid}`);
    return { success: true };
  } catch (error) {
    logger.error("❌ Init error:", error);
    throw new HttpsError("internal", `Init error: ${(error as Error).message}`);
  }
});

/* 
📌 updateUserProgress
Kullanıcı soru çözdüğünde çalışır. Doğru cevapları ve puanı günceller.
*/
export const updateUserProgress = onCall(async (
  request: CallableRequest<{ unit: number; questionId: string; points: number }>
) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "User is unauthenticated");

  const { unit, questionId, points } = request.data;
  if (!unit || !questionId || points === undefined) {
    throw new HttpsError("invalid-argument", "Eksik veri");
  }

  try {
    const ref = admin.firestore().collection("users").doc(uid);
    await ref.update({
      [`progress.units.${unit}.correctAnswers`]: admin.firestore.FieldValue.arrayUnion(questionId),
      [`progress.units.${unit}.unitScore`]: admin.firestore.FieldValue.increment(points),
      globalScore: admin.firestore.FieldValue.increment(points),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    });

    logger.info(`✅ Progress updated for ${uid}`);
    return { success: true };
  } catch (error) {
    logger.error("❌ Update error:", error);
    throw new HttpsError("internal", `Update error: ${(error as Error).message}`);
  }
});

/* 
📌 deductLife
Yanlış cevapta çalışır. Can sayısını azaltır.
*/
export const deductLife = onCall(async (
  request: CallableRequest<{ lifeCount: number }>
) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "User is unauthenticated");

  const { lifeCount } = request.data;
  if (!lifeCount || lifeCount <= 0) {
    throw new HttpsError("invalid-argument", "Can sayısı geçersiz");
  }

  try {
    const ref = admin.firestore().collection("users").doc(uid);
    const userSnap = await ref.get();
    const currentLives = userSnap.data()?.lives ?? 5;

    if (currentLives <= 0) {
      logger.warn(`⛔ User ${uid} has no lives`);
      return { success: false, message: "No lives left" };
    }

    await ref.update({
      lives: admin.firestore.FieldValue.increment(-Math.abs(lifeCount)),
      lastLifeUpdate: admin.firestore.FieldValue.serverTimestamp(),
    });

    logger.info(`✅ Life deducted from ${uid}`);
    return { success: true };
  } catch (error) {
    logger.error("❌ Life deduction error:", error);
    throw new HttpsError("internal", `Life deduction error: ${(error as Error).message}`);
  }
});

/* 
📌 purchaseLifeWithStripe
Kullanıcı Stripe ile ödeme başlatır. Stripe Checkout linki döner.
*/
export const purchaseLifeWithStripe = onCall(async (
  request: CallableRequest<{ quantity: number }>
) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "User is unauthenticated");

  const { quantity } = request.data;
  if (![1, 5].includes(quantity)) {
    throw new HttpsError("invalid-argument", "Only 1 or 5 lives allowed");
  }

  const priceId = quantity === 5
    ? process.env.STRIPE_PRICE_ID_LIFE5
    : process.env.STRIPE_PRICE_ID_LIFE1;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        { price: priceId, quantity: 1 },
      ],
      success_url: "https://mynewproject-3c9e4.web.app/payment-success.html",
      cancel_url: "https://mynewproject-3c9e4.web.app/payment-cancel.html",
      metadata: {
        uid,
        lives: quantity,
      },
    });

    logger.info(`✅ Stripe session created for ${uid}`);
    return { url: session.url };
  } catch (error) {
    logger.error("❌ Stripe error:", error);
    throw new HttpsError("internal", `Stripe error: ${(error as Error).message}`);
  }
});

/* 
📌 handleStripeWebhook
Stripe başarılı ödeme sonrası webhook gönderir, bu fonksiyon çalışır.
Kullanıcının canı Firestore'da güncellenir.
*/
export const handleStripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    res.status(400).send(`Webhook Error: ${err.message}`); // ✅ sadece gönder
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const uid = session.metadata?.uid;
    const lives = Number(session.metadata?.lives ?? 0);

    if (uid && lives > 0) {
      const userRef = admin.firestore().collection("users").doc(uid);
      await userRef.update({
        lives: admin.firestore.FieldValue.increment(lives),
        lastLifeUpdate: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`✅ ${lives} lives added to user ${uid}`);
    }
  }

  res.status(200).send("✅ Webhook received"); // ✅ sadece gönder
});
