import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Shirts from './pages/Shirts';
import Shipments from './pages/Shipments';
import Scanner from './pages/Scanner';
import { LayoutDashboard, Shirt, Truck, Scan, Menu } from 'lucide-react';

function NavLink({ to, icon: Icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105'
          : 'text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-md'
        }`}
    >
      <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 font-sans">
        {/* Sidebar */}
        <nav className="w-64 bg-slate-50 p-6 flex-shrink-0 border-r border-slate-200 hidden md:block">
          <div className="mb-10 flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transform rotate-3 shadow-indigo-200 shadow-lg">
              <Shirt className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">ShirtTracker</h1>
          </div>

          <div className="space-y-2">
            <NavLink to="/" icon={LayoutDashboard} label="Dashboard" />
            <NavLink to="/shirts" icon={Shirt} label="Inventory" />
            <NavLink to="/shipments" icon={Truck} label="Shipments" />
            <NavLink to="/scan" icon={Scan} label="Scanner" />
          </div>

          <div className="mt-auto pt-10 px-4">
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <h4 className="text-sm font-semibold text-indigo-900 mb-1">Pro Tip</h4>
              <p className="text-xs text-indigo-600/80">Use the scanner for quick updates.</p>
            </div>
          </div>
        </nav>

        {/* Mobile Nav (Bottom) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex justify-around p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <Link to="/" className="text-slate-500 hover:text-indigo-600"><LayoutDashboard /></Link>
          <Link to="/shirts" className="text-slate-500 hover:text-indigo-600"><Shirt /></Link>
          <Link to="/scan" className="p-4 bg-indigo-600 text-white rounded-full -mt-8 shadow-lg shadow-indigo-300 border-4 border-slate-50"><Scan /></Link>
          <Link to="/shipments" className="text-slate-500 hover:text-indigo-600"><Truck /></Link>
          <div className="w-6"></div> {/* Spacer for symmetry if needed, or menu */}
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto mb-20 md:mb-0">
          <div className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/shirts" element={<Shirts />} />
              <Route path="/shipments" element={<Shipments />} />
              <Route path="/scan" element={<Scanner />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
