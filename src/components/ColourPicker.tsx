import { HexColorPicker } from "react-colorful";
import { LOCAL_STORAGE_KEYS } from '../constants'

interface ColourPickerProps {
  selectedColour: string
  setSelectedColour: (colour: string) => void
}

function ColourPicker({ selectedColour, setSelectedColour }: ColourPickerProps)
{
  const handleColourChange = (colour: string) => {
      setSelectedColour(colour)
      localStorage.setItem(LOCAL_STORAGE_KEYS.SELECTED_COLOUR, colour)
    }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
      <HexColorPicker
        color={selectedColour}
        onChange={handleColourChange}
        style={{ width: '100%', maxWidth: '292px', margin: '10px 0' }}
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
  )
}

export default ColourPicker