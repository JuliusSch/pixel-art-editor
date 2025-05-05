import '../styles/ConfimationPopup.css'
import { useEffect } from 'react'

interface ConfirmationPopupProps {
  message: string
  isOpen: boolean
  onClose: () => void
  resolvePromise: (value: boolean) => void
}

export default function ConfirmationPopup(props: ConfirmationPopupProps) {
  useEffect(() => {
    if (!props.isOpen) {
      props.onClose()
    }
  }, [props])

  if (!props.isOpen) return null

  const handleConfirm = () => {
    props.resolvePromise(true)
  }

  const handleCancel = () => {
    props.resolvePromise(false)
  }

  const handleClose = () => {
    props.onClose()
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
      <button className="popup-close-button" onClick={handleClose}>&times;</button>
        <p className="popup-message">{props.message}</p>
        <div className="popup-buttons">
          <button onClick={handleConfirm}>Confirm</button>
          <button onClick={handleCancel}>Deny</button>
        </div>
      </div>
    </div>
  )  
}