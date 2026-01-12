import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Orders from './pages/Orders';
import Inventory from './pages/Inventory';
import ProductCatalog from './pages/ProductCatalog';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="orders" element={<Orders />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="catalog" element={<ProductCatalog />} />
          <Route path="*" element={<Navigate to="/orders" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
