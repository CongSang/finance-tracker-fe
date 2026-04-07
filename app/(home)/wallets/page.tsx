'use client'

import { Empty } from '@/components/Empty'
import { WalletCard, UpsertModal, TransferModal, Loading, ConfirmDelete } from '@/components/index'
import { toastError } from '@/lib/utils'
import { createWalletApi, deleteWalletApi, getWalletsApi, updateWalletApi } from '@/services/index'
import { PageRequest, PageResponse, Wallet } from '@/types/index'
import { ArrowLeftRight, Plus } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

const Wallets = () => {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null)
  const [data, setData] = useState<PageResponse<Wallet> | null>({
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
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchWallets = useCallback(async (isLoadMore = false) => {
    setLoading(true)
    try {
      const response = await getWalletsApi(request)

      setData(prevData => {
        if (!isLoadMore || !prevData) return response;
        
        return {
          ...response,
          content: [...prevData.content, ...response.content]
        };
      });
    } catch (error) {
      console.error('Lỗi khi tải ví:', error)
      toastError(error, 'Không thể tải ví. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }, [request])

  const handleLoadMore = () => {
    if (loading || (data && data.last)) return;

    setRequest(prev => ({
      ...prev,
      page: prev.page + 1
    }));
  }

  const lastElementRef = (node: HTMLElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && data && !data.last) {
        handleLoadMore();
      }
    });

    if (node) observer.current.observe(node);
  };

  const onAddNewWallet = async (wallet: Wallet) => {
    const addedWallet = await createWalletApi(wallet)

    setData(prevData => {
        if (!prevData) return {
          content: [addedWallet],
          totalPages: 1,
          totalElements: 1,
          pageNo: 0,
          pageSize: 10,
          last: true
        };

        return {
          ...prevData,
          content: [addedWallet, ...prevData.content],
          totalElements: prevData.totalElements + 1
        };
      });
  }

  const onEditWallet = async (wallet: Wallet) => {
    const updatedWallet = await updateWalletApi(wallet.id!, wallet)

    setData((prevData) => {
      if (!prevData) return null;

      return {
        ...prevData,
        content: prevData.content.map((item) =>
          item.id === wallet.id ? updatedWallet : item
        ),
      };
    });
  }

  const onDeleteWallet = async (walletId: number) => {
    await deleteWalletApi(walletId);

    setData((prevData) => {
      if (!prevData) return null;

      return {
        ...prevData,
        content: prevData.content.filter((item) => item.id !== walletId),
        totalElements: prevData.totalElements - 1,
      };
    });
  };

  const onTransferWallet = (fromWalletId: number, toWalletId: number, amount: number) => {
    setData((prevData) => {
      if (!prevData) return null;

      return {
        ...prevData,
        content: prevData.content.map((item) => {
          if(item.id === fromWalletId) {
            return { ...item, balance: item.balance - amount };
          } else if (item.id === toWalletId) {
            return { ...item, balance: item.balance + amount };
          }
            
          return item;
        }),
      };
    });
  } 

  useEffect(() => {
    if (request.page > 0) {
      fetchWallets(true);
    } else {
      fetchWallets(false);
    }
  }, [request.page, fetchWallets]);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-bold text-primary">Ví của bạn</h2>
          <p>Quản lý tiền mặt và tài sản kỹ thuật số của bạn</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="btn-primary flex items-center gap-2 text-sm"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus size={18} />
            Thêm Ví Mới
          </button>
          <button 
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-primary text-primary rounded-lg font-bold text-sm hover:bg-primary/5 active:scale-[0.98] transition-all"
            onClick={() => setIsTransferOpen(true)}
          >
            <ArrowLeftRight size={18} />
            Chuyển Khoản
          </button>
        </div>
      </div>

      {data && data.content.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {data?.content.map((wallet, index) => {
            if (data.content.length === index + 1) {
              return  <WalletCard 
                        ref={lastElementRef}
                        id={wallet.id!}
                        key={wallet.id}
                        title={wallet.name}
                        balance={wallet.balance}
                        color={wallet.colorCode}
                        onEdit={() => {
                          setSelectedWallet(wallet)
                          setIsEditOpen(true)
                        }}
                        onDelete={() => {
                          setSelectedWallet(wallet)
                          setIsConfirmOpen(true)
                        }}
                      />;
            }
            return  <WalletCard 
                      key={wallet.id}
                      id={wallet.id!}
                      title={wallet.name}
                      balance={wallet.balance} 
                      color={wallet.colorCode}
                      onEdit={() => {
                        setSelectedWallet(wallet)
                        setIsEditOpen(true)
                      }}
                      onDelete={() => {
                        setSelectedWallet(wallet)
                        setIsConfirmOpen(true)
                      }}
                    />;
          })}
        </div>
      )}
        
      {!loading && data && data.content.length === 0 && (
        <Empty 
          title="Bạn chưa có ví nào"
          subtitle="Hãy tạo một ví mới để bắt đầu quản lý tài sản của bạn"
        />
      )}
     {loading && <div className='mt-10'><Loading /></div>}
      
      <UpsertModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSubmit={onAddNewWallet}
        title="Thêm Ví Mới"
        subtitle="Tạo một ví mới để quản lý tài sản của bạn"
      />

      <UpsertModal 
        isEditing
        initData={selectedWallet}
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        onSubmit={onEditWallet}
        title="Sửa Ví"
        subtitle="Chỉnh sửa thông tin ví"
      />

      <ConfirmDelete
        title={`Bạn có chắc chắn muốn xóa ví ${selectedWallet?.name}?`}
        message='Hành động này sẽ ảnh hưởng đến các giao dịch liên quan. Dữ liệu lịch sử liên quan đến ví này cũng sẽ bị xóa.'
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onDelete={() =>
          selectedWallet
            ? onDeleteWallet(selectedWallet.id!)
            : Promise.resolve()
        } 
      />

      <TransferModal 
        isOpen={isTransferOpen} 
        onTransfer={(fromWalletId: number, toWalletId: number, amount: number) => onTransferWallet(fromWalletId, toWalletId, amount)} 
        onClose={() => setIsTransferOpen(false)}
        title="Chuyển Khoản Nội Bộ"
      />
    </div>
  )
}

export default Wallets