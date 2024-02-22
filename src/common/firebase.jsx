import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBSUtEHJhDz_JQInDvUWi4Nh92wMM19Zmc",
  authDomain: "hustle-blog-auth.firebaseapp.com",
  projectId: "hustle-blog-auth",
  storageBucket: "hustle-blog-auth.appspot.com",
  messagingSenderId: "863840246442",
  appId: "1:863840246442:web:be637155821a6654af0ed3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () => {
  let user = null;

  try {
    const result = await signInWithPopup(auth, provider);
    user = result.user;
  } catch (err) {
    console.log(err);
  }

  return user;
};
