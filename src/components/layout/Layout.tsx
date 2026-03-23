import { Outlet } from "react-router"
import { Nav } from "@/components/layout/Nav"
import { NAV_ITEMS } from "@/config/site"
import { useLocation } from "react-router"
export const Layout = () => {
    const { pathname } = useLocation()
    return (
        <>
            <Nav items={NAV_ITEMS} activeId={pathname}/>
            <main>
                <Outlet />
            </main>
        </>
    )
}