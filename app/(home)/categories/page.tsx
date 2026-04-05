'use client'

import { CategoryCard, ConfirmDelete, Empty, Loading, UpsertCatModal } from '@/components/index'
import { TransactionType } from '@/lib/enums'
import { toastError } from '@/lib/index'
import { createCategoryApi, deleteCategoryApi, getCategoriesApi, updateCategoryApi } from '@/services/index'
import { Category } from '@/types/index'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const Categories = () => {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [activeTab, setActiveTab] = useState("ALL")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Category[] | null>([])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const response = await getCategoriesApi()

      setData(response);
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error)
      toastError(error, 'Không thể tải danh mục. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = useMemo(() => {
    if(activeTab === "ALL") {
      return data
    }
    return data?.filter(
      (cat) => cat.type.toLowerCase() === activeTab.toLowerCase()
    );
  }, [activeTab, data]);

  const onAddNewCategory = async (category: Category) => {
    const addedCat = await createCategoryApi(category)
    
    setData(prevData => {
      if (!prevData) return [addedCat];

      return [addedCat, ...prevData]
    });
  }

  const onEditCategory = async (category: Category) => {
    const updatedCat = await updateCategoryApi(category.id!, category)

    setData((prevData) => {
      if (!prevData) return null;

      return prevData.map((item) =>
          category.id === item.id ? updatedCat : item)
    });
  }

  const onDeleteCategory = async (catId: number) => {
      await deleteCategoryApi(catId);
  
      setData((prevData) => {
        if (!prevData) return null;
  
        return  prevData.filter((item) => item.id !== catId)
      });
    };

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="font-bold text-primary">Danh mục của bạn</h2>
          <p>Quản lý danh mục thu nhập và chi tiêu</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-6 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === "ALL" 
                  ? 'bg-white shadow-sm text-primary' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Tất cả
            </button>
            {(['EXPENSE', 'INCOME'] as TransactionType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-white shadow-sm text-primary' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'INCOME' ? 'Thu nhập' : 'Chi tiêu'}
              </button>
            ))}
          </div>

          <button 
            className="btn-primary flex items-center gap-2 text-sm"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus size={18} />
            Thêm Danh mục
          </button>
        </div>
      </div>

      {filteredCategories && filteredCategories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => (
            <CategoryCard 
              key={cat.id} 
              icon={cat.iconUrl}
              title={cat.name}
              type={cat.type}
              onEdit={() => {
                setSelectedCategory(cat)
                setIsEditOpen(true)
              }}
              onDelete={() => {
                setSelectedCategory(cat)
                setIsConfirmOpen(true)
              }}
            />
          ))}

          <div
            onClick={() => setIsAddOpen(true)}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 transition-colors cursor-pointer group hover:bg-gray-100"
          >
            <div className="w-12 h-12 rounded-full bg-gray-200/80 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold group-hover:text-primary transition-colors">
              Thêm Danh mục
            </span>
          </div>
        </div>
      )}

      {!loading && filteredCategories && filteredCategories.length === 0 && (
        <Empty 
          title="Danh mục trống"
          subtitle="Hãy tạo một danh mục mới để bắt đầu quản lý tài sản của bạn"
        />
      )}
      {loading && <div className='mt-10'><Loading /></div>}

      <UpsertCatModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSubmit={onAddNewCategory}
        title="Thêm Danh mục"
        subtitle="Tạo danh mục mới để quản lý tài sản của bạn"
      />

      <UpsertCatModal 
        isEditing
        initData={selectedCategory}
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        onSubmit={onEditCategory}
        title="Sửa Danh mục"
        subtitle="Chỉnh sửa thông tin danh mục"
      />

      <ConfirmDelete
        title={`Bạn có chắc chắn muốn xóa danh mục ${selectedCategory?.name}?`}
        message='Hành động này sẽ ảnh hưởng đến các giao dịch liên quan. Dữ liệu lịch sử liên quan đến danh mục này cũng sẽ bị xóa.'
        isOpen={isConfirmOpen} 
        onClose={() => setIsConfirmOpen(false)} 
        onDelete={() =>
          selectedCategory
            ? onDeleteCategory(selectedCategory.id!)
            : Promise.resolve()
        } 
      />
    </div>
  )
}

export default Categories