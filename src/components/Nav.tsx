import React from "react";
import { Link, useLocation } from "react-router-dom";



type NavProps = {
  items: NavItemType[];
  className?: string;
};

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Nav({ items, className }: NavProps) {
  const location = useLocation();
  const activeId = location.pathname;

  return (
    <nav
      data-active-id={activeId}
      className={cn("nav-container", className)}
    >
      {items.map(({ title, href }) => {
        const active =
          activeId === href ||
          (href === "/"
            ? ["/", "/index"].includes(activeId)
            : activeId.startsWith(href));

        return (
          <NavItem key={href} href={href} active={active}>
            {title}
          </NavItem>
        );
      })}
    </nav>
  );
}
type NavItemType = {
  title: string;
  href: string;
};

type NavItemProps = {
  href: string;
  children: React.ReactNode;
  active?: boolean;
};

export function NavItem({ href, children, active }: NavItemProps) {
  return (
    <Link
      to={href}
      className={cn("nav-link", active && "nav-link-active")}
    >
      {children}
    </Link>
  );
}