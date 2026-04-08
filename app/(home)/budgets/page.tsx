'use client'

import { ConfirmDelete, UpsertBudgetModal } from '@/components/index'
import { BudgetCard } from '@/components/index'
import { Empty, Loading } from '@/components/index'
import { useAuth } from '@/context/AuthContext'
import { toastError } from '@/lib/utils'
import { copyBudgetApi, deleteBudgetApi, getBudgetProgressApi, upsertBudgetApi } from '@/services/index'
import { BudgetAnalysis, BudgetFilter, BudgetRequest } from '@/types/index'
import { Copy, Plus } from 'lucide-react'
import { motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'

const Budgets = () => {
  const { user } = useAuth()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<BudgetAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<BudgetAnalysis[] | null>([])
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // [1, 2, ..., 12]
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: user?.createdAt ? currentYear - new Date(user.createdAt).getFullYear() + 1 : 10 }, (_, i) => currentYear - i);
  const [filter, setFilter] = useState<BudgetFilter>({ month: new Date().getMonth() + 1, year: currentYear })

  const fetchBudgets = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getBudgetProgressApi(filter)

      setData(response);
    } catch (error) {
      console.error('Lỗi khi tải ngân sách:', error)
      toastError(error, 'Không thể tải ngân sách. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }, [filter])

  const onAddNewCategory = async (budget: BudgetRequest) => {
    await upsertBudgetApi(budget)
    fetchBudgets()
  }

  const onEditCategory = async (budget: BudgetRequest) => {
    await upsertBudgetApi(budget)
    fetchBudgets()
  }

  const onDeleteCategory = async (budgetId: number) => {
    await deleteBudgetApi(budgetId);
    fetchBudgets()
  };

  const onCopyPreviousMonth = async () => {
    const date = new Date
    const toMonth = date.getMonth() + 1
    const toYear = date.getFullYear()
    const fromMonth = (toMonth === 1 ? 12 : toMonth - 1)
    const fromYear = (fromMonth === 12 ? toYear - 1 : toYear)

    setLoading(true) 

    try {
      await copyBudgetApi({ fromMonth, fromYear, toMonth, toYear })
      fetchBudgets()
    } catch(error) {
      console.error('Lỗi khi sao chép ngân sách:', error)
      toastError(error, 'Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      fetchBudgets()
    }, [fetchBudgets])

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-bold text-primary">Ngân sách</h2>
          <p>Tạo ngân sách để quản lý chi tiêu tốt hơn</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Dropdown Tháng */}
          <div className="flex flex-col gap-1">
            <select 
              value={filter.month || ""}
              disabled={loading}
              onChange={(e) => setFilter({...filter, month: Number(e.target.value)})}
              className="px-4 py-2 border rounded-lg bg-white border-third focus:outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary"
            >
              {months.map(m => (
                <option key={m} value={m}>Tháng {m}</option>
              ))}
            </select>
          </div>

          {/* Dropdown Năm */}
          <div className="flex flex-col gap-1">
            <select 
              value={filter.year || ""}
              disabled={loading}
              onChange={(e) => setFilter({...filter, year: Number(e.target.value)})}
              className="px-4 py-2 border rounded-lg bg-white border-third focus:outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="btn-primary flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <Plus size={18} />
            Thêm Ngân sách
          </button>
        </div>
      </div>

      {/* Summary Card */}
      {/* <section className="mb-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-10 shadow border border-gray-100"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest mb-1">Total Budget Used</p>
              <h2 className="text-7xl font-headline font-extrabold text-primary">64%</h2>
            </div>
            <div className="text-right">
              <p className="text-on-surface-variant text-sm mb-1">Total Monthly Limit</p>
              <p className="text-2xl font-semibold text-primary">$12,500.00</p>
            </div>
          </div>
          
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '64%' }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-linear-to-r from-primary to-secondary rounded-full" 
            />
          </div>
          <div className="flex justify-between mt-4 text-xs font-medium">
            <span>$8,000 Spent</span>
            <span>$4,500 Remaining</span>
          </div>
        </motion.div>
      </section> */}


      {data && data.length > 0 && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {data.map((item, i) => (
            <BudgetCard 
              key={item.budgetId}
              index={i}
              data={item}
              onEdit={() => {
                setSelectedBudget(item)
                setIsEditOpen(true)
              }}
              onDelete={() => {
                setSelectedBudget(item)
                setIsConfirmOpen(true)
              }}
            />
          ))}
        </section>
      )}

      {!loading && data && data.length === 0 && (
        <div className='flex flex-col items-center'>
          <Empty 
            title="Bạn chưa tạo ngân sách nào"
            subtitle="Hãy tạo một ngân sách mới để quản lý chi tiêu của bạn"
          />

          <button 
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-primary text-primary rounded-lg font-bold text-sm hover:bg-primary/5 active:scale-[0.98] transition-all"
            onClick={() => onCopyPreviousMonth()}
          >
            <Copy size={18} />
            Sao chép dữ liệu tháng trước
          </button>
        </div>
      )}
      {loading && !data?.length && (
        <div className='mt-10'><Loading /></div>
      )}

      <UpsertBudgetModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSubmit={onAddNewCategory}
        title="Thêm Danh mục"
        subtitle="Tạo danh mục mới để quản lý tài sản của bạn"
        optionsMonth={months}
        optionsYear={years}
      />

      <UpsertBudgetModal 
        isEditing
        initData={selectedBudget?.budget}
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        onSubmit={onEditCategory}
        title="Sửa Danh mục"
        subtitle="Chỉnh sửa thông tin danh mục"
        optionsMonth={months}
        optionsYear={years}
      />

      <ConfirmDelete
        title={`Bạn có chắc chắn muốn xóa ngân sách danh mục ${selectedBudget?.budget.category.name}?`}
        message='Hành động này sẽ ảnh hưởng đến các giao dịch liên quan. Dữ liệu lịch sử liên quan đến danh mục này cũng sẽ bị xóa.'
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onDelete={() =>
          selectedBudget
            ? onDeleteCategory(selectedBudget.budgetId!)
            : Promise.resolve()
        } 
      />
    </div>
  )
}

export default Budgets