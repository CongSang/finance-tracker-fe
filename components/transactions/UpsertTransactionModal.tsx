'use client'
import { Input, LayoutModalPopup } from '@/components/index'
import { toastError, formatDateTimeLocal } from '@/lib/index'
import { Transaction, TransactionRequest } from '@/types/index'
import { ChangeEvent, useState, MouseEvent, useEffect } from 'react'
import toast from 'react-hot-toast'

interface UpsertTransactionProps {
  title?: string
  subtitle?: string
  isOpen: boolean
  initData?: Transaction | null
  isEditing?: boolean
  optionsWallet?: { value: string; label: string }[];
  optionsCategory?: { value: string; label: string }[];
  onClose: () => void
  onSubmit: (transaction: TransactionRequest) => Promise<void>
}

export const UpsertTransactionModal = ({ 
  title, 
  subtitle, 
  isOpen, 
  isEditing = false, 
  initData, 
  optionsCategory,
  optionsWallet,
  onClose, 
  onSubmit 
} : UpsertTransactionProps) => {
   const [transaction, setTransaction] = useState<TransactionRequest>({
    id: null,
    amount: null,
    transactionDate: null,
    note: "",
    categoryId: null,
    walletId: null
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTransaction(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		const validations = [
      { cond: !transaction.categoryId, msg: "Vui lòng chọn danh mục" },
      { cond: Number(transaction.amount) <= 0, msg: "Vui lòng nhập số tiền lớn hơn 0" },
      { cond: !transaction.walletId, msg: "Vui lòng chọn ví" },
      { cond: !transaction.transactionDate, msg: "Vui lòng chọn Ngày & Giờ giao dịch" },
    ];

    const error = validations.find(v => v.cond);
    if (error) return toast.error(error.msg);

		setLoading(true)
    try {
      await onSubmit({ ...transaction, amount: Number(transaction.amount) })
      toast.success(isEditing ? 'Cập nhật ví thành công' : 'Thêm mới ví thành công')
      onClose()
    } catch (error) {
      console.error('Lỗi khi tạo/ sửa ví:', error)
      toastError(error, 'Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
	}

  useEffect(() => {
      if (isOpen) {
        if (isEditing && initData) {
          setTransaction({
            id: initData.id,
            amount: initData.amount,
            transactionDate: formatDateTimeLocal(new Date(initData.transactionDate)),
            note: initData.note,
            categoryId: initData.category.id || null,
            walletId: initData.wallet.id || null
          });
        } else {
          setTransaction({
            id: null,
            amount: null,
            transactionDate: null,
            note: "",
            categoryId: null,
            walletId: null
          });
        }
      }
    }, [isOpen, isEditing, initData])
  
  return (
    <LayoutModalPopup isOpen={isOpen} onClose={onClose} title={title} subtitle={subtitle}>
      <div>
        <form className="w-full space-y-4 text-left">
          <Input 
            name="amount"
            value={transaction.amount}
            disabled={loading}
            onChange={(e) => handleInputChange(e)}
            label="Số tiền giao dịch" 
            placeholder="0.00" 
            type="number" 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              isSelect
              name="walletId"
              value={transaction.walletId}
              disabled={loading}
              onChange={(e) => handleInputChange(e)}
              label="Ví"
              placeholder='Chọn ví'
              options={optionsWallet}
            />

            <Input 
              isSelect
              name="categoryId"
              value={transaction.categoryId}
              disabled={loading}
              onChange={(e) => handleInputChange(e)}
              label="Danh mục"
              placeholder='Chọn danh mục'
              options={optionsCategory}
            />
          </div>

          <Input 
            name="transactionDate" 
            value={transaction.transactionDate}
            disabled={loading}
            label='Ngày & Giờ'
            type='datetime-local'
            onChange={(e) => handleInputChange(e)}
          />

          <div>
            <label className="block text-sm font-bold mb-1">
              Ghi chú
            </label>
            <textarea 
              name='note'
              value={transaction.note}
              disabled={loading}
              onChange={(e) => handleInputChange(e)}
              className="w-full border border-third focus:outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary transition-all placeholder:text-third rounded-lg px-4 py-3 text-sm resize-none" 
              placeholder="Nhập ghi chú cho giao dịch này (tùy chọn)" 
              rows={3}
            ></textarea>
          </div>

          <button 
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full btn-primary mt-4"
          >
            {isEditing ? 'Cập nhật Giao dịch' : 'Tạo Giao dịch'}
          </button>
        </form>
      </div>
    </LayoutModalPopup>
  )
}
