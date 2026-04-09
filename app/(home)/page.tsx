'use client'
import { SummaryCard } from '@/components/dashboard/SummaryCard'
import { CashFlowChart, ExpenseChart } from '@/components/index'
import { getSummaryApi, getCashFlowTrendApi, getSpendingStructureApi } from '@/services/index'
import { CashFlowTrend, DashboardSummary, SpendingCategory } from '@/types/index'
import { ArrowDown, ArrowUp, PiggyBank, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const Page = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [categories, setCategories] = useState<SpendingCategory[] | []>([])
  const [trend, setTrend] = useState<CashFlowTrend[] | []>([])

  useEffect(() => {
    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    const fetchSummary = async () => {
      const res = await getSummaryApi();
      setSummary(res)
    }

    const fetchSpendingStructure = async () => {
      const res = await getSpendingStructureApi({ month, year });
      setCategories(res)
    }

    const fetchCashFlowTrend = async () => {
      const res = await getCashFlowTrendApi({ month, year });
      setTrend(res)
    }

    fetchSummary()
    fetchCashFlowTrend()
    fetchSpendingStructure()
  }, [])

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summary && (
          <>
            <SummaryCard 
              title="Tổng số dư" 
              value={summary.totalBalance}
              icon={PiggyBank} 
            />
            <SummaryCard 
              title="Tổng thu nhập" 
              value={summary.totalIncome}
              icon={ArrowUp} 
              color="success"
            />
            <SummaryCard 
              title="Tổng chi tiêu" 
              value={summary.totalExpense} 
              icon={ArrowDown} 
              color="error"
            />
            <SummaryCard 
              isPercent
              title="Thay đổi số dư" 
              value={summary.balanceChangePercent} 
              icon={TrendingUp}
              color="success"
            />
          </>
        )}    
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch mt-4">
        <div className="lg:col-span-4">
          <ExpenseChart data={categories} />
        </div>
        <div className="lg:col-span-8">
          <CashFlowChart data={trend} />
        </div>
      </div>
    </div>
  )
}

export default Page
