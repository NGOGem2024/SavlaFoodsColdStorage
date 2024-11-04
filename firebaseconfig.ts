import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBnjkQMqh-X27Mt6qBXWLPKrbdTSRhjNNU",
  authDomain: "unicorp-enterprises.firebaseapp.com",
  projectId: "unicorp-enterprises",
  storageBucket: "unicorp-enterprises.appspot.com",
  messagingSenderId: "764942898558",
  appId: "1:764942898558:web:9e65e706945ad0debb8f2f",
  measurementId: "G-NTQW54N88Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);