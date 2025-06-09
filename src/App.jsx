import React from 'react'
import SkipSize from './components/SkipSize'
import { Routes, Route } from 'react-router-dom'
import WasteType from './components/WasteType'
const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<SkipSize />} />
      <Route path="/waste-type" element={<WasteType />} />
    </Routes>
    </>
  )
}

export default App