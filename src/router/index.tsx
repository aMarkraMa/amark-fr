import { createBrowserRouter } from "react-router-dom";
import { Home } from '@/pages/Home/index';
import { Layout } from '@/components/layout/Layout'
const routes = [
    { 
        element:<Layout />,
        children: [
            {path: "/", element: <Home />},
        ],
    },
];
export const router = createBrowserRouter(routes);
