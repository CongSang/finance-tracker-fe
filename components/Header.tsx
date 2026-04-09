'use client'

import { Bell, CircleUserRound, LogOut, Menu, User, Wallet } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useOutsideClick } from "@/hooks/index";
import toast from "react-hot-toast";
import { logoutApi } from "@/services/authService";
import { DropdownPopup } from "./DropdownPopup";

interface HeaderProps {
  onOpenSidebar?: () => void;
}

export const Header = ({ onOpenSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useOutsideClick<HTMLDivElement>(() => setShowUserMenu(false));

  const handleLogout = async () => {
    await logoutApi().then(() => {
      logout();
    })
    .catch(() => {
      toast.error('Có lỗi khi đăng xuất. Vui lòng thử lại.');
    })
  }

  return (
    <header className="flex justify-between items-center px-4 md:px-8 h-16 sticky top-0 z-20 bg-white backdrop-blur-md border-b border-gray-100">
      <div>
        <div className="flex items-center gap-3 md:hidden ">
          <button onClick={onOpenSidebar} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
            <Menu className="w-5 h-5" />
          </button>

          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Wallet className="text-white w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-primary leading-none">Finance Tracker</h2>
            <p className="text-[10px] uppercase tracking-widest mt-1">Wealth Management</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 md:gap-6">
        <button className="relative hover:bg-gray-100 p-2 rounded-full transition-colors">
          <Bell className="w-5 h-5 md:w-6 md:h-6" />
          <span className='absolute top-1 right-1 h-3.5 w-3.5 text-white rounded-full text-[10px] bg-red-500 font-medium flex items-center justify-center'>
              0
          </span>
        </button>
        
        <div className="flex items-center">
          <div ref={userMenuRef} className="relative">
            {user?.avatarUrl ? (
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="hover:bg-gray-100 p-1 rounded-full transition-colors"
              >
                <Image 
                  src={user.avatarUrl}
                  alt="Profile"
                  width={108}
                  height={108}
                  className="w-8 h-8 rounded-full object-cover shadow"
                />
              </button>
            ) : (
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <CircleUserRound className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            )}

            {showUserMenu && (
                <DropdownPopup
                  className="mt-2 w-56"
                >
                    {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                        {user?.avatarUrl ? (
                            <Image 
                                src={user.avatarUrl}
                                alt="Profile"
                                width={48}
                                height={48}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <User className="w-4 h-4 text-primary" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                            {user?.fullName || ""}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                      </div>
                    </div>
                  </div>

                  {/* Logout button */}
                  <div className="py-1">
                      <button 
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                          <LogOut className="w-4 h-4 text-gray-500" />
                          <span>Logout</span>
                      </button>
                  </div>
                </DropdownPopup>
            )}
          </div>
        </div>
      </div>
    </header>
  )
};