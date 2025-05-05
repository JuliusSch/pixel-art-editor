import { useState } from "react"
import { Drawing } from "../services/DrawingsService"
import '../styles/sidePanel.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"

interface SidePanelProps {
  savedDrawings: Drawing[],
  loadDrawing: (drawing: Drawing, loadToLocalStorage: boolean) => void
}

export default function SidePanel({savedDrawings, loadDrawing} : SidePanelProps) {
  
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen)
  }

  return (
    <div className={`side-panel-container ${isSidePanelOpen ? 'open' : 'closed'}`} >
      <div className={`saved-drawings-panel ${isSidePanelOpen ? 'open' : 'closed'}`}>
        <h2>Saved Drawings</h2>
        <ul className='saved-drawings-list'>
          {savedDrawings.map((drawing, index) => (
            <li key={index}>
              <button className="saved-drawing-button" onClick={() => loadDrawing(drawing, true)}>{drawing.name}</button>
            </li>
          ))}
        </ul>
      </div>
      <button className='side-panel-button' onClick={toggleSidePanel}>
        {isSidePanelOpen ? <FontAwesomeIcon icon={faArrowLeft} /> : <FontAwesomeIcon icon={faArrowRight} />}
      </button>
    </div>
  )
}