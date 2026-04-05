'use client';

import { Plus, Trash, User } from 'lucide-react'
import Image from 'next/image';
import { ChangeEvent, useRef, useState, MouseEvent } from 'react';

interface UploadImageProps {
	image: File | null;
	setImage: (file: File | null) => void;
}

export const UploadImage = ({ image, setImage }: UploadImageProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setImage(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const onChooseImage = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    inputRef.current?.click();
  };


  return (
    <div>
			<input ref={inputRef} type="file" accept="image/*" className='hidden' onChange={handleFileChange} />

			{!image || !previewUrl ? (
				<div className="mb-6 group cursor-pointer">
					<button onClick={onChooseImage} className="relative">
						<div className="w-20 h-20 rounded-full border-2 border-dashed border-third flex items-center justify-center bg-[#F9FAFB] transition-colors group-hover:border-[#9CA3AF]">
							<User size={40} className="text-third" />
						</div>
						<div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 border border-white">
							<Plus size={14} strokeWidth={3} />
						</div>
					</button>
				</div>
			) : (
				<div className="relative mb-6">
					<Image src={previewUrl} width={100} height={100} alt="Profile Preview" className="w-20 h-20 rounded-full object-cover" />

					<button 
						onClick={handleRemoveImage} 
						className="absolute bg-red-800 text-white rounded-full bottom-0 right-0 p-1 border border-white"
					>
						<Trash size={14} />
					</button>			
				</div>
			)}
    </div>
  )
}
