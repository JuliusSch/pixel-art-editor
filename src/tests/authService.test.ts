import { signUpUser, loginUser, onAuthChange } from '../services/AuthService'
import { auth } from '../../config/firebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth'
import 'jest'

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn(),
}))

describe('authService', () => {
  const mockUser = { uid: '123', email: 'test@example.com' } as unknown as User // This is causing issues

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('signUpUser', () => {
    it('should return a user when signup is successful', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUser,
      })

      const result = await signUpUser('test@example.com', 'password123')
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123')
      expect(result).toEqual(mockUser)
    })

    it('should throw an error when signup fails', async () => {
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('Signup failed'))

      await expect(signUpUser('test@example.com', 'password123')).rejects.toThrow('Failed to sign up. Please try again later.')
      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123')
    })
  })

  describe('loginUser', () => {
    it('should return a user when login is successful', async () => {
      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUser,
      })

      const result = await loginUser('test@example.com', 'password123')
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123')
      expect(result).toEqual(mockUser)
    })

    it('should throw an error when login fails', async () => {
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error('Login failed'))

      await expect(loginUser('test@example.com', 'password123')).rejects.toThrow('Failed to log in. Please try again later.')
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123')
    })
  })

  describe('onAuthChange', () => {
    it('calls the callback with the user data when user is logged in', () => {
      (onAuthStateChanged as jest.Mock).mockImplementation((_auth, callback) => {
        callback({ uid: '123', displayName: 'Test User' })
        return () => {}
      })
  
      const mockCallback = jest.fn()
      onAuthChange(mockCallback)
  
      expect(mockCallback).toHaveBeenCalledWith({ uid: '123', displayName: 'Test User' })
    })
  })
})