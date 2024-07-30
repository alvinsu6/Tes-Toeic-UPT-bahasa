
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth';
import 'firebase/auth'
import { getStorage } from 'firebase/storage'
import {getFirestore} from 'firebase/firestore'
var firebaseConfig = {
  apiKey: "AIzaSyBPerCmfbyPgapRimuQkcmrmeiQOiI2sBE",
  authDomain: "tess-40ba4.firebaseapp.com",
  projectId: "tess-40ba4",
  storageBucket: "tess-40ba4.appspot.com",
  messagingSenderId: "999010884419",
  appId: "1:999010884419:web:00adb501a1fe533059adf6"
};
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const imageDB = getStorage(app)
export const db = getFirestore(app)
