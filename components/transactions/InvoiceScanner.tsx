'use client'
import React, { useState, useRef, MouseEvent } from 'react';
import { Camera } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { scanInvoiceApi } from '@/services/index';
import Image from 'next/image';
import { LayoutModalPopup, Loading } from '@/components/index';
import { Transaction } from '@/types/transaction';

interface InvoiceScannerProps {
  onScanSuccess: (data: Transaction) => void;
}

const InvoiceScanner = ({ onScanSuccess }: InvoiceScannerProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isOpenReview, setIsOpenReview] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file)
      if (preview) URL.revokeObjectURL(preview);
      
      const url = URL.createObjectURL(file);
      setPreview(url);
      setIsOpenReview(true)
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', selectedFile!);

    setLoading(true);
    const toastId = toast.loading("AI đang phân tích hóa đơn...");

    try {
      const response = await scanInvoiceApi(formData)

      onScanSuccess(response);

      toast.success("Quét hóa đơn thành công!", { id: toastId });
      setIsOpenReview(false)
      onRemoveImage()
    } catch (error) {
      console.log("Lỗi quét: ", error)
      toast.error("AI chưa đọc được, bạn hãy chụp lại rõ hơn nhé!", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const onRemoveImage = () => {
    setIsOpenReview(false)
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onChooseImage = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    fileInputRef.current?.click();
  };

  return (
    <div>
      <button 
        onClick={(e) => onChooseImage(e)}
        className="flex items-center gap-2 px-4 py-2.5 border-2 border-primary text-primary rounded-lg font-bold text-sm hover:bg-primary/5 active:scale-[0.98] transition-all"
      >
        <Camera size={18} />
        Quét hóa đơn
      </button>

      <LayoutModalPopup 
        isOpen={isOpenReview} 
        onClose={onRemoveImage}
      >
        <div className="relative w-full aspect-3/4 rounded-lg overflow-hidden border shadow-lg">
          <Image width={40} height={40} src={preview || ""} alt="Invoice preview" className="w-full h-full object-cover" />
          {loading && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
              <Loading />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button 
            className="w-full px-4 py-3 text-sm max-sm:text-xs bg-red-200/20 text-red-600 font-bold rounded-lg hover:bg-red-200/40 transition-colors active:scale-[0.98]"
            onClick={onRemoveImage}
          >
            Hủy
          </button>
          <button 
            onClick={() => handleUpload()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-primary text-primary rounded-lg font-bold text-sm max-sm:text-xs hover:bg-primary/5 active:scale-[0.98] transition-all"
          >
            Bắt đầu quét
          </button>
        </div>
      </LayoutModalPopup>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="opacity-0 absolute -z-10"
      />
    </div>
  );
};

export default InvoiceScanner;