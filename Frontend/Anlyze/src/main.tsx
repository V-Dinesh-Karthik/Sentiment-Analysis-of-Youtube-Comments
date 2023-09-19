import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Home from './pages/Home.tsx'
import Register from './pages/Register.tsx'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register/>} />
        <Route path='/home' element={<Home/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
