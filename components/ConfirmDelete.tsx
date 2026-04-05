import { useState } from 'react'
import { LayoutModalPopup } from '@/components/index'
import { AlertTriangle } from 'lucide-react';
import { toastError } from '@/lib/index';

interface ConfirmDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  title?: string;
  message?: string;
}

export const ConfirmDelete = ({ isOpen, onClose, title, message, onDelete } : ConfirmDeleteProps) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await onDelete()
      onClose()
    } catch (error) {
      console.error('Lỗi khi xóa:', error)
      toastError(error, 'Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <LayoutModalPopup isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col items-center justify-center text-center'>
        <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <AlertTriangle className="text-red-600 w-8 h-8" />
        </div>

        <h2 className="text-primary font-extrabold mb-4 tracking-tight">
          {title}
        </h2>
        <p className="leading-relaxed mb-10 px-4">
          {message}
        </p>

        <div className="flex flex-col w-full gap-3">
          <button 
            disabled={loading}
            onClick={onClose}
            className="w-full btn-primary"
          >
            Bỏ qua
          </button>
          <button
            disabled={loading}
            onClick={handleDelete}
            className="w-full px-4 py-3 text-sm max-sm:text-xs bg-red-200/20 text-red-600 font-bold rounded-lg hover:bg-red-200/40 transition-colors active:scale-[0.98]"
          >
            Xóa
          </button>
        </div>
      </div>
    </LayoutModalPopup>
  )
}
