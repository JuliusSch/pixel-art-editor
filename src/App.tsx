import './styles/app.css'
import Canvas, { CanvasHandle, gridWidth, gridHeight } from './components/Canvas'
import AuthModal from './components/AuthModal'
import { useState, useEffect, useRef } from 'react'
import { onAuthChange } from './services/authService'
import { fetchDrawings, saveDrawing, Drawing } from './services/drawingsService'
import { auth } from '../firebaseConfig'
import ColourPicker from './components/ColourPicker'
import { LOCAL_STORAGE_KEYS } from './constants'
import SidePanel from './components/SidePanel'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faTrash } from '@fortawesome/free-solid-svg-icons'

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [savedDrawings, setDrawings] = useState<Drawing[]>([])
  const [selectedColour, setSelectedColour] = useState('#000000')

  const canvasRef = useRef<CanvasHandle>(null);

  function handleModalClose() { setIsModalOpen(false) }

  const updateAfterLogin = async () => {
    const userId = auth.currentUser?.uid
    if (userId) {
      try {
        const fetchedDrawings = await fetchDrawings(userId)
        setDrawings(fetchedDrawings)
      } catch (error) {
        console.error(' Error updating after login: ', error)
      }
    }
  }
  
  const saveCurrentDrawing = async () => {
    if (auth.currentUser) {
      if (canvasRef.current) {
        console.log(auth.currentUser)
        const drawingName = prompt('Enter a name for this drawing:')
        if (drawingName && auth.currentUser) {
          await saveDrawing(drawingName, canvasRef.current.getGrid())
          const updatedDrawings = await fetchDrawings(auth.currentUser.uid)
          setDrawings(updatedDrawings)
        }
      }
    } else {
      setIsModalOpen(true)
    }
  }

  const loadDrawing = (drawingGrid: string[][]) => {
    if (canvasRef.current) {
      console.log("loading drawing...")
      canvasRef.current.setGrid(drawingGrid)
      // localStorage.setItem(LOCAL_STORAGE_KEYS.PIXEL_GRID, JSON.stringify(drawingGrid))
    }
  }

  const clearCanvas = () => {
    if (canvasRef.current) {
        const emptyGrid = Array.from({ length: gridHeight }, () => Array(gridWidth).fill('#ffffff'))
        canvasRef.current.setGrid(emptyGrid)
        // localStorage.setItem(LOCAL_STORAGE_KEYS.PIXEL_GRID, JSON.stringify(emptyGrid))
      }
    }

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user)
        updateAfterLogin()
      else
        setDrawings([])
    })

    const savedColour = localStorage.getItem(LOCAL_STORAGE_KEYS.SELECTED_COLOUR)
    if (savedColour) setSelectedColour(savedColour)

    return () => unsubscribe()
  }, [])

  return (
    <>
      <div>
        <h1>Pixel Art Editor</h1>
        <SidePanel savedDrawings={savedDrawings} loadDrawing={loadDrawing}/>
        <button onClick={() => setIsModalOpen(true)} style={{ position: 'absolute', top: 10, right: 10 }}>
          {auth.currentUser ? 'Logged In' : 'Sign Up/Login'}
        </button>
        <AuthModal
          isOpen={isModalOpen && !auth.currentUser} // very bad code and temp
          onClose={handleModalClose}
          onAuthSuccess={updateAfterLogin}
        />
        <Canvas selectedColour={selectedColour} ref={canvasRef} />
        <ColourPicker selectedColour={selectedColour} setSelectedColour={setSelectedColour}/>
        <div className='canvas-buttons'>
          <button className='canvas-button' onClick={clearCanvas}>
            <FontAwesomeIcon icon={faTrash}/>
          </button>
          <button className='canvas-button' onClick={saveCurrentDrawing}>
            <FontAwesomeIcon icon={faFloppyDisk}/>
          </button>
        </div>
      </div>
    </>
  )
}