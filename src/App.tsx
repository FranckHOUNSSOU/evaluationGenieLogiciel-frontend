import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Login from './Authentication/Login/Login'
import Register from './Authentication/Register/Register'
import Dashboard from './Pages/Dashboard/Dashboard'
import Products from './Pages/Dashboard/Products/Products'
import Purchases from './Pages/Dashboard/Purchases/Purchases'
import Statistics from './Pages/Dashboard/Statistics/Statistics'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/products" element={<Products />} />
        <Route path="/dashboard/purchases" element={<Purchases />} />
        <Route path="/dashboard/statistics" element={<Statistics />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
