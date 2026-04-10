'use client'

import { ConfirmDelete, Empty, Input, TransactionList, WarningModal } from '@/components/index'
import { Search } from 'lucide-react'
import { BudgetAnalysis, Category, PageRequest, PageResponse, Transaction, TransactionFilter, TransactionRequest, Wallet } from '@/types/index'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { createTransactionApi, deleteTransactionApi, getCategoriesApi, getTransactionsApi, getWalletDropdownApi, updateTransactionApi } from '@/services/index'
import { cleanObject, formatDisplay, toastError } from '@/lib/index'
import { UpsertTransactionModal } from '@/components/index'

interface TransactionFilterBarProps {
  isAddOpen: boolean
  selectedTransaction: Transaction | null
  setIsAddOpen: (i: boolean) => void
  setSelectedTransaction: (t: Transaction) => void
}

export const TransactionFilterBar = ({ isAddOpen, selectedTransaction, setIsAddOpen, setSelectedTransaction } : TransactionFilterBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [warning, setWarning] = useState<{ isOpen: boolean, budget: BudgetAnalysis | null }>({
    isOpen: false,
    budget: null
  })
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [data, setData] = useState<PageResponse<Transaction> | null>({
    content: [],
    totalPages: 0,
    totalElements: 0,
    pageNo: 0,
    pageSize: 0,
    last: false
  })
  const [loading, setLoading] = useState(false)
  const [request, setRequest] = useState<PageRequest>({
    page: 0,
    size: 10,
    sortField: 'id',
    sortOrder: 'desc'
  })
  const [dropdownWallet, setDropdownWallet] = useState([])
  const [dropdownCategory, setDropdownCategory] = useState([])

  const getInitialFilter = () => ({
    fromDate: searchParams.get('fromDate') ? new Date(searchParams.get('fromDate')!) : null,
    toDate: searchParams.get('toDate') ? new Date(searchParams.get('toDate')!) : null,
    note: searchParams.get('note') || "",
    walletId: searchParams.get('walletId') ? Number(searchParams.get('walletId')) : null,
    categoryId: searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : null,
  });
  const [filter, setFilter] = useState<TransactionFilter>(getInitialFilter())

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        if (value instanceof Date) {
          params.set(key, value.toISOString());
        } else {
          params.set(key, value.toString());
        }
      } else {
        params.delete(key);
      }
    });

    setRequest(prev => ({ ...prev, page: 0 })); 

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  }

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchDropdown = async () => {
    try {
      const wallets = await getWalletDropdownApi()
      if (wallets && wallets.length) {
        setDropdownWallet(wallets.map((item: Wallet) => {
          return {
            value: item.id,
            label: `${item.name} (Số dư: ${formatDisplay(item.balance.toString())}đ)`
          }
        }))
      }

      const categories = await getCategoriesApi()

      if (categories && categories.length) {
      setDropdownCategory(categories?.map((item: Category) => {
          return {
            value: item.id,
            label: `${item.name} (${item.type === 'INCOME' ? 'Thu nhập' : 'Chi tiêu'})`
          }
        }) || [])
      }
    } catch(error) {
      console.log("Lỗi: ", error)
    }
  }
  
  const fetchTransactions = useCallback(async (isLoadMore = false) => {
    setLoading(true)
    try {
      const response = await getTransactionsApi(request, cleanObject(filter) as TransactionFilter)

      setData(prevData => {
        if (!isLoadMore || !prevData) return response;
        
        return {
          ...response,
          content: [...prevData.content, ...response.content]
        };
      });
    } catch (error) {
      console.error('Lỗi khi tải giao dịch:', error)
      toastError(error, 'Không thể tải giao dịch. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request])

  const lastElementRef = (node: HTMLTableRowElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && data && !data.last) {
        handleLoadMore();
      }
    });

    if (node) observer.current.observe(node);
  };

  const handleLoadMore = () => {
    if (loading || (data && data.last)) return;

    setRequest(prev => ({
      ...prev,
      page: prev.page + 1
    }));
  }

  const onAddNewTransaction = async (transaction: TransactionRequest) => {
    const addedTran  = await createTransactionApi(transaction) as Transaction

    if (addedTran && addedTran.warning) {
      setWarning({ isOpen: true, budget: addedTran.warning })
    }
    
    setData(prevData => {
      if (!prevData) return {
        content: [addedTran],
        totalPages: 1,
        totalElements: 1,
        pageNo: 0,
        pageSize: 10,
        last: true
      };

      return {
        ...prevData,
        content: [addedTran, ...prevData.content],
        totalElements: prevData.totalElements + 1
      };
    });
  }

  const onEditTransaction = async (transaction: TransactionRequest) => {
    const updatedTran = await updateTransactionApi(transaction.id!, transaction)

    setData((prevData) => {
    if (!prevData) return null;

    return {
      ...prevData,
      content: prevData.content.map((item) =>
        item.id === transaction.id ? updatedTran : item
      ),
    };
  });
  }

  const onDeleteTransaction = async (transaction: Transaction) => {
    await deleteTransactionApi(transaction.id);

    setData((prevData) => {
      if (!prevData) return null;

      if(transaction.category.type === "TRANSFER") {
        return {
          ...prevData,
          content: prevData.content.filter((item) => item.transferId !== transaction.transferId),
          totalElements: prevData.totalElements - 2,
        };
      }

      return {
        ...prevData,
        content: prevData.content.filter((item) => item.id !== transaction.id),
        totalElements: prevData.totalElements - 1,
      };
    });
  };

  useEffect(() => {
    if (request.page > 0) {
      fetchTransactions(true);
    } else {
      fetchTransactions(false);
    }
  }, [request.page, fetchTransactions]);

  useEffect(() => {
    fetchDropdown()
  }, [])

  return (
    <>
      <section className="py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        <div className="relative grow max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            name='note'
            value={filter.note}
            disabled={loading}
            type="text" 
            placeholder="Tìm kiếm ghi chú..."
            inputClass='pl-10'
            onChange={(e) => handleInputChange(e)}
          />
        </div>
        
        <Input 
          options={dropdownWallet}
          name="walletId"
          value={filter.walletId} 
          disabled={loading}
          placeholder="Chọn ví"
          isSelect
          onChange={(e) => handleInputChange(e)}
        />

        <Input 
          options={dropdownCategory}
          name="categoryId" 
          value={filter.categoryId}
          disabled={loading}
          placeholder="Chọn danh mục"
          isSelect
          onChange={(e) => handleInputChange(e)}
        />

        <Input 
          name="fromDate" 
          value={filter.fromDate}
          disabled={loading}
          placeholder="Chọn ví"
          type='datetime-local'
          onChange={(e) => handleInputChange(e)}
        />

        <Input 
          name="toDate" 
          value={filter.toDate}
          disabled={loading}
          placeholder="Chọn ví"
          type='datetime-local'
          onChange={(e) => handleInputChange(e)}
        />

        <button
          disabled={loading}
          onClick={handleSearch}
          className="btn-primary flex items-center justify-center gap-2 w-13"
        >
          <Search size={16} />
        </button>
      </section>

      {data && data.content.length > 0 && (
        <TransactionList 
          data={data.content} 
          lastElementRef={lastElementRef}
          onEdit={(item) => {
            setSelectedTransaction(item)
            setIsEditOpen(true)
          }}
          onDelete={(item) => {
            setSelectedTransaction(item)
            setIsConfirmOpen(true)
          }}
         />
      )}
      
      {!loading && data && data.content.length === 0 && (
        <Empty 
          title="Bạn chưa có giao dịch nào"
          subtitle="Hãy bắt đầu giao dịch mới ngay nào!"
        />
      )}

      <UpsertTransactionModal 
        initData={selectedTransaction}
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSubmit={onAddNewTransaction}
        title="Thêm Giao dịch"
        subtitle="Tạo Giao dịch mới để quản lý tài sản của bạn"
        optionsCategory={dropdownCategory}
        optionsWallet={dropdownWallet}
      />

      <UpsertTransactionModal 
        isEditing
        initData={selectedTransaction}
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        onSubmit={onEditTransaction}
        title="Sửa Giao dịch"
        subtitle="Chỉnh sửa thông tin Giao dịch"
        optionsCategory={dropdownCategory}
        optionsWallet={dropdownWallet}
      />

      <ConfirmDelete
        title={`Bạn có chắc chắn muốn xóa giao dịch này?`}
        message='Hành động này sẽ ảnh hưởng đến các giao dịch liên quan. Dữ liệu lịch sử liên quan đến giao dịch này cũng sẽ bị xóa.'
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onDelete={() =>
          selectedTransaction
            ? onDeleteTransaction(selectedTransaction)
            : Promise.resolve()
        } 
      />

      <WarningModal 
        isOpen={warning.isOpen} 
        onClose={() =>  setWarning({...warning, isOpen: false})} 
        budget={warning.budget} 
      />
    </>
  )
}
