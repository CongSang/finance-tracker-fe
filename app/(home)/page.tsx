
import { SummaryCard } from '@/components/dashboard/SummaryCard'
import { ArrowDown, ArrowUp, PiggyBank, TrendingUp } from 'lucide-react'

const Page = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard 
              title="Tổng số dư" 
              value="$48,250.00" 
              icon={PiggyBank} 
            />
            <SummaryCard 
              title="Tổng thu nhập" 
              value="$12,500.00" 
              icon={ArrowUp} 
              color="success"
            />
            <SummaryCard 
              title="Tổng chi tiêu" 
              value="$8,250.00" 
              icon={ArrowDown} 
              color="error"
            />
            <SummaryCard 
              title="Thay đổi số dư" 
              value="+5%" 
              icon={TrendingUp}
              color="success"
            />
          </div>
    </div>
  )
}

export default Page
