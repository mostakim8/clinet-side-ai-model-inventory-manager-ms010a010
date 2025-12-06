import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider.jsx'; 
// Named imports ব্যবহার করা হয়েছে যাতে 'SyntaxError' সমস্যাটি না আসে।
import { Home } from './pages/Home/Home.jsx';
import { ModelDetails } from './pages/Model/ModelDetails.jsx';
import { PurchaseHistory } from './pages/User/PurchaseHistory.jsx';
import { Login } from './pages/Auth/Login.jsx'; 
import Register from './pages/Auth/Register.jsx';

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/model/:id" element={<ModelDetails />} />


          <Route path="/purchase-history" element={<PurchaseHistory />} />

          <Route path="/login" element={<Login />} />


      <Route path="/register" element={<Register />} />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;