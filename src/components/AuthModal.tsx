import { useState } from 'react'
import { signUpUser, loginUser } from '../services/authService'
import '../styles/authModal.css'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onAuthSuccess: () => Promise<void>
}

function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(true)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isSignUp) {
        await signUpUser(username, password)
      } else {
        await loginUser(username, password)
      }

      await onAuthSuccess()
      onClose()

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('An unknown error occurred')
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className='auth-modal-overlay'>
      <div className='auth-modal'>
        <button onClick={onClose} className='auth-modal-close'>&times;</button>
        <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
        <div className='auth-modal-content'>
          <form onSubmit={handleAuth}>
            <input
              type="email"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className='auth-modal-input'
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='auth-modal-input'
            />
            <button type="submit" className='auth-modal-button'>
              {isSignUp ? 'Sign Up' : 'Login'}
            </button>
          </form>
        </div>
        <button onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
        </button>
      </div>
    </div>
  )
}

export default AuthModal