'use client'

import { Footer, Header, SideBar } from '@/components/index'
import { useAccountInfo } from '@/hooks/index';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import { LayoutProps } from '@/models/index'
import { usePathname } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

const HomeLayout = (props: LayoutProps) => {
  useAccountInfo();
  const pathname = usePathname();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [, startTransition] = useTransition();
  const sidebarRef = useOutsideClick<HTMLDivElement>(() => setOpenSidebar(false));

  useEffect(() => {
    startTransition(() => {
      setOpenSidebar(false);
    });
  }, [pathname]);

  return (
    <div className='flex'>
      <div className='hidden md:block'>
        <SideBar />
      </div>

      {/* Mobile Sidebar */}
      <div ref={sidebarRef} className={`fixed md:hidden z-50 top-0 left-0 h-full w-64 bg-gray-500/50 shadow-lg transform ${openSidebar ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <SideBar />
      </div>

      <div className='grow'>
        <Header onOpenSidebar={() => setOpenSidebar(true)} />
        <main className='min-h-[80vh] p-4 md:p-8 overflow-y-auto'>
          {props.children}
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default HomeLayout