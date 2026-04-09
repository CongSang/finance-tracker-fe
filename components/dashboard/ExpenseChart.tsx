import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { SpendingCategory } from '@/types/index';

interface ExpenseChartProps {
  data: SpendingCategory[] | []
}

export const ExpenseChart = ({ data } : ExpenseChartProps) => {

  const colors = ['#0a1f32', '#3f627c', '#badefd']
  
  return (
    <div className="bg-white p-8 rounded-xl shadow h-full">
      <h3 className="text-sm font-bold text-primary mb-8 tracking-tight uppercase">Cơ cấu chi phí</h3>
      
      <div className="relative h-48 w-full mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="percentage"
              nameKey='categoryName'
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value}%`, `${name}`]}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[10px] text-on-surface-variant font-bold uppercase">Tổng</p>
          <p className="text-xl font-headline font-extrabold text-primary">$8,250</p>
        </div> */}
      </div>

      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.categoryName} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[index] }}></span>
              <span className="text-xs font-medium text-on-surface-variant">{item.categoryName}</span>
            </div>
            <span className="text-xs font-bold text-primary">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
