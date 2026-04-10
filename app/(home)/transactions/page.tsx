'use client'

import { Plus } from 'lucide-react'
import InvoiceScanner from '@/components/transactions/InvoiceScanner';
import { useState, Suspense } from 'react';
import { Transaction } from '@/types/transaction';
import { Loading, TransactionFilterBar } from '@/components/index';

const Transactions = () => {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const onScanSuccess = (data: Transaction) => {
    console.log(data)
    setSelectedTransaction(data)
    setIsAddOpen(true)
  }

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-bold text-primary">Giao dịch</h2>
          <p>Xem lại dòng thời gian tài chính của bạn</p>
        </div>
        <div className="flex items-center gap-3">
          <InvoiceScanner onScanSuccess={onScanSuccess} />
          <button
            onClick={() => {
              setSelectedTransaction(null)
              setIsAddOpen(true)
            }} 
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus size={18} />
            Thêm Giao dịch
          </button>
        </div>
      </div>

      
      <Suspense fallback={<Loading />}>
        <TransactionFilterBar 
          isAddOpen={isAddOpen} 
          setIsAddOpen={setIsAddOpen} 
          selectedTransaction={selectedTransaction} 
          setSelectedTransaction={setSelectedTransaction} 
        />
      </Suspense>
    </div>
  )
}

export default Transactions