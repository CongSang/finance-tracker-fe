'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { accountInfoApi } from '@/services/index';

export function useAccountInfo() {
	const router = useRouter();
	const { user, setUser } = useAuth();
	const hasFetched = useRef(false);

	useEffect(() => {
		if (user || hasFetched.current) {
			return;
		}

		const fetchUserInfo = async () => {
			hasFetched.current = true;

			try {
				const data = await accountInfoApi();
				setUser(data);
			} catch (error: unknown) {
				console.error('Fetch user info failed', error);
			}
		};

		fetchUserInfo();
	}, [setUser, router, user]);
}