import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { LOCAL_STORAGE_KEYS } from '../utils/constants'
import '../styles/canvas.css'
import '../styles/App.css'
import { useClientStateStore } from '../services/ClientStateService'

// Eventually make these dynamic and don't have versions in here and also in drawingsService
export const gridHeight = 16
export const gridWidth = 16

export interface CanvasHandle {
  getGrid: () => string[][]
  setGrid: (grid: string[][]) => void
}

interface CanvasProps {
  selectedColour: string
}

const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ selectedColour }, ref) => {
  const setHasUnsavedCanvasChanges = useClientStateStore((state) => state.setHasUnsavedCanvasChanges)
  const [isDragging, setIsDragging] = useState(false)
  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: gridHeight }, () => Array(gridWidth).fill('#ffffff'))
  )

  // #region Load local/firebase storage

  useEffect(() => { // Hook to synchronise component with external system (database)
    // To stop dragging when mouse is released outside the canvas
    const handleGlobalMouseUp = () => setIsDragging(false)
    window.addEventListener('mouseup', handleGlobalMouseUp)
    window.addEventListener('touchend', handleGlobalMouseUp)

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('touchend', handleGlobalMouseUp)
    };
  }, [])

  // #endregion

  // #region Mouse event handlers

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
  
  // #endregion

  const colourPixel = (row: number, col: number) => {
    const newGrid = grid.map((rowArray, rowIndex) =>
      rowArray.map((colour, colIndex) =>
        rowIndex === row && colIndex === col ? selectedColour : colour
      )
    )
    setGrid(newGrid)

    setHasUnsavedCanvasChanges(true)
    localStorage.setItem(LOCAL_STORAGE_KEYS.HAS_UNSAVED_CHANGES, "true")
    localStorage.setItem(LOCAL_STORAGE_KEYS.PIXEL_GRID, JSON.stringify(newGrid))
  }

  useImperativeHandle(ref, () => ({
    getGrid: () => grid,
    setGrid: (newGrid: string[][]) => setGrid(newGrid),
  }))
  
  return (
    <div className='canvas-container' id="canvas container">
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
    </div>
  )
})

export default Canvas;