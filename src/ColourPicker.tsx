import React from 'react'
import { HexColorPicker } from "react-colorful";

interface ColourPickerProps {
  selectedColour: string
  onColourChange: (colour: string) => void
}

const ColourPicker: React.FC<ColourPickerProps> = ({ selectedColour, onColourChange }) =>
{
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
      <HexColorPicker
        color={selectedColour}
        onChange={onColourChange}
        style={{ width: '100%', maxWidth: '200px', margin: '10px 0' }}
      />
      <div style={{
        marginTop: '10px',
        padding: '5px 10px',
        borderRadius: '5px',
        backgroundColor: selectedColour,
        color: '#fff',
        fontWeight: 'bold',
      }}>
        {selectedColour.toUpperCase()}
      </div>
    </div>
    // <input
    //   type = "colour"
    //   value = {selectedColour}
    //   onChange = {(e) => onColourChange(e.target.value)}
    //   style = {{ marginBottom: '10px' }}
    // />
  )
}

export default ColourPicker