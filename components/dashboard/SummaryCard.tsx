import React from 'react'
import { cn, formatDisplay } from '../../lib/utils'
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
	title: string;
	value: string | number;
	icon: LucideIcon;
	subtext?: string;
  isPercent?: boolean
	color?: "primary" | "error" | "success";
}


export const SummaryCard = ({ title, value, icon: Icon, subtext, color = "primary", isPercent = false }: SummaryCardProps) => {
  return (
		<div className="bg-white p-6 rounded-xl shadow flex flex-col justify-between h-28 md:h-40">
			<div className="flex justify-between items-start">
				<p className="text-[10px] md:text-xs font-bold uppercase tracking-widest">
					{title}
				</p>
				<Icon className={cn("w-5 h-5", color === "error" ? "text-red-600" : color === "success" ? "text-green-600" : "text-blue-600")} />
			</div>


			<h1 className="font-extrabold text-primary tracking-tight">
				{!isPercent ? formatDisplay(value.toString()) : `${value}%`}
			</h1>

			<div className="mt-2">
				{subtext && (
					<div className="flex items-center gap-2 mt-2">
						{color === "error" && <span className="w-2 h-2 rounded-full bg-red-600"></span>}
						<p className="text-[10px] font-medium">{subtext}</p>
					</div>
				)}
			</div>
		</div>
)
}
