'use client'

import { Input, LayoutModalPopup } from '@/components/index'
import { ArrowRightLeft } from 'lucide-react'
import { useState } from 'react'

interface TransferModalProps {
  title?: string
  isOpen: boolean
  onClose: () => void
}

export const TransferModal = ({ isOpen, onClose, title }: TransferModalProps) => {
  const [fromWallet, setFromWallet] = useState("")
  const [toWallet, setToWallet] = useState("")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      onClose()
    }, 2000)
  }

  return (
    <LayoutModalPopup isOpen={isOpen} onClose={onClose} title={title}>
      <form className="w-full space-y-4 text-left">
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 w-full">
          <div className='flex-1 w-full'>
            <Input 
              value={fromWallet}
              disabled={loading}
              onChange={(e) => setFromWallet(e.target.value)}
              label="Tên ví gửi" 
              placeholder="Chọn ví gửi" 
              isSelect
            />
          </div>

          <div className="bg-gray-200 rounded-full p-3 flex items-center justify-center">
            <ArrowRightLeft size={20} className="text-primary" />
          </div>

          <div className='flex-1 w-full'>
            <Input 
              value={toWallet}
              disabled={loading}
              onChange={(e) => setToWallet(e.target.value)}
              label="Tên ví nhận" 
              placeholder="Chọn ví nhận" 
              isSelect 
            />
          </div>
        </div>

        <Input 
          value={amount}
          disabled={loading}
          onChange={(e) => setAmount(e.target.value)}
          label="Số tiền" 
          placeholder="0.00" 
          type="number" 
        />

        <div>
          <label className="block text-sm font-bold mb-1">
            Ghi chú
          </label>
          <textarea 
            value={note}
            disabled={loading}
            onChange={(e) => setNote(e.target.value)}
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
          Xác nhận chuyển khoản
        </button>
      </form>
    </LayoutModalPopup>
  )
}
