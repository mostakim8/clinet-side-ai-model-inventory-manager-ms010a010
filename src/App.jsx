import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider.jsx'; 
import { Home } from './pages/Home/Home.jsx';
import { ModelDetails } from './pages/Model/ModelDetails.jsx';
import { PurchaseHistory } from './pages/User/PurchaseHistory.jsx';
import { login } from './pages/auth/Login.jsx'; 
import register from './pages/auth/Register.jsx';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" 
          element={<Home />} 
          />

          <Route path="/model/:id" 
          element={<ModelDetails />} 
          />

          <Route path="/purchase-history" 
          element={<PurchaseHistory />} 
          />

          <Route path="/login" 
          element={<login />} 
          />

          <Route path="/register" 
          element={< register />} 
          />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;