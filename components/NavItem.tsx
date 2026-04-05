'use client'

import Link from "next/link";
import { cn } from "../lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

interface NavItemProps {
  icon: LucideIcon;
  label: string;
    href: string;
  active?: boolean;
}

export const NavItem = ({ icon: Icon, label, href }: NavItemProps) => {
	const pathname = usePathname();

	return (
  <Link 
    href={href} 
    className={cn(
      "flex items-center gap-4 px-4 py-3 transition-all rounded-lg",
      pathname === href 
        ? "text-primary font-bold bg-white" 
        : "text-[#43474c] hover:text-primary hover:bg-white/60 hover:font-medium"
    )}
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm">{label}</span>
  </Link>
)
};