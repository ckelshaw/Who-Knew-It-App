import { Routes, Route } from 'react-router-dom';
import AdminLogin from '../pages/AdminLogin';
import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
      </Routes>
    </>
  )
}

export default App
