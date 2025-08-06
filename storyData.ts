export const storyData: Record<
  string,
  {
    type: 'dialog' | 'question';
    speaker?: 'bee' | 'daniel' | 'airportStaff' | 'lucy' | 'lin' | 'priti' | 'honey'
;
    text: string;
    options?: string[];
    correctAnswer?: string;
  }[]
> = {
  story1: [
    {
      type: 'dialog',
      speaker: 'bee',
      text: "Hi! I'm Bea. It's nice to meet you!",
    },
    {
      type: 'dialog',
      speaker: 'daniel',
      text: "Hi Bea! I'm Daniel. Nice to meet you too!",
    },
    {
      type: 'dialog',
      speaker: 'bee',
      text: "Is this your first time at this restaurant?",
    },
    {
      type: 'dialog',
      speaker: 'daniel',
      text: "Yes, it is. Everything looks delicious! What do you want to eat?",
    },
    {
      type: 'dialog',
      speaker: 'bee',
      text: "I think I'll have a salad. It looks fresh and tasty.",
    },
    {
      type: 'question',
      text: "What does Bea want to eat?",
      options: ["Pizza", "Salad", "Pasta", "Soup"],
      correctAnswer: "Salad",
    },
    {
      type: 'dialog',
      speaker: 'daniel',
      text: "Good choice! I might get pasta. I love Italian food.",
    },
    {
      type: 'dialog',
      speaker: 'bee',
      text: "Me too! By the way, do you play any sports?",
    },
    {
      type: 'dialog',
      speaker: 'daniel',
      text: "Yes, I play soccer. I actually have a big game later today!",
    },
    {
      type: 'question',
      text: "Which sport does Daniel play?",
      options: ["Tennis", "Soccer", "Basketball", "Baseball"],
      correctAnswer: "Soccer",
    },
    {
      type: 'dialog',
      speaker: 'bee',
      text: "That's awesome! I play soccer too. It's so much fun.",
    },
    {
      type: 'dialog',
      speaker: 'daniel',
      text: "We should play together someday!",
    },
    {
      type: 'dialog',
      speaker: 'bee',
      text: "Definitely! So, where are you from?",
    },
    {
      type: 'dialog',
      speaker: 'daniel',
      text: "I'm from Canada. And you?",
    },
    {
      type: 'dialog',
      speaker: 'bee',
      text: "I'm from Canada too! But my parents are from Spain.",
    },
    {
      type: 'question',
      text: "Where are Bea's parents from?",
      options: ["Canada", "Mexico", "Spain", "Italy"],
      correctAnswer: "Spain",
    },
    {
      type: 'dialog',
      speaker: 'daniel',
      text: "Spain is such a beautiful country! I'd love to visit someday.",
    },
    {
      type: 'dialog',
      speaker: 'bee',
      text: "You should! The food and the culture are amazing.",
    },
    {
      type: 'dialog',
      speaker: 'daniel',
      text: "Do you have any pets?",
    },
    {
      type: 'dialog',
      speaker: 'bee',
      text: "Yes, I have a dog. His name is Connor. He's very playful!",
    },
    {
      type: 'question',
      text: "What is the name of Bea's dog?",
      options: ["Connor", "Rocky", "Max", "Buddy"],
      correctAnswer: "Connor",
    },
    {
      type: 'dialog',
      speaker: 'daniel',
      text: "Connor sounds so cute! I love dogs.",
    },
    {
      type: 'dialog',
      speaker: 'bee',
      text: "Me too. They make life so much better.",
    },
    {
      type: 'dialog',
      speaker: 'daniel',
      text: "Agreed. I'm really glad we met, Bea.",
    },
    {
      type: 'dialog',
      speaker: 'bee',
      text: "Me too, Daniel. This is a great start to a wonderful friendship!",
    },
  ],

  story2: [
    {
      type: 'dialog',
      speaker: 'bee',
      text: "Excuse me, is this the way to the airport?",
    },
    {
      type: 'dialog',
      speaker: 'daniel',
      text: "Yes, go straight and then turn right. You will see signs for Terminal 1.",
    },
    {
      type: 'question',
      text: "Where should Bee go first?",
      options: ["Turn left", "Go straight", "Turn around", "Stay here"],
      correctAnswer: "Go straight",
    },
    {
      type: 'dialog',
      speaker: 'bee',
      text: "Thank you! I'm in a bit of a hurry. I have a flight to catch.",
    },
    {
      type: 'dialog',
      speaker: 'daniel',
      text: "No problem! Which airline are you flying with?",
    },
    {
      type: 'dialog',
      speaker: 'bee',
      text: "I'm flying with AirCanada. My gate is A12.",
    },
    {
      type: 'question',
      text: "Which airline is Bee flying with?",
      options: ["Delta", "AirCanada", "United", "Emirates"],
      correctAnswer: "AirCanada",
    },
    {
      type: 'dialog',
      speaker: 'daniel',
      text: "Then after turning right, you’ll find check-in counters on your left.",
    },
    {
      type: 'dialog',
      speaker: 'bee',
      text: "Perfect! Do you know how long it takes to go through security?",
    },
    {
      type: 'dialog',
      speaker: 'daniel',
      text: "It depends, but usually around 20 minutes.",
    },
    {
      type: 'question',
      text: "How long does Daniel say security might take?",
      options: ["5 minutes", "10 minutes", "20 minutes", "30 minutes"],
      correctAnswer: "20 minutes",
    },
    {
      type: 'dialog',
      speaker: 'bee',
      text: "Thanks! I think I still have enough time then.",
    },
    {
      type: 'dialog',
      speaker: 'daniel',
      text: "You should be fine. Just don’t forget your boarding pass!",
    },
    {
      type: 'dialog',
      speaker: 'bee',
      text: "Yes! It's right here in my bag. Thank you again for your help!",
    },
    {
      type: 'dialog',
      speaker: 'daniel',
      text: "You're welcome! Have a safe flight!",
    },
    {
      type: 'dialog',
      speaker: 'airportStaff',
      text: "Good afternoon! Passport and boarding pass, please.",
    },
    {
      type: 'dialog',
      speaker: 'bee',
      text: "Here you go!",
    },
    {
      type: 'dialog',
      speaker: 'airportStaff',
      text: "Thank you. Your gate is A12. Enjoy your flight!",
    },
    {
      type: 'question',
      text: "What is Bee's gate number?",
      options: ["A10", "A12", "B2", "C5"],
      correctAnswer: "A12",
    },
    {
      type: 'dialog',
      speaker: 'bee',
      text: "Thanks! Bye!",
    },
  ],
  story3: [
    {
      type: 'dialog',
      speaker: 'lucy',
      text: "Oh no! I need some bread for my sandwich.",
    },
    {
      type: 'dialog',
      speaker: 'lin',
      text: "Do you need to go to the supermarket?",
    },
    {
      type: 'dialog',
      speaker: 'lucy',
      text: "Yes, I do. We have no bread at home.",
    },
    {
      type: 'question',
      text: "What does Lucy need?",
      options: ["Bread", "Tomato", "Coffee", "Sugar"],
      correctAnswer: "Bread",
    },
    {
      type: 'dialog',
      speaker: 'lin',
      text: "Oh! I want one thing from the supermarket too!",
    },
    {
      type: 'dialog',
      speaker: 'lucy',
      text: "Really? What do you need?",
    },
    {
      type: 'dialog',
      speaker: 'lin',
      text: "One tomato, please. I need it for my salad.",
    },
    {
      type: 'question',
      text: "Why does Lin want a tomato?",
      options: ["For her sandwich", "For her soup", "For her salad", "For her coffee"],
      correctAnswer: "For her salad",
    },
    {
      type: 'dialog',
      speaker: 'lucy',
      text: "Okay, one tomato. Anything else?",
    },
    {
      type: 'dialog',
      speaker: 'lin',
      text: "Yes! I also want some coffee.",
    },
    {
      type: 'dialog',
      speaker: 'lucy',
      text: "Coffee? Okay, we can get some.",
    },
    {
      type: 'dialog',
      speaker: 'lin',
      text: "And... I want some sugar for my coffee.",
    },
    {
      type: 'dialog',
      speaker: 'lucy',
      text: "laughs More and more! Anything else, Lin?",
    },
    {
      type: 'dialog',
      speaker: 'lin',
      text: "Yes! Some milk, please.",
    },
    {
      type: 'question',
      text: "What does Lin want with her coffee?",
      options: ["Sugar and milk", "Salt and water", "Honey and lemon", "Cheese and bread"],
      correctAnswer: "Sugar and milk",
    },
    {
      type: 'dialog',
      speaker: 'lucy',
      text: "Hmm... I have an idea!",
    },
    {
      type: 'dialog',
      speaker: 'lucy',
      text: "Here is some money, Lin.",
    },
    {
      type: 'dialog',
      speaker: 'lin',
      text: "What? Money?",
    },
    {
      type: 'dialog',
      speaker: 'lucy',
      text: "Yes! You can go to the supermarket for me.",
    },
    {
      type: 'dialog',
      speaker: 'lin',
      text: "smiles Okay! But what do you want again?",
    },
    {
      type: 'dialog',
      speaker: 'lucy',
      text: "Just one thing: bread!",
    },
    {
      type: 'question',
      text: "What is the only thing Lucy really wants?",
      options: ["Tomato", "Coffee", "Milk", "Bread"],
      correctAnswer: "Bread",
    },
    {
      type: 'dialog',
      speaker: 'lin',
      text: "Got it! One bread, and my shopping list too!",
    },
    {
      type: 'dialog',
      speaker: 'lucy',
      text: "laughs Good luck, Lin!",
    },
  ],
  story4: [
    {
      type: 'dialog',
      speaker: 'honey',
      text: "Good morning, Priti!",
    },
    {
      type: 'dialog',
      speaker: 'priti',
      text: "Good morning, honey!",
    },
    {
      type: 'dialog',
      speaker: 'honey',
      text: "Where are my keys?",
    },
    {
      type: 'dialog',
      speaker: 'priti',
      text: "Your keys?",
    },
    {
      type: 'dialog',
      speaker: 'honey',
      text: "Yes! I need to go to work. I need the keys to my car.",
    },
    {
      type: 'question',
      text: "Why does Honey need the keys?",
      options: ["To go shopping", "To go to work", "To visit a friend", "To walk the dog"],
      correctAnswer: "To go to work",
    },
    {
      type: 'dialog',
      speaker: 'priti',
      text: "Your keys are right here on the table!",
    },
    {
      type: 'dialog',
      speaker: 'honey',
      text: "Oh, thank you! I couldn’t find them.",
    },
    {
      type: 'dialog',
      speaker: 'priti',
      text: "Sorry, honey. I'm tired. I worked a lot yesterday.",
    },
    {
      type: 'dialog',
      speaker: 'honey',
      text: "Poor you! Do you want some coffee?",
    },
    {
      type: 'dialog',
      speaker: 'priti',
      text: "Yes, please. I really need some coffee right now.",
    },
    {
      type: 'question',
      text: "What does Priti want?",
      options: ["Tea", "Milk", "Coffee", "Juice"],
      correctAnswer: "Coffee",
    },
    {
      type: 'dialog',
      speaker: 'honey',
      text: "Okay, here you go, my love!",
    },
    {
      type: 'dialog',
      speaker: 'priti',
      text: "Thank you! Where is the sugar?",
    },
    {
      type: 'dialog',
      speaker: 'honey',
      text: "Oh, here it is! Next to the cups.",
    },
    {
      type: 'dialog',
      speaker: 'priti',
      text: "Thanks... Wait, this coffee tastes funny!",
    },
    {
      type: 'dialog',
      speaker: 'honey',
      text: "What’s wrong?"
    },
    {
      type: 'dialog',
      speaker: 'priti',
      text: "laughs I think I put salt in my coffee instead of sugar!",
    },
    {
      type: 'question',
      text: "What did Priti accidentally put in her coffee?",
      options: ["Sugar", "Salt", "Milk", "Honey"],
      correctAnswer: "Salt",
    },
    {
      type: 'dialog',
      speaker: 'honey',
      text: "laughs You are very tired today!"
    },
    {
      type: 'dialog',
      speaker: 'priti',
      text: "Yes! I definitely need a new cup of coffee... with real sugar this time!",
    },
    {
      type: 'dialog',
      speaker: 'honey',
      text: "Coming right up!"
    },
  ],
};

