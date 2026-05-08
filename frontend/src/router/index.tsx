import { createBrowserRouter } from "react-router-dom";
import { Home } from '@/pages/Home/index';
import { Layout } from '@/components/layout/Layout'
import { Chat } from "@/pages/Chat";
const routes = [
    { 
        element:<Layout />,
        children: [
            {path: "/", element: <Home/>},
            {path: "/chat", element:<Chat/>},
        ],
    },
];
export const router = createBrowserRouter(routes);
