import './App.css'
import Canvas from './Canvas'
import AuthModal from './AuthModal'
import { useState, useEffect } from 'react'
import { onAuthChange } from './authService'
import { fetchDrawings, Drawing } from './drawingsService'
import { auth } from '../firebaseConfig'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [, setDrawings] = useState<Drawing[]>([])
  
  // const handleModalOpen = () => setIsModalOpen(true)
  function handleModalClose() { setIsModalOpen(false) }

  const updateAfterLogin = async () => {
    try {
      const fetchedDrawings = await fetchDrawings(auth.currentUser ? auth.currentUser.uid : "")
      setDrawings(fetchedDrawings)
    } catch (error) {
      console.error(' Error updating after login: ', error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user)
        updateAfterLogin()
      else
        setDrawings([])
    })
    return () => unsubscribe()
  }, [])

  return (
    <>
      <div>
        <h1>Pixel Art Editor</h1>
        <button onClick={() => setIsModalOpen(true)} style={{ position: 'absolute', top: 10, right: 10 }}>
          Sign Up/Login
        </button>
        <AuthModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onAuthSuccess={updateAfterLogin}
        />
        <Canvas />
      </div>
    </>
  )
}

export default App