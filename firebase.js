import { firebase } from '@react-native-firebase/app';  // firebase.app modülünü import et
import '@react-native-firebase/functions'; // functions modülünü de import et

// functions fonksiyonlarını dışa aktar
const functions = firebase.functions();

export { firebase, functions };
