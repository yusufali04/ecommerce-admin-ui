import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Catagories from "./pages/Catagories";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />
    },
    {
        path: '/catagories',
        element: <Catagories />
    }
])