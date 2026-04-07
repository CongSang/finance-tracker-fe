import { cn } from '@/lib/index'
import { Transaction } from '@/types/index'
import { motion } from 'motion/react'
import { CategoryIcon } from '../categories/CategoryIcon'
import moment from 'moment'
import { Pencil, Trash2 } from 'lucide-react'

interface TransactionRowProps {
  transaction: Transaction, 
  index: number,
  ref?: React.Ref<HTMLTableRowElement>;
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

export const TransactionRow = ({ transaction, index, ref, onEdit, onDelete } : TransactionRowProps) => {

  const checkAmount = (transaction: Transaction) => {
    if(transaction.category.type === "TRANSFER") {
      if(transaction.note.includes("Nhận tiền từ ví")) {
        return true;
      } 
      return false 
    }

    if (transaction.category.type === "INCOME") return true;
    return false
  }

  return (
    <motion.tr
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group bg-gray-200/50 hover:bg-gray-50 transition-all duration-300 cursor-pointer"
    >
      <td className="px-4 py-3 rounded-l-lg">
        <p className="font-semibold text-xs tracking-tight">{moment(transaction.transactionDate).format("DD/MM/YYYY HH:mm")}</p>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-4">
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shadow-sm bg-secondary text-primary")}>
            <CategoryIcon size={14} name={transaction.category.iconUrl} />
          </div>
          <span className="font-bold text-primary text-sm">{transaction.category.name}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span 
          className="px-2 py-1 text-[10px] font-black text-white rounded-full uppercase tracking-widest whitespace-nowrap" 
          style={{ backgroundColor: transaction.wallet.colorCode }}
        >
          {transaction.wallet.name}
        </span>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm font-medium italic truncate max-w-60">
          {transaction.note}
        </p>
      </td>
      <td className="px-4 py-3 text-right whitespace-nowrap">
        <span className={cn(
          "font-extrabold text-base tracking-tight",
          checkAmount(transaction) ? "text-emerald-600" : "text-rose-500"
        )}>
          {checkAmount(transaction) ? "+" : "-"} {Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}đ
        </span>
      </td>
      <td className="px-4 py-3 rounded-r-lg whitespace-nowrap">
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => onEdit(transaction)} className="p-2 hover:bg-gray-100 text-gray-500 hover:text-primary rounded-full transition-colors">
            <Pencil size={14} />
          </button>
          {/* <button className="p-2 hover:bg-gray-50 rounded text-on-surface-variant transition-colors">
            <Eye size={14} />
          </button> */}
          <button onClick={() => onDelete(transaction)} className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </motion.tr>
  )
}
