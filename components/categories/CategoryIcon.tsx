import { ICON_MAP } from "@/lib/index";
import { HelpCircle } from "lucide-react";

export const CategoryIcon = ({ name, className, size = 24 }: { name: string, className?: string, size?: number }) => {
  const Icon = ICON_MAP[name as keyof typeof ICON_MAP] ?? HelpCircle;
  return <Icon size={size} className={className} />;
};