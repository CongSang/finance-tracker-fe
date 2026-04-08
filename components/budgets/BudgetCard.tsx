import { AlertCircle, Goal, Pencil, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { BudgetAnalysis } from '@/types/index'
import { CategoryIcon } from '@/components/index';
import { formatDisplay } from '@/lib/utils';

interface BudgetCardProps {
  index: number;
  data: BudgetAnalysis
  onEdit?: () => void
  onDelete?: () => void
}

export const BudgetCard = ({ index, data, onDelete, onEdit } : BudgetCardProps) => {

  const returnColor = (status: "GOOD" | "WARNING" | "DANGER") => {
    if (status === "GOOD") return '#4CAF50'
    if (status === "WARNING") return '#FFC107'
    return '#EF5350'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.05 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl p-8 shadow border border-gray-100 transition-all duration-300 relative group"
    >
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary">
          <CategoryIcon name={data.budget.category.iconUrl} />
        </div>
        <span className="text-lg font-bold text-primary">{data.budget.category.name}</span>
      </div>

      <div className="space-y-4">
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${data.percentUsed}%` }}
            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
            className="h-full rounded-full" 
            style={{ backgroundColor: returnColor(data.status) }}
          />
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-on-surface">
            <span className="font-bold">
              Đã sử dụng:</span> ${formatDisplay(data.actualSpent.toString())}đ / <span>Tối đa: ${formatDisplay(data.limitAmount.toString())}đ</span>
          </p>
        </div>
        <p className={`text-xs font-medium pt-2 flex items-center`} style={{ color: returnColor(data.status) }}>
          {data.status === "GOOD" ? <Goal className="w-3.5 h-3.5 mr-1" /> : <AlertCircle className="w-3.5 h-3.5 mr-1" />}
          {data.adviceMessage}
        </p>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-2 hover:bg-gray-50 text-gray-500 hover:text-primary rounded-full transition-colors">
          <Pencil size={14} />
        </button>
        <button onClick={onDelete} className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  )
}
