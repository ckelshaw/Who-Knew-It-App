import { Routes, Route } from 'react-router-dom';
import AdminLogin from '../pages/AdminLogin';
import Dashboard from '../pages/Dashboard';
import HostWaitingRoom from '../pages/HostWaitingRoom';
import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/host/waiting-room/:game_id" element={<HostWaitingRoom />} />
      </Routes>
    </>
  )
}

export default App
