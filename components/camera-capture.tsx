import React, { useEffect, useRef, useState } from "react"

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void
  onCancel: () => void
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
        setStream(mediaStream)
      } catch (err) {
        setError("Tidak dapat mengakses kamera. Pastikan izin kamera diberikan.")
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const imageSrc = canvas.toDataURL("image/jpeg")
    onCapture(imageSrc)
  }

  return (
    <div className="camera-capture">
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <video ref={videoRef} autoPlay playsInline className="w-full rounded-md" />
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <div className="flex justify-center mt-2 space-x-4">
            <button
              onClick={handleCapture}
              className="px-4 py-2 bg-primary-kujang text-white rounded-md hover:bg-primary-kujang-dark"
            >
              Ambil Foto
            </button>
            <button
              onClick={() => {
                if (stream) {
                  stream.getTracks().forEach((track) => track.stop())
                }
                onCancel()
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </>
      )}
    </div>
  )
}
