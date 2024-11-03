import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBc9wX2OpvdQ53hLy9WxHvBnzeJC3ZqvgI",
  authDomain: "pixel-art-editor-eb820.firebaseapp.com",
  projectId: "pixel-art-editor-eb820",
  storageBucket: "pixel-art-editor-eb820.firebasestorage.app",
  messagingSenderId: "768843708483",
  appId: "1:768843708483:web:4b212bef0ab20ed5e23cf6"
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
/** @type {import('firebase/auth').Auth} */
export const auth = getAuth(app)