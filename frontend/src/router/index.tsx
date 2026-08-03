import { createBrowserRouter } from "react-router-dom";
import { Home } from '@/pages/Home/index';
import { Layout } from '@/components/layout/Layout'
import { Chat } from "@/pages/Chat";
import { Blog } from "@/pages/Blog";
import { BlogPost } from "@/pages/Blog/Post";
import { Project } from "@/pages/Project";
import { ProjectDetail } from "@/pages/Project/Detail";

const routes = [
    { 
        element:<Layout />,
        children: [
            {path: "/", element: <Home/>},
            {path: "/chat", element:<Chat/>},
            {path: "/blog", element: <Blog />},
            {path: "/blog/:slug", element: <BlogPost />},
            {path: "/project", element: <Project />},
            {path: "/project/:slug", element: <ProjectDetail />},
        ],
    },
];
export const router = createBrowserRouter(routes);
