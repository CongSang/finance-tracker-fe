'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

function RedirectHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const accessToken = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');

    if (accessToken && refreshToken) {
        Cookies.set('access_token', accessToken, { path: '/' });
        Cookies.set('refresh_token', refreshToken, { path: '/' });
        router.replace('/');
    } else {
        // Nếu thiếu token thì về login
        router.replace('/login?error=oauth2_failed');
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
        <p>Đang xử lý đăng nhập, vui lòng đợi...</p>
    </div>
  );
}

export default function OAuth2RedirectPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Đang tải...</div>}>
      <RedirectHandler />
    </Suspense>
  );
}