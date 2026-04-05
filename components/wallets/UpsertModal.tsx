'use client'

import { Input } from "@/components/index"
import { LayoutModalPopup } from "../LayoutModalPopup"
import { useState, MouseEvent, useEffect, ChangeEvent } from "react"
import { ColorButton } from "./ColorButton"
import { colors, toastError } from "@/lib/index"
import toast from "react-hot-toast"
import { Wallet } from "@/types/index"

interface UpsertModalProps {
  title?: string
  subtitle?: string
  isOpen: boolean
  initData?: Wallet | null
  isEditing?: boolean
  onClose: () => void
  onSubmit: (wallet: Wallet) => Promise<void>
}

export const UpsertModal = ({ title, subtitle, isOpen, isEditing = false, initData, onClose, onSubmit }: UpsertModalProps) => {
  const [wallet, setWallet] = useState<Wallet>({
    name: "",
    balance: 0,
    currency: "VND",
    colorCode: "#213448",
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "balance") {
      setWallet(prev => ({ ...prev, [name]: Number(value) }));
      return;
    }

    setWallet(prev => ({ ...prev, [name]: value }));
  }

	const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		const validations = [
      { cond: !wallet.name.trim(), msg: "Vui lòng nhập tên ví" },
      { cond: Number(wallet.balance) <= 0, msg: "Vui lòng nhập số tiền lớn hơn 0" },
      { cond: !wallet.colorCode, msg: "Vui lòng chọn màu ví" }
    ];

    const error = validations.find(v => v.cond);
    if (error) return toast.error(error.msg);

		setLoading(true)
    try {
      await onSubmit({ ...wallet, balance: Number(wallet.balance) })
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
        setWallet(initData);
      } else {
        setWallet({
          name: "",
          balance: 0,
          currency: "VND",
          colorCode: "#213448",
        });
      }
    }
  }, [isOpen, isEditing, initData])

  return (
    <LayoutModalPopup isOpen={isOpen} onClose={onClose} title={title} subtitle={subtitle}>
      <div>
        <form className="w-full space-y-4 text-left">
					<Input 
            name="name"
            value={wallet?.name || ""}
            disabled={loading}
            onChange={(e) => handleInputChange(e)}
            label="Tên ví" 
            placeholder="Tiền mặt, thẻ tín dụng, ví điện tử..." 
            type="text" 
					/>

					<Input 
            name="balance"
            value={wallet?.balance !== undefined ? wallet.balance.toString() : ""}
            disabled={loading}
            onChange={(e) => handleInputChange(e)}
            label="Số dư" 
            placeholder="0.00" 
            type="number" 
					/>

					<div className="space-y-4">
						<label className="block text-sm font-semibold mb-1">
							Cá nhân hóa (tùy chọn)
						</label>
						<div className="flex items-start p-6 bg-gray-100 rounded-lg">
							<div className="space-y-3">
								<p className="text-[10px] font-black uppercase tracking-[0.2em]">Màu ví</p>
								<div className="flex flex-wrap gap-4">
									{colors.map((colorOption) => (
										<ColorButton 
											key={colorOption}
											color={colorOption}
											active={wallet?.colorCode === colorOption}
											setColor={(color) => setWallet({...wallet, colorCode: color})}
										/>
									))}
								</div>
							</div>
						</div>
					</div>

					<button 
							type="submit"
							onClick={handleSubmit}
							disabled={loading}
							className="w-full btn-primary mt-4"
					>
							{isEditing ? 'Cập nhật ví' : 'Tạo Ví Mới'}
					</button>
        </form>
      </div>
    </LayoutModalPopup>

  )
}
