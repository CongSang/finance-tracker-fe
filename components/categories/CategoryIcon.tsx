import { ICON_MAP } from "@/lib/index";
import { HelpCircle } from "lucide-react";

export const CategoryIcon = ({ name, className }: { name: string, className?: string }) => {
  const Icon = ICON_MAP[name as keyof typeof ICON_MAP] ?? HelpCircle;
  return <Icon size={24} className={className} />;
};