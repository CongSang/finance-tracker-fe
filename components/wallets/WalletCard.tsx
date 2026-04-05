'use client'

import { Pencil, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { formatDisplay } from '@/lib/index';

interface WalletCardProps {
    ref?: React.Ref<HTMLDivElement>;
    title: string;
    balance: number;
    color: string;
    onEdit?: () => void
    onDelete?: () => void
}


export const WalletCard = ({ title, balance, color, ref, onEdit, onDelete }: WalletCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      ref={ref}
      className="group bg-white rounded-xl p-6 shadow hover:shadow-lg transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-6">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center" 
          style={{ backgroundColor: color }}>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-2 hover:bg-gray-50 text-gray-500 hover:text-primary rounded-full transition-colors">
            <Pencil size={14} />
          </button>
          {/* <button className="p-2 hover:bg-gray-50 rounded text-on-surface-variant transition-colors">
            <Eye size={14} />
          </button> */}
          <button onClick={onDelete} className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div>
        <h4 className="font-bold text-primary md:text-lg mb-2">{title}</h4>
        
        <div className="pt-2 border-t border-gray-100">
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
            Số dư khả dụng
          </span>
          <p className="text-base md:text-xl font-headline font-extrabold text-primary">
            {formatDisplay(balance.toString())}đ
          </p>
        </div>
      </div>
    </motion.div>
  )
}
