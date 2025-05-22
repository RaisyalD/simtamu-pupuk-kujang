"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { RefreshCw, Lock } from "lucide-react"
import { createClientSupabaseClient } from "@/lib/supabase/client"

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const validateForm = () => {
    let isValid = true

    // Reset errors
    setEmailError("")
    setPasswordError("")

    // Validate email
    if (!email) {
      setEmailError("Email harus diisi")
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email harus valid")
      isValid = false
    }

    // Validate password
    if (!password) {
      setPasswordError("Password harus diisi")
      isValid = false
    } else if (password.length < 6) {
      setPasswordError("Password minimal 6 karakter")
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClientSupabaseClient()

      // Gunakan metode signInWithPassword dari Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error || !data.session) {
        throw new Error(error?.message || "Login gagal")
      }

      // Simpan data user sesuai kebutuhan
      localStorage.setItem("user", JSON.stringify(data.user))

      toast({
        title: "Login berhasil",
        description: "Selamat datang di dashboard admin",
      })

      // Redirect ke dashboard admin
      setTimeout(() => {
        router.push("/admin")
      }, 500)
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login gagal",
        description: error instanceof Error ? error.message : "Email atau password salah",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex-1 pt-20 md:pt-24 pb-16 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Login Admin</CardTitle>
                <CardDescription className="text-center">
                  Masukkan kredensial Anda untuk mengakses dashboard admin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@pupukkujang.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary-kujang hover:bg-primary-kujang/90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Login
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="text-sm text-center text-gray-500 dark:text-gray-400">
                  <p>Demo Credentials:</p>
                  <p>Email: admin@pupukkujang.com</p>
                  <p>Password: admin123</p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
