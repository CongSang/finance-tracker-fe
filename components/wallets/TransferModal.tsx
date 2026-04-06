'use client'

import { Input, LayoutModalPopup } from '@/components/index'
import { formatDisplay, toastError } from '@/lib/index'
import { getWalletDropdownApi, transferApi } from '@/services/index'
import { Wallet } from '@/types/wallet'
import { ArrowRightLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface TransferModalProps {
  title?: string
  isOpen: boolean
  onClose: () => void
  onTransfer: (fromWalletId: number, toWalletId: number, amount: number) => void
}

export const TransferModal = ({ isOpen, onClose, title, onTransfer }: TransferModalProps) => {
  const [fromWallet, setFromWallet] = useState("")
  const [toWallet, setToWallet] = useState("")
  const [dropdown, setDropdown] = useState([])
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const validations = [
      { cond: !fromWallet.trim(), msg: "Vui lòng chọn ví gửi" },
      { cond: !toWallet.trim(), msg: "Vui lòng chọn ví nhận" },
      { cond: Number(amount) <= 0, msg: "Vui lòng nhập số tiền lớn hơn 0" }
    ];

    const error = validations.find(v => v.cond);
    if (error) return toast.error(error.msg);

    setLoading(true)
    try {
      await transferApi({ 
        fromWalletId: Number(fromWallet), 
        toWalletId: Number(toWallet), 
        amount: Number(amount), 
        note 
      })
      toast.success('Chuyển khoản thành công')
      onTransfer(Number(fromWallet), Number(toWallet), Number(amount))
      onClose()
    } catch (error) {
      console.error('Lỗi khi chuyển khoản:', error)
      toastError(error, 'Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadDropdown = async () => {
      try {
        const response = await getWalletDropdownApi();
        
        const value = response?.map((item: Wallet) => {
          return {
            value: item.id,
            label: `${item.name} (${formatDisplay(item.balance.toString())}đ)`
          }
        })

        setDropdown(value)
      } catch(error) {
        console.error('Lỗi khi tải ví:', error)
        toastError(error, 'Có lỗi xảy ra. Vui lòng thử lại.')
      }
    }
    loadDropdown()
  }, [])

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
              options={dropdown}
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
              options={dropdown}
            />
          </div>
        </div>

        <Input 
          value={amount !== undefined ? amount.toString() : ""}
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
