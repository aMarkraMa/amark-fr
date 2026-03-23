import { createBrowserRouter } from "react-router-dom";
import { Home } from '@/pages/Home/index';
import { Blog } from '@/pages/Blog/index';

const routes = [
    { 
        path: '/',
        element: <Home />
    },
    {
        path: '/about',
        element: <Blog />
    }
]
export const router = createBrowserRouter(routes);
