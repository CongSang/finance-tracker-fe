'use client'

import { Input, LayoutModalPopup } from '@/components/index'
import { toastError } from '@/lib/utils'
import { getCategoriesApi } from '@/services/categoryService'
import { Budget, BudgetRequest, Category } from '@/types/index'
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface UpsertBudgetModalProps {
  title?: string
  subtitle?: string
  isOpen: boolean
  initData?: Budget | null
  isEditing?: boolean
  optionsMonth: number[];
  optionsYear: number[];
  onClose: () => void
  onSubmit: (budget: BudgetRequest) => Promise<void>
}

export const UpsertBudgetModal = ({ 
  title, 
  subtitle, 
  isOpen, 
  isEditing = false, 
  initData, 
  optionsMonth,
  optionsYear,
  onClose, 
  onSubmit 
} : UpsertBudgetModalProps) => {
  const [budget, setBudget] = useState<BudgetRequest>({
    id: null,
    amountLimit: null,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    categoryId: null,
  })
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBudget(prev => ({ ...prev, [name]: value }));
  }

  const fetchCategories = async () => {
    const cat = await getCategoriesApi();

    setCategories(cat?.filter((item: Category) => item.type === "EXPENSE").map((item: Category) => {
                  return {
                    value: item.id,
                    label: item.name
                  }
                }) || [])
  }

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		const validations = [
      { cond: !budget.month, msg: "Vui lòng chọn tháng" },
      { cond: Number(budget.amountLimit) <= 0, msg: "Vui lòng nhập số tiền lớn hơn 0" },
      { cond: !budget.categoryId, msg: "Vui lòng chọn danh mục" },
      { cond: !budget.year, msg: "Vui lòng chọn năm" },
    ];

    const error = validations.find(v => v.cond);
    if (error) return toast.error(error.msg);

		setLoading(true)
    try {
      await onSubmit(budget)
      toast.success(isEditing ? 'Cập nhật ngân sách thành công' : 'Thêm mới ngân sách thành công')
      onClose()
    } catch (error) {
      console.error('Lỗi khi tạo/ sửa ngân sách:', error)
      toastError(error, 'Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
	}

  useEffect(() => {
    if (isOpen) {
      if (isEditing && initData) {
        setBudget({
          id: initData.id,
          amountLimit: initData.amountLimit,
          month: initData.month,
          year: initData.year,
          categoryId: initData.category.id || null,
        });
      } else {
        setBudget({
          id: null,
          amountLimit: null,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          categoryId: null,
        });
      }
    }
  }, [isOpen, isEditing, initData])

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <LayoutModalPopup isOpen={isOpen} onClose={onClose} title={title} subtitle={subtitle}>
      <div>
        <form className="w-full space-y-4 text-left">
          <Input 
            isSelect
            name="categoryId"
            value={budget.categoryId}
            disabled={loading}
            onChange={(e) => handleInputChange(e)}
            label="Danh mục"
            placeholder='Chọn danh mục'
            options={categories}
          />

          <Input 
            name="amountLimit"
            value={budget.amountLimit}
            disabled={loading}
            onChange={(e) => handleInputChange(e)}
            label="Số tiền giới hạn" 
            placeholder="0.00" 
            type="number" 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="block text-sm max-sm:text-xs font-semibold">
                Tháng
              </label>
              <select 
                name='month'
                value={budget.month || ""}
                disabled={loading}
                onChange={(e) => handleInputChange(e)}
                className="px-4 py-3 border rounded-lg bg-white border-third focus:outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary"
              >
                {optionsMonth.map(m => (
                  <option key={m} value={m}>Tháng {m}</option>
                ))}
              </select>
            </div>

            {/* Dropdown Năm */}
            <div className="flex flex-col gap-1">
              <label className="block text-sm max-sm:text-xs font-semibold">
                Năm
              </label>
              <select 
                name='year'
                value={budget.year || ""}
                disabled={loading}
                onChange={(e) => handleInputChange(e)}
                className="px-4 py-3 border rounded-lg bg-white border-third focus:outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary"
              >
                {optionsYear.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full btn-primary mt-4"
					>
            {isEditing ? 'Cập nhật ngân sách' : 'Thêm Ngân sách'}
					</button>
        </form>
      </div>
    </LayoutModalPopup>
  )
}
