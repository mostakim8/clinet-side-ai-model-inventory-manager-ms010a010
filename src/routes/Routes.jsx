import { createBrowserRouter, Outlet } from "react-router-dom";

// Layout
import MainLayout from "../layouts/MainLayouts";
import PrivateRoute from "./PrivateRoute";
// pages
import WelcomeScreen from "../pages/Welcome/WelcomeScreen";
// Error Page
import ErrorPage from "../pages/NotFound/NotFound404";  
// import {Login} from "../pages/auth/Login";
// import Register from "../pages/auth/Register";

import {Home} from "../pages/Home/Home";

import AddModel from "../pages/Model/AddModel";

import MyModels from "../pages/Model/MyModels";
import UpdateModel from "../pages/Model/UpdateModel";
import {PurchaseHistory} from "../pages/PurchaseHistory/PurchaseHistory"; 

import {ModelDetails} from "../pages/Model/ModelDetails";

import ProfileUpdate from "../pages/ProfileUpdate/ProfileUpdate"; 
import AllModels from "../pages/Model/AllModels";
import { Login } from "../pages/auth/login.jsx";
import Register from "../pages/auth/register.jsx";

const SERVER_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const updateModelLoader = async ({ params }) => {


    const id = params.id;
    const res = await fetch(`${SERVER_BASE_URL}/models/${id}`);
    
    if (!res.ok) {
        throw new Response("Model Not Found", { status: 404 });
    }
    return res.json();
};


const Routes = createBrowserRouter([
    {
        path: "/",
        element: <WelcomeScreen />, 
        errorElement: <ErrorPage />, 
    },
    
    { 
        path: "login", 
        element: < login/> 
    },
    { 
        path: "register", 
        element: <register/> 
    },

    {
        path: "/app",
        element:<MainLayout />,

        errorElement: <ErrorPage />,

        children: [
            { 
                index: true, 
                element: <Home /> 
            },

            {
              path: "models", 
              element: <AllModels/>
            },
           
            { 
                path: "add-model", 
                element: <PrivateRoute>
                    <AddModel />
                    </PrivateRoute>
            },

            { 
                path: "my-models", 
                element: <PrivateRoute>
                    <MyModels /> 
                    </PrivateRoute>
                 
            },

            { 
                path: "update-model/:id", 
                element: 
                <PrivateRoute>
                    <UpdateModel />
                    </PrivateRoute>,
                loader: updateModelLoader, 
            },

            { 
                path: "purchase-history",
                element: 
                <PrivateRoute> 
                    <PurchaseHistory />
                    </PrivateRoute> 
            },

            { 
                path: "model/:id", 
                element: <PrivateRoute>
                    <ModelDetails />
                </PrivateRoute>
                 
            },
           
            { 
                path: "profile-update",
                element: <PrivateRoute>
                    <ProfileUpdate />
                    </PrivateRoute> 
            },
        ],
    },
]);

export default Routes;