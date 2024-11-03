import React, { useState, useEffect } from 'react'
import ColourPicker from './ColourPicker'
import { LOCAL_STORAGE_KEYS } from './constants'
import { db, auth } from '../firebaseConfig'
import { collection, addDoc , query, where, getDocs, /*onSnapshot*/ } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const Canvas: React.FC = () => {
  
  interface Drawing {
    uid: string
    userId: string
    name: string
    grid: string[][]
  }
  
  const gridHeight = 16
  const gridWidth = 16
  
  const [selectedColour, setSelectedColour] = useState('#000000')
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [savedDrawings, setSavedDrawings] = useState<Drawing[]>([])

  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: gridHeight }, () => Array(gridWidth).fill('#ffffff'))
  )

// #region Load local/firebase storage

  useEffect(() => {
    const savedGrid = localStorage.getItem(LOCAL_STORAGE_KEYS.PIXEL_GRID)
    const savedColour = localStorage.getItem(LOCAL_STORAGE_KEYS.SELECTED_COLOUR)
    const savedDrawings = localStorage.getItem(LOCAL_STORAGE_KEYS.SAVED_DRAWINGS)

    if (savedGrid) setGrid(JSON.parse(savedGrid))
    if (savedColour) setSelectedColour(savedColour)
    if (savedDrawings) setSavedDrawings(JSON.parse(savedDrawings))

    // To stop dragging when mouse is released outside the canvas
    const handleGlobalMouseUp = () => setIsDragging(false)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    window.addEventListener('touchend', handleGlobalMouseUp)

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User signed in: " + user.uid)
        fetchDrawings(user.uid)
      }
    })

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('touchend', handleGlobalMouseUp)
      unsubscribe()
    };
  }, [])

  async function fetchDrawings(userId: string) {
      const q = query(
      collection(db, 'drawings'),
      where ('userId', '==', userId)
      )

      console.log("Fetching drawings...")

      try {
        const querySnapshot = await getDocs(q)
        const drawings = querySnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            uid: doc.id,
            name: data.name,
            grid: expandGrid(data.grid, gridWidth,gridHeight)    
          }
        }) as Drawing[]

        console.log("Drawings: " + drawings)
        setSavedDrawings(drawings)
      } catch (error) {
        console.error("Error fetching drawings: ", error)
      }
  }

// #endregion

// #region Event handlers

  const colourPixel = (row: number, col: number) => {
    const newGrid = grid.map((rowArray, rowIndex) =>
      rowArray.map((colour, colIndex) =>
        rowIndex === row && colIndex === col ? selectedColour : colour
      )
    )

    setGrid(newGrid)
    localStorage.setItem(LOCAL_STORAGE_KEYS.PIXEL_GRID, JSON.stringify(newGrid))
  }

  const handleMouseDown = (event: React.MouseEvent, row: number, col: number) => {
    event.preventDefault()
    setIsDragging(true)
    colourPixel(row, col)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (row: number, col: number) => {
    if (isDragging) {
      colourPixel(row, col)
    }
  }

  const handleColourChange = (colour: string) => {
    setSelectedColour(colour)
    localStorage.setItem(LOCAL_STORAGE_KEYS.SELECTED_COLOUR, colour)
  }

  async function saveDrawing() {
    const drawingName = prompt('Enter a name for this drawing:')
    console.log("Current user:", auth.currentUser)
    if (drawingName && auth.currentUser) {
      const drawingData = {
        userId: auth.currentUser.uid,
        name: drawingName,
        grid: flattenGrid(grid)
      }

      await addDoc(collection(db, 'drawings'), drawingData)
      // const newSavedDrawings = [...savedDrawings, drawingData ]
      // setSavedDrawings(newSavedDrawings)
      // localStorage.setItem(LOCAL_STORAGE_KEYS.SAVED_DRAWINGS, JSON.stringify(newSavedDrawings))
      fetchDrawings(auth.currentUser.uid)
    }
  }

  function flattenGrid(grid: string[][]): string[] {
    return grid.flat()
  }

  function expandGrid(flatGrid: string[], width: number, height: number): string[][] {
    const expandedGrid: string[][] = []
    for (let i = 0; i < height; i++) {
      expandedGrid.push(flatGrid.slice(i * width, (i + 1) * width))
    }
    return expandedGrid
  }

  const loadDrawing = (drawingGrid: string[][]) => {
    setGrid(drawingGrid)
    localStorage.setItem(LOCAL_STORAGE_KEYS.PIXEL_GRID, JSON.stringify(drawingGrid))
  }
  
  const clearCanvas = () => {
    const emptyGrid = Array.from({ length: gridHeight }, () => Array(gridWidth).fill('#ffffff'))
    setGrid(emptyGrid)
    localStorage.setItem(LOCAL_STORAGE_KEYS.PIXEL_GRID, JSON.stringify(emptyGrid))
  }
  
  // #endregion

  return (
    <>
      <div>
        <ColourPicker selectedColour={selectedColour} onColourChange={handleColourChange} />
        <div className="grid" style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridWidth}, 20px)`,
          gap: '1px',
        }}>
          {grid.map((row, rowIndex) =>
            row.map((colour, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onMouseDown={(event) => handleMouseDown(event, rowIndex, colIndex)}
                onMouseUp={handleMouseUp}
                onMouseEnter={() => handleMouseMove(rowIndex, colIndex)}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: colour,
                  boxSizing: 'border-box'
                }}
              />
            ))
          )}
        </div>
        <div>
          <button onClick={clearCanvas}>Clear Canvas</button>
          <button onClick={saveDrawing}>Save Drawing</button>
        </div>
        <div>
          <h3>Saved Drawings</h3>
          <ul>
            {savedDrawings.map((drawing, index) => (
              <li key={index}>
                <button onClick={() => loadDrawing(drawing.grid)}>{drawing.name}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default Canvas;