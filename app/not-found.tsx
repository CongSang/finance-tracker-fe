import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='font-sans flex flex-col items-center justify-center h-screen text-center p-5 gap-3'>
      <h1 className='text-primary'>404</h1>
      <h2>
        Rất tiếc, trang bạn tìm kiếm không tồn tại.
      </h2>

      <p className='mb-4'>
        Có vẻ như đường dẫn đã bị hỏng hoặc trang web đã được chuyển đi.
      </p>
      
      <Link href="/" className='btn-primary'>
        Quay lại trang chủ
      </Link>
    </div>
  )
}