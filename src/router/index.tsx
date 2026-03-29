import { createBrowserRouter } from "react-router-dom";
import { Home } from '@/pages/Home/index';
import { Blog } from '@/pages/Blog/index';
import { Layout } from '@/components/layout/Layout'
const routes = [
    { 
        element:<Layout />,
        children: [
            {path: "/", element: <Home/>},
            {path: "/Blog", element:<Blog/>},
        ],
    },
];
export const router = createBrowserRouter(routes);
