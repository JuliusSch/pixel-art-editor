import React, { useState } from 'react';
import ColourPicker from './ColourPicker'

const Canvas: React.FC = () => {
  const gridHeight = 16
  const gridWidth = 16

  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: gridHeight }, () => Array(gridWidth).fill('#ffffff'))
  )

  const [selectedColour, setSelectedColour] = useState('#000000')

  const handleColourChange = (colour: string) => {
    setSelectedColour(colour)
  }

  const handlePixelClick = (row: number, col: number) => {
    const newGrid = grid.map((rowArray, rowIndex) =>
      rowArray.map((colour, colIndex) =>
        rowIndex === row && colIndex === col ? selectedColour : colour
      )
    )
    setGrid(newGrid)
  }

  return (
    <>
      <div>
        <ColourPicker selectedColour={selectedColour} onColourChange={handleColourChange} />
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${gridWidth}, 20px)` }}>
          {grid.map((row, rowIndex) =>
            row.map((colour, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handlePixelClick(rowIndex, colIndex)}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: colour,
                  border: '1px solid #ddd',
                }}
              />
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default Canvas;