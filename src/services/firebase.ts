import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
 apiKey: "AIzaSyCbIpgCjEasISG9EWACbcmKmg3gRF1o1HE",
  authDomain: "web-canvas-5db17.firebaseapp.com",
  projectId: "web-canvas-5db17",
  storageBucket: "web-canvas-5db17.firebasestorage.app",
  messagingSenderId: "1071218773303",
  appId: "1:1071218773303:web:2e3cade9d9c37c86dd5eb2",
  measurementId: "G-54P6P56DFD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;