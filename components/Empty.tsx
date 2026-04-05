'use client'

import { motion } from "motion/react"

interface EmptyProps {
	title?: string;
	subtitle?: string;
}

export const Empty = ({ title, subtitle }: EmptyProps) => {
  return (
    <motion.div 
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className="relative z-10 flex flex-col items-center text-center w-full"
		>
			{/* Wealth Veil - Decorative Glow */}

			{/* Illustration */}
			<div className="mb-8 relative">
				<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
					{/* Wallet Outline */}
					<motion.rect 
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{ duration: 1.5, ease: "easeInOut" }}
						x="50" y="80" width="100" height="70" rx="12" 
						stroke="#94B4C1" strokeWidth="2" strokeDasharray="4 4" 
					/>
					<motion.path 
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
						d="M50 110H150" stroke="#94B4C1" strokeWidth="2" strokeLinecap="round" 
					/>
					{/* Floating Coins */}
					<motion.circle 
						animate={{ y: [0, -10, 0] }}
						transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
						cx="80" cy="50" r="10" stroke="#547792" strokeWidth="1.5" 
					/>
					<motion.circle 
						animate={{ y: [0, -15, 0] }}
						transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
						cx="120" cy="35" r="8" stroke="#94B4C1" strokeWidth="1.5" 
					/>
					<motion.circle 
						animate={{ y: [0, -8, 0] }}
						transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
						cx="150" cy="65" r="12" stroke="#547792" strokeWidth="1.5" 
					/>
					{/* Sparkles */}
					<circle cx="60" cy="30" r="2" fill="#94B4C1" />
					<circle cx="170" cy="45" r="2" fill="#547792" />
					<circle cx="40" cy="70" r="2" fill="#94B4C1" />
				</svg>
			</div>

			{/* Typography */}
			<h1 className="font-extrabold text-primary mb-6 tracking-tight">
				{title || "Không có ví nào được thêm vào"}
			</h1>
			<p className="text-lg leading-relaxed mb-12 max-w-lg mx-auto">
				{subtitle || "Hãy bắt đầu bằng cách thêm ví mới để quản lý tài sản của bạn một cách hiệu quả!"}
			</p>
		</motion.div>
  )
}
