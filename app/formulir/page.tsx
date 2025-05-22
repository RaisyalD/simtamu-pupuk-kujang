"use client"

import { useState, useEffect, type FormEvent } from "react"
import type React from "react"
import * as z from "zod"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Camera, Upload, RefreshCw, Printer, Check, Mail, Phone, Loader2 } from "lucide-react"
import { CameraCapture } from "@/components/camera-capture"
import { createClientSupabaseClient } from "@/lib/supabase/client"
const { v4: uuidv4 } = require("uuid")

// Form schema
const formSchema = z.object({
  fullName: z.string().min(3, { message: "Nama harus minimal 3 karakter" }),
  institution: z.string().min(2, { message: "Institusi harus diisi" }),
  visitPurpose: z.string().min(1, { message: "Tujuan kunjungan harus dipilih" }),
  department: z.string().min(1, { message: "Departemen harus dipilih" }),
  personToVisit: z.string().optional(),
  identityNumber: z.string().min(5, { message: "Nomor identitas harus diisi" }),
  phoneNumber: z.string().min(10, { message: "Nomor HP harus diisi dengan benar" }),
  email: z.string().email({ message: "Email harus valid" }),
  verificationMethod: z.enum(["email", "sms"], {
    required_error: "Metode verifikasi harus dipilih",
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function GuestForm() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [photoSrc, setPhotoSrc] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [guestId, setGuestId] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    institution: "",
    visitPurpose: "",
    department: "",
    personToVisit: "",
    identityNumber: "",
    phoneNumber: "",
    email: "",
    verificationMethod: "email",
  })

  // Form validation state
  const [errors, setErrors] = useState({
    fullName: "",
    institution: "",
    visitPurpose: "",
    department: "",
    identityNumber: "",
    phoneNumber: "",
    email: "",
  })

  // Initialize Supabase client
  const supabase = createClientSupabaseClient()

  // Initialize guest ID on component mount
  useEffect(() => {
    setGuestId(uuidv4())
  }, [])

  // Save form data to Supabase in real-time
  useEffect(() => {
    const saveFormData = async () => {
      // Only save if we have at least a name
      if (!formData.fullName || formData.fullName.length < 3 || !guestId) return

      setIsSaving(true)

      try {
        // Check if guest already exists
        const { data: existingGuest } = await supabase.from("guests").select("id").eq("id", guestId).single()

        if (existingGuest) {
          // Update existing guest
          await supabase
            .from("guests")
            .update({
              name: formData.fullName,
              institution: formData.institution,
              purpose: formData.visitPurpose,
              department: formData.department,
              person: formData.personToVisit,
              identity_number: formData.identityNumber,
              phone_number: formData.phoneNumber,
              email: formData.email,
              photo_url: photoSrc,
              updated_at: new Date().toISOString(),
            })
            .eq("id", guestId)
        } else {
          // Insert new guest
          await supabase.from("guests").insert({
            id: guestId,
            name: formData.fullName,
            institution: formData.institution,
            purpose: formData.visitPurpose,
            department: formData.department,
            person: formData.personToVisit,
            identity_number: formData.identityNumber,
            phone_number: formData.phoneNumber,
            email: formData.email,
            photo_url: photoSrc,
          })
        }

        // Don't show success toast for automatic saves
      } catch (error) {
        console.error("Error saving form data:", error)
        // Don't show error toast for automatic saves to avoid disrupting the user
      } finally {
        setIsSaving(false)
      }
    }

    // Debounce the save operation to avoid too many requests
    const timeoutId = setTimeout(() => {
      saveFormData()
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [formData, photoSrc, guestId, supabase])

  const departments = [
    { value: "produksi", label: "Produksi" },
    { value: "pemasaran", label: "Pemasaran" },
    { value: "keuangan", label: "Keuangan" },
    { value: "hr", label: "Human Resources" },
    { value: "it", label: "Information Technology" },
    { value: "hsse", label: "HSSE" },
    { value: "qa", label: "Quality Assurance" },
  ]

  const visitPurposes = [
    { value: "meeting", label: "Rapat / Meeting" },
    { value: "interview", label: "Interview" },
    { value: "delivery", label: "Pengiriman / Delivery" },
    { value: "maintenance", label: "Maintenance" },
    { value: "audit", label: "Audit" },
    { value: "visit", label: "Kunjungan Umum" },
    { value: "other", label: "Lainnya" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error for this field when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error for this field when user selects
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  // Handle photo capture
  const capturePhoto = () => {
    setShowCamera(true)
  }

  const handleCaptureComplete = async (imageSrc: string) => {
    setShowCamera(false)

    try {
      // Upload photo to Supabase Storage
      // Convert base64 to blob
      const base64Response = await fetch(imageSrc)
      const photoBlob = await base64Response.blob()

      const fileName = `guest_photos/${formData.email || guestId}_${Date.now()}.jpg`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("guest-photos")
        .upload(fileName, photoBlob, {
          contentType: "image/jpeg",
          upsert: true,
        })

      if (uploadError) {
        console.error("Upload error:", uploadError.message)
        throw new Error(`Error uploading photo: ${uploadError.message}`)
      }

        // Get public URL
        const { data: urlData } = supabase.storage.from("guest-photos").getPublicUrl(fileName)

        if (urlData) {
          setPhotoSrc(urlData.publicUrl)
        } else {
          setPhotoSrc(imageSrc)
        }

      toast({
        title: "Foto berhasil diambil",
        description: "Foto ID Anda telah berhasil diambil dan disimpan",
      })
    } catch (error) {
      console.error("Error processing photo:", error)
      // Fallback to base64 if upload fails
      setPhotoSrc(imageSrc)

      toast({
        title: "Foto berhasil diambil",
        description: "Foto ID Anda telah berhasil diambil",
      })
    }
  }

  const handleCaptureCancel = () => {
    setShowCamera(false)
  }

  // Handle ID upload
  const uploadID = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // First show a preview
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string

        // Upload to Supabase Storage
        const fileName = `id_photos/${formData.email || guestId}_${Date.now()}.jpg`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("guest-photos")
        .upload(fileName, file, {
          contentType: file.type,
          upsert: true,
        })

        if (uploadError) {
          throw new Error(`Error uploading photo: ${uploadError.message}`)
        }

        // Get public URL
        const { data: urlData } = supabase.storage.from("guest-photos").getPublicUrl(fileName)

        // Store photo URL
        if (urlData) {
          setPhotoSrc(urlData.publicUrl)
        } else {
          // Fallback to base64 if URL retrieval fails
          setPhotoSrc(base64Image)
        }

        toast({
          title: "ID berhasil diunggah",
          description: "ID Anda telah berhasil diunggah dan disimpan",
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading ID:", error)
      toast({
        title: "Error",
        description: "Gagal mengunggah ID. Silakan coba lagi.",
        variant: "destructive",
      })
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {
      fullName: "",
      institution: "",
      visitPurpose: "",
      department: "",
      identityNumber: "",
      phoneNumber: "",
      email: "",
    }

    let isValid = true

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Nama harus diisi"
      isValid = false
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Nama harus minimal 3 karakter"
      isValid = false
    }

    if (!formData.institution.trim()) {
      newErrors.institution = "Institusi harus diisi"
      isValid = false
    }

    if (!formData.visitPurpose) {
      newErrors.visitPurpose = "Tujuan kunjungan harus dipilih"
      isValid = false
    }

    if (!formData.department) {
      newErrors.department = "Departemen harus dipilih"
      isValid = false
    }

    if (!formData.identityNumber.trim()) {
      newErrors.identityNumber = "Nomor identitas harus diisi"
      isValid = false
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Nomor HP harus diisi"
      isValid = false
    } else if (formData.phoneNumber.length < 10) {
      newErrors.phoneNumber = "Nomor HP harus diisi dengan benar"
      isValid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email harus diisi"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email harus valid"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Send OTP for verification
  const sendOTP = async () => {
    // Validate required fields
    if (!photoSrc) {
      toast({
        title: "Foto ID diperlukan",
        description: "Silakan ambil foto atau unggah ID Anda",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Log current user info for debugging
      const { data: user, error: userError } = await supabase.auth.getUser()
      console.log("Current user:", user)
      if (userError) {
        console.error("Error fetching user:", userError)
      }

      // Save guest and visit data
      await saveGuestAndVisitData()

      // Generate OTP
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString()
      console.log(`OTP: ${generatedOTP}`)

      // Save OTP to database
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString() // OTP valid 5 minutes
      const { error: insertError } = await supabase.from("otp_verifications").insert({
        email: formData.email,
        otp_code: generatedOTP,
        expires_at: expiresAt,
      })

      if (insertError) {
        throw new Error(`Error saving OTP: ${insertError.message}`)
      }

      // Send OTP via FormSubmit email
      const formSubmitUrl = "https://formsubmit.co/ajax/raisyal.26@upi.edu" // Ganti dengan email tujuan Anda
      const formDataToSend = new FormData()
      formDataToSend.append("otp", generatedOTP)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("subject", "Kode OTP Verifikasi")

      const response = await fetch(formSubmitUrl, {
        method: "POST",
        body: formDataToSend,
        headers: {
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Gagal mengirim email OTP")
      }

      setOtpSent(true)
      toast({
        title: "Kode OTP Terkirim",
        description: `Kode OTP telah dikirim ke ${formData.email}`,
      })
    } catch (error) {
      console.error("Error sending OTP:", error)
      toast({
        title: "Error",
        description: "Gagal mengirim OTP. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Simpan data tamu
  const saveGuestAndVisitData = async () => {
      const { error: guestError } = await supabase.from("guests").upsert({
        id: guestId,
        name: formData.fullName,
        institution: formData.institution,
        purpose: formData.visitPurpose,
        department: formData.department,
        identity_number: formData.identityNumber,
        phone_number: formData.phoneNumber,
        email: formData.email,
        photo_url: photoSrc,
      })

    if (guestError) {
      throw new Error(`Error saving guest data: ${guestError.message}`)
    }

    const { error: visitError } = await supabase.from("visits").insert({
      guest_id: guestId,
      check_in: new Date().toISOString(),
      status: "active", // Sesuaikan nilai status dengan constraint yang valid
      date: new Date().toISOString().split("T")[0],
    })

    if (visitError) {
      throw new Error(`Error saving visit data: ${visitError.message}`)
    }
  }


  // Verify OTP
  const verifyOTP = async () => {
    setIsVerifying(true)

    try {
      if (otpCode.length === 6) {
        // Check OTP in database
        const { data: otpData, error: fetchError } = await supabase
          .from("otp_verifications")
          .select("*")
          .eq("email", formData.email)
          .eq("otp_code", otpCode)
          .gt("expires_at", new Date().toISOString())
          .single()

        if (fetchError || !otpData) {
          toast({
            title: "Verifikasi Gagal",
            description: "Kode OTP tidak valid atau sudah kedaluwarsa. Silakan coba lagi.",
            variant: "destructive",
          })
          setIsVerifying(false)
          return
        }

        // Generate QR code with form data
        setQrCode(
          `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
            JSON.stringify({
              id: guestId,
              name: formData.fullName,
              institution: formData.institution,
              purpose: formData.visitPurpose,
              department: formData.department,
              personToVisit: formData.personToVisit || "",
              identityNumber: formData.identityNumber,
              timestamp: new Date().toISOString(),
            }),
          )}`,
        )

        setIsSuccess(true)

        toast({
          title: "Verifikasi Berhasil",
          description: "Kode OTP berhasil diverifikasi dan dikirim ke email Anda",
        })
      } else {
        toast({
          title: "Verifikasi Gagal",
          description: "Kode OTP tidak valid. Silakan coba lagi.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      toast({
        title: "Error",
        description: "Gagal memverifikasi OTP. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Proceed to verification step
    setStep(2)
  }

  // Handle print receipt
  const printReceipt = () => {
    window.print()
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex-1 pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Formulir Tamu</h1>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-10">
              Silakan isi formulir berikut untuk mendaftar sebagai tamu di PT. Pupuk Kujang
            </p>

            {isSaving && (
              <div className="fixed bottom-4 right-4 bg-primary-kujang text-white px-4 py-2 rounded-md flex items-center shadow-lg z-50">
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                <span>Menyimpan...</span>
              </div>
            )}

            {!isSuccess ? (
              <Card>
                <CardHeader>
                  <CardTitle>Data Kunjungan</CardTitle>
                  <CardDescription>Masukkan informasi diri dan tujuan kunjungan Anda</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="step1" value={`step${step}`}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="step1" disabled={step !== 1}>
                        Informasi Dasar
                      </TabsTrigger>
                      <TabsTrigger value="step2" disabled={step !== 2}>
                        Verifikasi
                      </TabsTrigger>
                    </TabsList>

                    <form onSubmit={handleSubmit}>
                      <TabsContent value="step1">
                        <div className="space-y-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="fullName">Nama Lengkap</Label>
                              <Input
                                id="fullName"
                                name="fullName"
                                placeholder="Masukkan nama lengkap"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className={errors.fullName ? "border-red-500" : ""}
                              />
                              {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="institution">Instansi/Asal</Label>
                              <Input
                                id="institution"
                                name="institution"
                                placeholder="Masukkan instansi/asal"
                                value={formData.institution}
                                onChange={handleInputChange}
                                className={errors.institution ? "border-red-500" : ""}
                              />
                              {errors.institution && <p className="text-sm text-red-500">{errors.institution}</p>}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="visitPurpose">Tujuan Kunjungan</Label>
                              <Select
                                value={formData.visitPurpose}
                                onValueChange={(value) => handleSelectChange("visitPurpose", value)}
                              >
                                <SelectTrigger className={errors.visitPurpose ? "border-red-500" : ""}>
                                  <SelectValue placeholder="Pilih tujuan kunjungan" />
                                </SelectTrigger>
                                <SelectContent>
                                  {visitPurposes.map((purpose) => (
                                    <SelectItem key={purpose.value} value={purpose.value}>
                                      {purpose.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors.visitPurpose && <p className="text-sm text-red-500">{errors.visitPurpose}</p>}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="department">Departemen</Label>
                              <Select
                                value={formData.department}
                                onValueChange={(value) => handleSelectChange("department", value)}
                              >
                                <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                                  <SelectValue placeholder="Pilih departemen" />
                                </SelectTrigger>
                                <SelectContent>
                                  {departments.map((dept) => (
                                    <SelectItem key={dept.value} value={dept.value}>
                                      {dept.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors.department && <p className="text-sm text-red-500">{errors.department}</p>}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="personToVisit">Orang yang Dituju (Opsional)</Label>
                            <Input
                              id="personToVisit"
                              name="personToVisit"
                              placeholder="Masukkan nama orang yang dituju"
                              value={formData.personToVisit}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="identityNumber">Nomor Identitas</Label>
                              <Input
                                id="identityNumber"
                                name="identityNumber"
                                placeholder="Masukkan nomor KTP/SIM/Passport"
                                value={formData.identityNumber}
                                onChange={handleInputChange}
                                className={errors.identityNumber ? "border-red-500" : ""}
                              />
                              {errors.identityNumber && <p className="text-sm text-red-500">{errors.identityNumber}</p>}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="phoneNumber">Nomor HP</Label>
                              <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                placeholder="Masukkan nomor HP"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className={errors.phoneNumber ? "border-red-500" : ""}
                              />
                              {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber}</p>}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Masukkan email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={errors.email ? "border-red-500" : ""}
                              />
                              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <Label>Metode Verifikasi</Label>
                            <RadioGroup
                              value={formData.verificationMethod}
                              onValueChange={(value) => handleSelectChange("verificationMethod", value)}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem value="email" id="email-method" />
                                <Label htmlFor="email-method" className="font-normal flex items-center">
                                  <Mail className="mr-2 h-4 w-4" />
                                  Email
                                </Label>
                              </div>
                              <div className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem value="sms" id="sms-method" />
                                <Label htmlFor="sms-method" className="font-normal flex items-center">
                                  <Phone className="mr-2 h-4 w-4" />
                                  SMS
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="flex justify-end">
                            <Button type="submit">Selanjutnya</Button>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="step2">
                        <div className="space-y-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <h3 className="text-lg font-medium mb-4">Foto ID Card / KTP</h3>
                              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
                                {showCamera ? (
                                  <CameraCapture onCapture={handleCaptureComplete} onCancel={handleCaptureCancel} />
                                ) : photoSrc ? (
                                  <div className="relative w-full h-48">
                                    <img
                                      src={photoSrc || "/placeholder.svg"}
                                      alt="ID Card"
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                ) : (
                                  <div className="py-8">
                                    <div className="flex justify-center mb-4">
                                      <Upload className="h-12 w-12 text-gray-400" />
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                      Ambil foto atau unggah ID Card / KTP Anda
                                    </p>
                                  </div>
                                )}

                                {!showCamera && (
                                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                    <Button type="button" variant="outline" className="w-full" onClick={capturePhoto}>
                                      <Camera className="mr-2 h-4 w-4" />
                                      Ambil Foto
                                    </Button>
                                    <div className="relative w-full">
                                      <Button type="button" variant="outline" className="w-full">
                                        <Upload className="mr-2 h-4 w-4" />
                                        Unggah ID
                                      </Button>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={uploadID}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              {!otpSent ? (
                                <div className="space-y-4">
                                  <h3 className="text-lg font-medium mb-4">Verifikasi OTP</h3>
                                  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                                    <p className="text-blue-600 dark:text-blue-300">
                                      Untuk menyelesaikan pendaftaran, kami perlu memverifikasi identitas Anda. Kode OTP
                                      akan dikirim ke {formData.verificationMethod === "email" ? "email" : "nomor HP"}{" "}
                                      Anda.
                                    </p>
                                  </div>
                                  <Button
                                    type="button"
                                    onClick={sendOTP}
                                    disabled={isSubmitting || !photoSrc}
                                    className="w-full"
                                  >
                                    {isSubmitting ? (
                                      <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Mengirim OTP...
                                      </>
                                    ) : (
                                      <>Kirim OTP</>
                                    )}
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <h3 className="text-lg font-medium mb-4">Masukkan Kode OTP</h3>
                                  <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                                    <p className="text-green-600 dark:text-green-300">
                                      Kode OTP telah dikirim ke{" "}
                                      {formData.verificationMethod === "email" ? formData.email : formData.phoneNumber}
                                    </p>
                                  </div>
                                  <div>
                                    <label htmlFor="otp" className="text-sm font-medium">
                                      Kode OTP
                                    </label>
                                    <Input
                                      id="otp"
                                      type="text"
                                      placeholder="Masukkan kode OTP"
                                      value={otpCode}
                                      onChange={(e) => setOtpCode(e.target.value)}
                                      maxLength={6}
                                      className="text-center text-lg tracking-widest mt-1"
                                    />
                                  </div>

                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Tidak menerima kode?{" "}
                                    <Button variant="link" className="p-0 h-auto" onClick={sendOTP}>
                                      Kirim ulang
                                    </Button>
                                  </div>

                                  <Button
                                    type="button"
                                    onClick={verifyOTP}
                                    disabled={isVerifying || otpCode.length !== 6}
                                    className="w-full"
                                  >
                                    {isVerifying ? (
                                      <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Memverifikasi...
                                      </>
                                    ) : (
                                      <>Verifikasi</>
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between">
                            <Button type="button" variant="outline" onClick={() => setStep(1)}>
                              Kembali
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </form>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto bg-green-100 dark:bg-green-900 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-6 w-6 text-green-600 dark:text-green-300" />
                  </div>
                  <CardTitle className="text-2xl">Pendaftaran Berhasil!</CardTitle>
                  <CardDescription>Data kunjungan Anda telah berhasil disimpan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Detail Kunjungan</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Nama Lengkap</p>
                          <p className="font-medium">{formData.fullName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Instansi/Asal</p>
                          <p className="font-medium">{formData.institution}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Tujuan Kunjungan</p>
                          <p className="font-medium">
                            {visitPurposes.find((p) => p.value === formData.visitPurpose)?.label}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Departemen</p>
                          <p className="font-medium">
                            {departments.find((d) => d.value === formData.department)?.label}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Orang yang Dituju</p>
                          <p className="font-medium">{formData.personToVisit || "-"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Waktu Kedatangan</p>
                          <p className="font-medium">
                            {new Date().toLocaleString("id-ID", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">QR Code Tamu</h3>
                      <div className="flex flex-col items-center">
                        {qrCode && (
                          <div className="border p-4 bg-white rounded-lg mb-4">
                            <img src={qrCode || "/placeholder.svg"} alt="QR Code Tamu" className="w-48 h-48" />
                          </div>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                          Tunjukkan QR Code ini kepada petugas resepsionis saat masuk dan keluar area
                        </p>
                        <Button onClick={printReceipt} className="w-full">
                          <Printer className="mr-2 h-4 w-4" />
                          Cetak Bukti Kunjungan
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSuccess(false)
                      setStep(1)
                      setOtpSent(false)
                      setOtpCode("")
                      setFormData({
                        fullName: "",
                        institution: "",
                        visitPurpose: "",
                        department: "",
                        personToVisit: "",
                        identityNumber: "",
                        phoneNumber: "",
                        email: "",
                        verificationMethod: "email",
                      })
                      setPhotoSrc(null)
                      setQrCode(null)
                      setGuestId(uuidv4())
                    }}
                    className="w-full"
                  >
                    Kembali ke Formulir
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
