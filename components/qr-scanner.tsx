"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Check, X, Camera, RefreshCw } from "lucide-react"

interface QRScannerProps {
  onScanSuccess: (decodedText: string, decodedResult: any) => void
  onScanFailure?: (error: any) => void
}

export function QRScanner({ onScanSuccess, onScanFailure }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanner, setScanner] = useState<any | null>(null)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isHtml5QrcodeSupported, setIsHtml5QrcodeSupported] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check if Html5Qrcode is available (it might not be in SSR)
    const checkHtml5QrcodeSupport = async () => {
      try {
        // Dynamic import to avoid SSR issues
        if (typeof window !== "undefined") {
          try {
            await import("html5-qrcode")
            setIsHtml5QrcodeSupported(true)
          } catch (error) {
            console.error("Html5Qrcode not supported:", error)
            setIsHtml5QrcodeSupported(false)
          }
        }
      } catch (error) {
        console.error("Html5Qrcode not supported:", error)
        setIsHtml5QrcodeSupported(false)
      }
    }

    checkHtml5QrcodeSupport()

    // Cleanup function to stop scanning when component unmounts
    return () => {
      if (scanner) {
        scanner
          .stop()
          .then(() => {
            console.log("Scanner stopped")
          })
          .catch((err: any) => {
            console.error("Error stopping scanner:", err)
          })
      }
    }
  }, [scanner])

  const startScanner = async () => {
    if (!isHtml5QrcodeSupported) {
      toast({
        title: "Error",
        description: "QR Code scanner tidak didukung di browser ini.",
        variant: "destructive",
      })
      return
    }

    setIsScanning(true)
    setIsLoading(true)
    setScanResult(null)

    try {
      // Dynamic import to avoid SSR issues
      const { Html5Qrcode } = await import("html5-qrcode")
      const html5QrCode = new Html5Qrcode("qr-reader")
      setScanner(html5QrCode)

      const qrCodeSuccessCallback = (decodedText: string, decodedResult: any) => {
        // Stop scanning
        html5QrCode
          .stop()
          .then(() => {
            setIsScanning(false)
            setScanResult(decodedText)
            onScanSuccess(decodedText, decodedResult)
            toast({
              title: "QR Code Terdeteksi",
              description: "QR Code berhasil dipindai",
            })
          })
          .catch((err: any) => {
            console.error("Error stopping scanner:", err)
          })
      }

      const qrCodeErrorCallback = (error: any) => {
        // This callback is called continuously when QR code is not detected
        // We don't want to show an error for this
        if (onScanFailure) {
          onScanFailure(error)
        }
      }

      const config = { fps: 10, qrbox: { width: 250, height: 250 } }

      // Start scanning
      html5QrCode
        .start({ facingMode: "environment" }, config, qrCodeSuccessCallback, qrCodeErrorCallback)
        .then(() => {
          setIsLoading(false)
        })
        .catch((err: any) => {
          setIsLoading(false)
          setIsScanning(false)
          console.error("Error starting scanner:", err)
          toast({
            title: "Error",
            description: "Gagal memulai pemindai QR Code. Pastikan kamera diizinkan.",
            variant: "destructive",
          })
        })
    } catch (error) {
      setIsLoading(false)
      setIsScanning(false)
      console.error("Error initializing scanner:", error)
      toast({
        title: "Error",
        description: "Gagal menginisialisasi pemindai QR Code.",
        variant: "destructive",
      })
    }
  }

  const stopScanner = () => {
    if (scanner) {
      scanner
        .stop()
        .then(() => {
          setIsScanning(false)
          console.log("Scanner stopped")
        })
        .catch((err: any) => {
          console.error("Error stopping scanner:", err)
        })
    }
  }

  const resetScanner = () => {
    setScanResult(null)
    startScanner()
  }

  // For demo purposes, let's add a mock scan button
  const mockScan = () => {
    setIsLoading(true)

    // Simulate scanning delay
    setTimeout(() => {
      setIsLoading(false)
      setIsScanning(false)

      const mockQrData = JSON.stringify({
        id: "G001",
        name: "Ahmad Fauzi",
        institution: "PT. Mitra Energi",
        timestamp: new Date().toISOString(),
      })

      setScanResult(mockQrData)
      onScanSuccess(mockQrData, { result: mockQrData })

      toast({
        title: "QR Code Terdeteksi (Demo)",
        description: "QR Code berhasil dipindai dalam mode demo",
      })
    }, 1500)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>QR Code Scanner</CardTitle>
        <CardDescription>Pindai QR Code tamu untuk verifikasi</CardDescription>
      </CardHeader>
      <CardContent>
        {scanResult ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900 rounded-lg">
              <Check className="h-8 w-8 text-green-600 dark:text-green-400 mr-2" />
              <p className="text-green-600 dark:text-green-400 font-medium">QR Code berhasil dipindai!</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm font-medium mb-1">Data QR Code:</p>
              <p className="text-sm break-all">{scanResult}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div id="qr-reader" className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"></div>
            {isLoading && (
              <div className="flex justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary-kujang" />
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {isScanning ? (
          <Button variant="destructive" onClick={stopScanner}>
            <X className="mr-2 h-4 w-4" />
            Berhenti
          </Button>
        ) : scanResult ? (
          <Button onClick={resetScanner}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Pindai Lagi
          </Button>
        ) : (
          <div className="flex gap-2 w-full">
            <Button onClick={startScanner} className="flex-1">
              <Camera className="mr-2 h-4 w-4" />
              Mulai Pemindaian
            </Button>
            <Button onClick={mockScan} variant="outline" className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Demo Scan
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
