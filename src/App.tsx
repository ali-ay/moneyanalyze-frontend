import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalStyles } from './styles/GlobalStyles';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Home from './pages/Home/Home';
import Wallet from './pages/Wallet/Wallet';
import Deposit from "./pages/Wallet/Deposit/Deposit";


function App() {
  return (
    <Router>
      <GlobalStyles />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/wallet/deposit" element={<Deposit />} /> {/* Yeni eklenen route */}
        {/* Varsayılan olarak login'e yönlendir */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;