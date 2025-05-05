import '../styles/app.css'
import { useState, useEffect, useRef } from 'react'
import { onAuthChange } from '../services/authService'
import { fetchDrawings, saveDrawing, Drawing } from '../services/drawingsService'
import { auth } from '../../firebaseConfig'
import Canvas, { CanvasHandle, gridWidth, gridHeight } from '../components/Canvas'
import AuthModal from '../components/AuthModal'
import ColourPicker from '../components/ColourPicker'
import SidePanel from '../components/SidePanel'
import ConfirmationPopup from '../components/ConfirmationPopup';
import { LOCAL_STORAGE_KEYS } from '../constants'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFloppyDisk, faDownload, faFile, faUpload } from '@fortawesome/free-solid-svg-icons'
import { useClientStateStore } from '../services/ClientStateService'

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [savedDrawings, setDrawings] = useState<Drawing[]>([])
  const [loadedDrawing, setLoadedDrawing] = useState<Drawing | null>()
  const [selectedColour, setSelectedColour] = useState('#000000')
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [resolveConfirmationPopup, setResolveConfirmationPopup] = useState<((value: boolean) => void) | null>(null)

  const hasUnsavedChanges = useClientStateStore((state) => state.hasUnsavedCanvasChanges)
  const setHasUnsavedChanges = useClientStateStore((state) => state.setHasUnsavedCanvasChanges)

  const canvasRef = useRef<CanvasHandle>(null)

  const handleCancel = () => {
    setIsPopupOpen(false);
  }

  function handleModalClose() { setIsModalOpen(false) }

  const updateAfterLogin = async () => {
    const userId = auth.currentUser?.uid
    if (userId) {
      try {
        setDrawings(await fetchDrawings(userId))
      } catch (error) {
        console.error(' Error updating after login: ', error)
      }
    }
  }
  
  const saveCurrentDrawing = async () => {
    if (auth.currentUser && canvasRef.current) {
        if (loadedDrawing === null)
          saveAsNewDrawing()
        else {
          setDrawings(await saveDrawing(loadedDrawing as Drawing, canvasRef.current.getGrid()))
        }
        setHasUnsavedChanges(false)
        localStorage.setItem(LOCAL_STORAGE_KEYS.HAS_UNSAVED_CHANGES, "") // "" parses to false
    } else {
      setIsModalOpen(true)
    }
  }
  
  const saveAsNewDrawing = async () => {
    if (canvasRef.current) {
      const drawingName = prompt('Enter a name for this drawing:')
      if (drawingName && auth.currentUser) { // and not already a name
        setDrawings(await saveDrawing( {name: drawingName } as Drawing, canvasRef.current.getGrid()))
      } 
    }
  }

  const loadDrawing = async (drawing: Drawing, loadToLocalStorage: boolean) => {
    if (canvasRef.current) {
      if (hasUnsavedChanges) {
        const userConfirmed = await new Promise<boolean>((resolve) => {
          setIsPopupOpen(true)
          setResolveConfirmationPopup(() => resolve)
        })
        setIsPopupOpen(false)
        setResolveConfirmationPopup(null)
  
        if (userConfirmed) {
          saveCurrentDrawing()
        } else {
          setHasUnsavedChanges(false)
          localStorage.setItem(LOCAL_STORAGE_KEYS.HAS_UNSAVED_CHANGES, "")
        }
      }
      canvasRef.current.setGrid(drawing.grid)
      setLoadedDrawing(drawing)

      if (loadToLocalStorage) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_EDITED_DRAWING, JSON.stringify(drawing))
      }
    }
  }

  const clearCanvas = async () => {
    if (canvasRef.current) {
      if (hasUnsavedChanges) {
        const userConfirmed = await new Promise<boolean>((resolve) => {
          setIsPopupOpen(true)
          setResolveConfirmationPopup(() => resolve)
        })
        setIsPopupOpen(false)
        setResolveConfirmationPopup(null)
  
        if (userConfirmed) {
          saveCurrentDrawing()
        } else {
          setHasUnsavedChanges(false)
          localStorage.setItem(LOCAL_STORAGE_KEYS.HAS_UNSAVED_CHANGES, "")
        }
      }

      const emptyGrid = Array.from({ length: gridHeight }, () => Array(gridWidth).fill('#ffffff'))
      canvasRef.current.setGrid(emptyGrid)
      setLoadedDrawing(null)
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

    const lastEditedDrawing = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_EDITED_DRAWING)
    if (lastEditedDrawing) {
      loadDrawing(JSON.parse(lastEditedDrawing), false)
    }
    else
      clearCanvas()
    
    if (canvasRef.current) {
      const savedGrid = localStorage.getItem(LOCAL_STORAGE_KEYS.PIXEL_GRID)
      if (savedGrid) {
        if (localStorage.getItem(LOCAL_STORAGE_KEYS.HAS_UNSAVED_CHANGES))
            setHasUnsavedChanges(true)
        canvasRef.current.setGrid(JSON.parse(savedGrid as string))
      }
    }

    return () => unsubscribe()
  }, [])

  return (
    <>
      <div>
        <h1>{loadedDrawing?.name}{hasUnsavedChanges ? "*" : ""}</h1>
        <SidePanel savedDrawings={savedDrawings} loadDrawing={loadDrawing}/>
        <button onClick={() => setIsModalOpen(true)} style={{ position: 'absolute', top: 10, right: 10 }}>
          {auth.currentUser ? 'Logged In' : 'Sign Up/Login'}
        </button>
        <ConfirmationPopup
          message="Save changes?"
          onClose={handleCancel}
          isOpen={isPopupOpen}
          resolvePromise={resolveConfirmationPopup!}
        />
        <AuthModal
          isOpen={isModalOpen && !auth.currentUser} // very bad code and temp
          onClose={handleModalClose}
          onAuthSuccess={updateAfterLogin}
        />
        <Canvas selectedColour={selectedColour} ref={canvasRef} />
        <ColourPicker selectedColour={selectedColour} setSelectedColour={setSelectedColour}/>
        <div className='canvas-buttons'>
          <button className='canvas-button' onClick={saveCurrentDrawing}>
            <FontAwesomeIcon icon={faFloppyDisk}/>
          </button>
          <button className='canvas-button'>
            <FontAwesomeIcon icon={faFile} onClick={clearCanvas}/>
          </button>
          <button className='canvas-button'>
            <FontAwesomeIcon icon={faDownload}/>
          </button>
          <button className='canvas-button'>
            <FontAwesomeIcon icon={faUpload} />
          </button>
        </div>
      </div>
    </>
  )
}