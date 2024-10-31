import React from 'react'

interface ColourPickerProps {
  selectedColour: string
  onColourChange: (colour: string) => void
}

const ColourPicker: React.FC<ColourPickerProps> = ({ selectedColour, onColourChange }) =>
{
  return (
    <input
      type = "colour"
      value = {selectedColour}
      onChange = {(e) => onColourChange(e.target.value)}
      style = {{ marginBottom: '10px' }}
    />
  )
}

export default ColourPicker