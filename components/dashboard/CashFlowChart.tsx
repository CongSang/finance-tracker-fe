import { formatDisplay } from '@/lib/utils';
import { CashFlowTrend } from '@/types/index';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CashFlowChartProps {
    data: CashFlowTrend[] | []
}

export const CashFlowChart = ({ data } : CashFlowChartProps) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow h-full">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-sm font-bold text-primary tracking-tight uppercase">Xu hướng dòng tiền</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4c8c4a]"></span>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Thu nhập</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Chi tiêu</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4c8c4a" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#4c8c4a" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0a1f32" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#0a1f32" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e8e8" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#43474c' }}
              dy={10}
            />
            <YAxis hide />
            <Tooltip 
              formatter={(value, name) => [`${formatDisplay(value?.toString() || "")}đ`, `${name === 'income' ? 'Thu nhập' : 'Chi tiêu'}`]}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="income" 
              stroke="#4c8c4a" 
              fillOpacity={1} 
              fill="url(#colorIncome)" 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="expense" 
              stroke="#0a1f32" 
              fillOpacity={1} 
              fill="url(#colorExpense)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
