import { signInAnonymously, onAuthStateChanged, User } from 'firebase/auth'
import { auth } from '../firebaseConfig'

export const authenticateUser = async (): Promise<User | null> => {
  try {
    await signInAnonymously(auth);
  } catch (error) {
    console.error('Error signing in anonymously:', error)
  }
  return auth.currentUser
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  onAuthStateChanged(auth, callback)
};