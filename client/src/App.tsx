import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/Registerpage';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace/>} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
    
    
  )
}

export default App
