import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Package, Shirt, Scan, LayoutDashboard } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Shirts from './pages/Shirts';
import Shipments from './pages/Shipments';
import Scanner from './pages/Scanner';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="font-bold text-xl text-blue-600 flex items-center gap-2">
            <Package className="w-6 h-6" />
            DistriTrack
          </div>
          <div className="flex gap-6 text-sm font-medium text-gray-600">
            <Link to="/" className="flex items-center gap-2 hover:text-blue-600"><LayoutDashboard className="w-4 h-4" /> Dashboard</Link>
            <Link to="/shirts" className="flex items-center gap-2 hover:text-blue-600"><Shirt className="w-4 h-4" /> Inventory</Link>
            <Link to="/shipments" className="flex items-center gap-2 hover:text-blue-600"><Package className="w-4 h-4" /> Shipments</Link>
            <Link to="/scan" className="flex items-center gap-2 hover:text-blue-600"><Scan className="w-4 h-4" /> Scanner</Link>
          </div>
        </nav>
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/shirts" element={<Shirts />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/scan" element={<Scanner />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
