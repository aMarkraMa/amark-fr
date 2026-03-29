import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import React from "react";
import type { NavItemType } from "@/types/nav"
interface NavProps{
    items: NavItemType[];
    activeId?: string;
    className?: string;
}
export const Nav = ({items, activeId, className}: NavProps) => {
    const { pathname } = useLocation();
    const currentPath = activeId ?? pathname;

    return (
        <nav data-active-id={currentPath} className={cn("flex items-center gap-4", className)}>

            {items.map(({title, path}) => {
                const active = currentPath === path || 
                    (path === "/" 
                        ? ["/", "/index"].includes(currentPath) 
                        : currentPath.startsWith(path));
                return (
                    <NavItem key={path} to={path} active={active}>
                        {title}
                    </NavItem>
                );
            })}
        </nav>
    )
    
}

interface NavItemProps extends React.ComponentProps<typeof Link>{
    active: boolean;
}
export const NavItem = ({active, ...props} : NavItemProps) => {
    return (
        <Link 
            className = {cn(
                "font-mono text-sm font-medium text-muted-foreground transition-color duration-300",
                 active && "text-foreground"
            )}
            {...props}
        />
    );
}
