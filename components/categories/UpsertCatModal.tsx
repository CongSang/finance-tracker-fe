'use client'
import { ChangeEvent, useState, MouseEvent, useEffect } from 'react'
import { Input, LayoutModalPopup } from '@/components/index'
import { Category } from '@/types/index'
import { cn, ICON_MAP, toastError, transactions } from '@/lib/index'
import toast from 'react-hot-toast'

interface UpsertModalProps {
  title?: string
  subtitle?: string
  isOpen: boolean
  initData?: Category | null
  isEditing?: boolean
  onClose: () => void
  onSubmit: (category: Category) => Promise<void>
}

export const UpsertCatModal = ({ title, subtitle, isOpen, isEditing = false, initData, onClose, onSubmit }: UpsertModalProps) => {
  const [category, setCategory] = useState<Category>({
    name: "",
    type: 'EXPENSE',
    iconUrl: "",
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCategory(prev => ({ ...prev, [name]: value }));
  }

  const handleClickIcon = (e: MouseEvent<HTMLButtonElement>, iconName: string) => {
    e.preventDefault()
    setCategory(prev => ({ ...prev, iconUrl: iconName }));
  }

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		const validations = [
      { cond: !category.name.trim(), msg: "Vui lòng nhập tên ví" },
      { cond: !category.type, msg: "Vui lòng chọn loại giao dịch" },
      { cond: !category.iconUrl, msg: "Vui lòng chọn biểu tượng" }
    ];

    const error = validations.find(v => v.cond);
    if (error) return toast.error(error.msg);

		setLoading(true)
    try {
      await onSubmit(category)
      toast.success(isEditing ? 'Cập nhật danh mục thành công' : 'Thêm mới danh mục thành công')
      onClose()
    } catch (error) {
      console.error('Lỗi khi tạo/ sửa danh mục:', error)
      toastError(error, 'Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
	}

  useEffect(() => {
    if (isOpen) {
      if (isEditing && initData) {
        setCategory(initData);
      } else {
        setCategory({
          name: "",
          type: 'EXPENSE',
          iconUrl: "",
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
            value={category?.name || ""}
            disabled={loading}
            onChange={(e) => handleInputChange(e)}
            label="Tên danh mục" 
            placeholder="Thể thao, Giải trí, Làm đẹp..." 
            type="text" 
          />

          <Input 
            isSelect
            name="type"
            value={category?.type || ""}
            disabled={loading}
            onChange={(e) => handleInputChange(e)}
            label="Loại giao dịch"
            options={transactions}
          />

          <div className="space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-widest">Biểu tượng</label>
            <div className="grid grid-cols-8 gap-3">
              {Object.entries(ICON_MAP).map(([name, Icon]) => (
                <button 
                  type='button'
                  key={name}
                  onClick={(e) => handleClickIcon(e, name)}
                  className={cn(
                    "aspect-square flex items-center justify-center rounded-lg transition-all",
                    category.iconUrl === name 
                      ? "bg-primary text-white shadow-md" 
                      : "border border-gray-200 hover:bg-gray-100"
                  )}
                >
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full btn-primary mt-4"
					>
            {isEditing ? 'Cập nhật danh mục' : 'Tạo Danh mục'}
					</button>
        </form>
      </div>
    </LayoutModalPopup>
  )
}
