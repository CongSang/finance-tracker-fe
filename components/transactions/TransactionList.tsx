'use client'

import { Transaction } from "@/types/index"
import { TransactionRow } from "@/components/index"

interface TransactionListProps {
  data: Transaction[];
  lastElementRef?: React.Ref<HTMLTableRowElement>;
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

export const TransactionList = ({ data, lastElementRef, onDelete, onEdit } : TransactionListProps) => {
  return (
    <section className="py-8 flex-1">
      <div className="w-full overflow-x-auto pb-4">
        <table className="w-full border-separate border-spacing-y-2 min-w-250">
          <thead>
            <tr className="text-left text-primary uppercase text-[10px] tracking-[0.25em] font-black">
              <th className="px-4 pb-3">Ngày</th>
              <th className="px-4 pb-3">Danh mục</th>
              <th className="px-4 pb-3">Ví</th>
              <th className="px-4 pb-3">Ghi chú</th>
              <th className="px-4 pb-3 text-right">Số tiền</th>
              <th className="px-4 pb-3 text-right">Hoạt động</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data.map((t, i) => {
              if(data.length === i + 1) {
                return  <TransactionRow 
                          ref={lastElementRef} 
                          key={t.id} transaction={t} 
                          index={i} 
                          onDelete={onDelete}
                          onEdit={onEdit}
                        />
              }
              
              return <TransactionRow key={t.id} transaction={t} index={i} onDelete={onDelete} onEdit={onEdit} />
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
