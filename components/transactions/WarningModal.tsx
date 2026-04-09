import React from 'react'
import { LayoutModalPopup } from '../LayoutModalPopup'
import { AlertCircle, AlertTriangle, PartyPopper } from 'lucide-react'
import { BudgetAnalysis } from '@/types/index'
import { formatDisplay } from '@/lib/utils'

interface WarningModalProps {
  budget: BudgetAnalysis | null
  isOpen: boolean
  onClose: () => void
}

export const WarningModal = ({ isOpen, onClose, budget } : WarningModalProps) => {

  const returnBgColor = () => {
    if (budget?.status === "GOOD") return 'bg-green-200/40'
    if (budget?.status === "WARNING") return 'bg-yellow-200/40'
    return 'bg-red-200/40'
  }

  const returnTitle = () => {
    if (budget?.status === "GOOD") return 'Tuyệt vời!'
    if (budget?.status === "WARNING") return 'Cảnh báo!'
    return 'Nguy hiểm!'
  }

  const returnMessage = () => {
    if (budget?.status === "GOOD") 
      return `Phong độ tài chính rất ổn định! Với tốc độ này, bạn hoàn toàn có thể yên tâm duy trì chi tiêu đến hết tháng.`
    if (budget?.status === "WARNING") 
      return `Tốc độ chi tiêu của bạn đang hơi nhanh. Hạn mức chi tiêu an toàn còn lại là ${formatDisplay(budget?.suggestedDailyLimit.toString())}/ngày để đảm bảo kế hoạch tài chính.`
    return `Bạn đã chi tiêu ${budget?.percentUsed}% ngân sách. Với tốc độ này, dự kiến bạn sẽ hết tiền vào ngày ${budget?.projectedExceedDay}. Hãy thắt chặt chi tiêu ngay!`
  }

  return (
    <LayoutModalPopup isOpen={isOpen} onClose={onClose}>
      <div className='flex flex-col items-center justify-center text-center'>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-8 shadow-inner ${returnBgColor()}`}>
          {budget?.status === "GOOD" && (<PartyPopper className="text-green-600 w-8 h-8" />)}
          {budget?.status === "WARNING" && (<AlertCircle className="text-yellow-600 w-8 h-8" />)}
          {budget?.status === "DANGER" && (<AlertCircle className="text-red-600 w-8 h-8" />)}
        </div>

        <h2 className="text-primary font-extrabold mb-4 tracking-tight">
          {returnTitle()}
        </h2>
        <p className="leading-relaxed mb-10 px-4">
          {/* {budget?.status === "GOOD" && (<span>Phong độ tài chính rất ổn định! Với tốc độ này, bạn hoàn toàn có thể yên tâm duy trì chi tiêu đến hết tháng.</span>)}
          {budget?.status === "WARNING" && (<span></span>)}
          {budget?.status === "DANGER" && (<span></span>)} */}
          {returnMessage()}
        </p>
      </div>  
    </LayoutModalPopup>
  )
}
