import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { BrowseListings } from './pages/Listings/BrowseListings';
import { CreateListing } from './pages/Listings/CreateListing';
import { Dashboard } from './pages/Dashboard/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/browse" element={<BrowseListings />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-listing" element={<CreateListing />} />
      </Routes>
    </Router>
  );
}

export default App;
