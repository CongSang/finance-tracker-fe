'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Lỗi hệ thống:', error)
  }, [error])

  return (
    <div className='flex flex-col items-center justify-center h-screen gap-3 p-5'>
      <h2 className='text-black'>Đã có lỗi xảy ra!</h2>
      <p className='mb-3'>{error.message || "Chúng tôi đang khắc phục sự cố này."}</p>
      
      <button
        onClick={() => reset()} // Re-render error segment
        className='btn-primary'
      >
        Vui lòng thử lại
      </button>
    </div>
  )
}