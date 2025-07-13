import React from 'react'
import "./QrCode_modal.scss"
import { QRCodeSVG } from 'qrcode.react'

function QrCode_modal({qrCode, openKeychainApp}) {
  return (
    <div className={`modal `}>
        <div className="overlay" onClick={close}></div>
        <div
        className={`modal-content  `}
        onClick={(e) => e.stopPropagation()} 
         >
              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <p>Scan this QR in Hive Keychain:</p>
                  <div onClick={openKeychainApp} style={{ cursor: 'pointer', display: 'inline-block' }}>
                      <QRCodeSVG value={qrCode} size={180} />
                      <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#007bff' }}>
                          Click QR to open in Keychain app
                      </p>
                  </div>
              </div>
        </div>
        </div>
            
  )
}

export default QrCode_modal