import { Outlet, useLocation } from "react-router-dom"
import { Nav } from "@/components/layout/Nav"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { NAV_ITEMS } from "@/config/site"
export const Layout = () => {
    const { pathname } = useLocation()
    return (
        <>
            <header className="sticky top-0 z-50 max-w-screen overflow-x-hidden bg-background px-2 pt-2">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center mx-auto screen-line-top screen-line-bottom h-12 border-x border-line px-2 md:max-w-3xl">
                    <Nav className="col-start-2" items={NAV_ITEMS} activeId={pathname}/>
                    <div className="justify-self-end">
                        <ThemeToggle />
                    </div>
                </div>
            </header>
            
            <main className="overflow-x-clip">
                <Outlet />
            </main>
        </>
    )
}
