'use client'

import { TransactionType } from '@/lib/index';
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { CategoryIcon } from './CategoryIcon';
import { useRouter } from 'next/navigation';

interface CategoryCardProps {
  id: number;
  icon: string;
  title: string;
  type?: TransactionType;
  onEdit?: () => void
  onDelete?: () => void
}

export const CategoryCard = ({ 
  id,
  icon, 
  title,
  type,
  onEdit, 
  onDelete
} : CategoryCardProps) => {
  const router = useRouter()

  const onClickTransition = () => {
    router.push(`/transactions?categoryId=${id}`)
  }
  return (
    <motion.div 
      transition={{ duration: 0.2 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center text-primary">
          <CategoryIcon name={icon} />
        </div>

        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
          type === 'INCOME' && 'bg-green-500/20' 
        } ${ type === 'EXPENSE' && 'bg-red-500/20' } ${ type === 'TRANSFER' && 'bg-blue-500/20' }`}>
          {type}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-primary mb-1 font-headline">{title}</h3>

      <div className="absolute bottom-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-2 hover:bg-gray-50 text-gray-500 hover:text-primary rounded-full transition-colors">
          <Pencil size={14} />
        </button>
        <button onClick={onClickTransition} className="p-2 hover:bg-gray-50 rounded text-gray-500 transition-colors">
          <Eye size={14} />
        </button>
        <button onClick={onDelete} className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  )
}
