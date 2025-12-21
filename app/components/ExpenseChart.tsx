"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../lib/formatters';

type ChartData = {
  name: string;
  value: number;
};

type ExpenseChartProps = {
  data: ChartData[];
};

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function ExpenseChart({ data }: ExpenseChartProps) {
  if (data.length === 0) {
    return <div className="text-gray-500 text-center py-10">No expense data to display</div>;
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
            />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}