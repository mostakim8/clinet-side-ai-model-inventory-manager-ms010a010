import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import AuthProvider from './providers/AuthProvider';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddModel from './pages/AddModel';
import MyModels from './pages/MyModels';
import UpdateModel from './pages/UpdateModel';
// 🔑 CRITICAL NEW IMPORTS (Task 7 & 8)
import ModelDetails from './pages/ModelDetails'; 
import PurchaseHistory from './pages/PurchaseHistory'; 
import PrivateRoute from './routes/PrivateRoute'; // Assuming you have a PrivateRoute component

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<RootLayout />}>
                        {/* Public Routes */}
                        <Route index element={<Home />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        
                        {/* 🔑 CRITICAL PUBLIC ROUTE: Model Details Page (Task 7) */}
                        <Route path="models/:id" element={<ModelDetails />} /> 

                        {/* Private Routes (Requires Login) */}
                        <Route 
                            path="add-model" 
                            element={<PrivateRoute><AddModel /></PrivateRoute>} 
                        />
                        <Route 
                            path="my-models" 
                            element={<PrivateRoute><MyModels /></PrivateRoute>} 
                        />
                        <Route 
                            path="update-model/:id" 
                            element={<PrivateRoute><UpdateModel /></PrivateRoute>} 
                        />
                        {/* 🔑 CRITICAL PRIVATE ROUTE: Purchase History Page (Task 8) */}
                        <Route 
                            path="purchase-history" 
                            element={<PrivateRoute><PurchaseHistory /></PrivateRoute>} 
                        />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
