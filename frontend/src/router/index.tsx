import { createBrowserRouter } from "react-router-dom";
import { Home } from '@/pages/Home/index';
import { Layout } from '@/components/layout/Layout'
import { Chat } from "@/pages/Chat";
import { Blog } from "@/pages/Blog";
import { BlogPost } from "@/pages/Blog/Post";

const routes = [
    { 
        element:<Layout />,
        children: [
            {path: "/", element: <Home/>},
            {path: "/chat", element:<Chat/>},
            {path: "/blog", element: <Blog />},
            {path: "/blog/:slug", element: <BlogPost />},
        ],
    },
];
export const router = createBrowserRouter(routes);
