import React from 'react'
import Dashboard from './pages/Dashboard'
import Browse from './pages/Browse'
import { BrowserRouter,Route,Routes } from 'react-router'


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/browse' element={<Browse/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
