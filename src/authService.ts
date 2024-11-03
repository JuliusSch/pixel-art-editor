import { onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseConfig'

export const signUpUser = async (username: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, username, password)
    return userCredential.user
  } catch (error) {
    console.error("Error signing up: ", error)
  }
}

export const loginUser = async (username: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, username, password)
    return userCredential.user
  } catch (error) {
    console.error("Error loggin in: ", error)
  }
}

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback)
}