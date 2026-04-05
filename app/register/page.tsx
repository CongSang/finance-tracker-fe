'use client'

import { Input, Footer, UploadImage } from "@/components/index"
import { toastError, uploadToCloudinary, validateEmail, validatePassword } from "@/lib/index"
import { registerApi } from "@/services/index"
import { PiggyBank, Wallet } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, MouseEvent } from "react"
import toast from "react-hot-toast"

const Register = () => {
  const router = useRouter();
  const [avatar, setAvatar] = useState<File | null>(null)
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!fullName.trim()) {
      toast.error('Vui lòng nhập tên đầy đủ.');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Vui lòng nhập địa chỉ email hợp lệ.');
      return;
    }

    if (!validatePassword(password)) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất một chữ cái và một số.');
      return;
    }

    setLoading(true)
    let avatarUrl = '';

    try {
      if (avatar) {
        const imageUrl = await uploadToCloudinary(avatar);
        avatarUrl = imageUrl || "";
      }

      await registerApi({ 
        email, 
        fullName,
        password,
        avatarUrl
      });

      toast.success("Đăng kí thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.")
      router.push('/login');
    } catch (error) {
      console.error("Registration failed:", error)
      toastError(error, "Đang kí thất bại. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-12 px-4 font-sans">
      {/* Header Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-primary p-1.5 rounded-md">
          <Wallet size={18} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-primary">Finance Tracker</span>
      </div>

      <div
        className="w-full max-w-125 bg-white rounded-3xl shadow-md p-8 md:p-10"
      >
        <div className="flex flex-col items-center text-center">
          {/* Piggy Bank Icon */}
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
            <PiggyBank size={32} className="text-primary" />
          </div>

          <h2 className="mb-2">Đăng Kí Tài Khoản</h2>
          <p className="mb-6">Tạo tài khoản mới để bắt đầu hành trình tài chính của bạn.</p>

          {/* Profile Photo Upload */}
          <UploadImage image={avatar} setImage={setAvatar} />

          {/* Form */}
          <form className="w-full space-y-4 text-left">
            <Input 
              value={fullName}
              disabled={loading}
              onChange={(e) => setFullName(e.target.value)}
              label="Full Name" 
              placeholder="John Doe" 
              type="text" 
            />

            <Input 
              value={email}
              disabled={loading}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address" 
              placeholder="name@company.com" 
              type="email" 
            />

            <Input 
              value={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
              label="Password" 
              placeholder="••••••••" 
              type="password" 
            />

            <button 
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full btn-primary mt-4"
            >
              Tạo Tài Khoản
            </button>
          </form>

          <p className="text-xs text-[#9CA3AF] mt-4">
            By signing up, you agree to our <Link href="#" className="font-medium hover:underline">Terms of Service</Link>.
          </p>

          <div className="w-full border-t border-[#F3F4F6] mt-4 pt-4">
            <p className="text-sm text-[#6B7280]">
              Already have an account? <Link href="/login" className="font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Register
