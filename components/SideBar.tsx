'use client';

import { Box, LayoutDashboard, PiggyBank, Plus, ReceiptText, Settings, Wallet } from 'lucide-react'
import { NavItem } from './index'

export const SideBar = () => {

  return (
    <aside className='w-64 h-screen bg-background border-r border-gray-200/50 p-5 sticky top-0 z-20 flex flex-col'>
			<div className="flex items-center gap-3 px-4 mb-12">
				<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
					<Wallet className="text-white w-5 h-5" />
				</div>
				<div>
					<h2 className="text-md md:text-lg font-black text-primary leading-none">Finance Tracker</h2>
					<p className="text-[10px] uppercase tracking-widest mt-1">Wealth Management</p>
				</div>
   	 	</div>

			<nav className="flex-1 space-y-2">
				<NavItem icon={LayoutDashboard} label="Dashboard" href='/' />
				<NavItem icon={Wallet} label="Ví" href='/wallets' />
				<NavItem icon={Box} label="Danh mục" href='/categories' />
				<NavItem icon={ReceiptText} label="Giao dịch" href='/transactions' />
				<NavItem icon={PiggyBank} label="Ngân sách" href='/budgets' />
				<NavItem icon={Settings} label="Cài đặt" href='/settings' />
			</nav>

			<div className="mt-auto px-4">
				<button className="btn btn-primary w-full flex items-center justify-center gap-2">
					<Plus className="w-4 h-4" />
					New Transaction
				</button>
    </div>
    </aside>
  )
}
