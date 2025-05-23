import React from "react"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from "./components/HomePage"
import QRScanner from "./components/QrScanner"



function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/qr" element={<QRScanner />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
