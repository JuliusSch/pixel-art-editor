import { onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebaseConfig'

type AuthResult = User | null

export const signUpUser = async (username: string, password: string): Promise<AuthResult> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, username, password)
    return userCredential.user
  } catch (error) {
    console.error("Error signing up: ", error)
    throw new Error("Failed to sign up. Please try again later.")
  }
}

export const loginUser = async (username: string, password: string): Promise<AuthResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, username, password)
    return userCredential.user
  } catch (error) {
    console.error("Error logging in: ", error)
    throw new Error("Failed to log in. Please try again later.")
  }
}

export const onAuthChange = (callback: (user: AuthResult) => void) => {
  return onAuthStateChanged(auth, callback)
}