import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCbIpgCjEasISG9EWACbcmKmg3gRF1o1HE",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "web-canvas-5db17.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "web-canvas-5db17",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "web-canvas-5db17.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1071218773303",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:1071218773303:web:2e3cade9d9c37c86dd5eb2",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-54P6P56DFD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firestore
export const db = getFirestore(app);

export default app;