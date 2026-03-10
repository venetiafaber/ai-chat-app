import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import './App.css'
import { useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode}) => {
  const { user, isLoading } = useAuth();

  if(isLoading) {
    // animate loading 
    return(
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full'></div>
      </div>
    );
  }

  if(!user) {
    return <Navigate to='/login' replace />
  }

  return(
    <>
      {children}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route 
          path='/' 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        
        />
        
        <Route 
          path='/chat' 
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
    
    
  )
}

export default App
