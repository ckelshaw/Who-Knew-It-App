import { Routes, Route } from 'react-router-dom';
import AdminLogin from '../pages/AdminLogin';
import Dashboard from '../pages/Dashboard';
import HostRoute from '../pages/HostRoute';
import ContestantRoute from '../pages/ContestantRoute';
import './App.css'

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/host/:game_id/:user_id" element={<HostRoute />} />
        <Route path="/contestant/:game_id/:user_id" element={<ContestantRoute />} />
        <Route path="/host/:game_id" element={<HostRoute />} />
        <Route path="/contestant/:game_id" element={<ContestantRoute />} />
      </Routes>
    </>
  )
}

export default App
