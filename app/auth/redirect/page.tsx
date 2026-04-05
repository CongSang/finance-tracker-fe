'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function OAuth2Redirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // 1. Lấy token từ URL (Backend Java trả về sau khi redirect)
    const accessToken = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');

    console.log('Received tokens:', { accessToken, refreshToken });

    if (accessToken && refreshToken) {
      Cookies.set('access_token', accessToken, { path: '/' });
      Cookies.set('refresh_token', refreshToken, { path: '/' });

      router.replace('/');
    } else {
      router.replace('/login?error=oauth2_failed');
    }
  }, [searchParams, router]);

  return <div>Đang xử lý đăng nhập...</div>;
}
