import React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import AdminDashboard from "../admin/page"
import { guestService } from "@/lib/data-service"

// Mock guestService
jest.mock("@/lib/data-service", () => ({
  guestService: {
    getTodayGuests: jest.fn(),
  },
}))

// Mock function toast di luar jest.mock digunakan sebelum deklarasi
const toastMock: jest.Mock = jest.fn()

// Mock useToast untuk mengembalikan objek toastMock
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: toastMock,
  }),
}))

describe("AdminDashboard Page", () => {
  beforeEach(() => {
    jest.clearAllMocks() 
  })

  it("should render dashboard and show guest data", async () => {
    // Setup mock response data untuk getTodayGuests
    (guestService.getTodayGuests as jest.Mock).mockResolvedValue([
      {
        id: "1",
        name: "John Doe",
        institution: "ABC Corp",
        purpose: "Meeting",
        department: "Produksi",
        checkIn: "08:00",
        status: "Aktif",
      },
    ])

    render(<AdminDashboard />)

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    })
  })

  it("should call toast when export to excel button clicked", async () => {
    (guestService.getTodayGuests as jest.Mock).mockResolvedValue([])

    render(<AdminDashboard />)

    // Tunggu loading hilang
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
    })

    // Cari tombol export excel (pastikan ada atribut role dan name sesuai)
    const exportButton = screen.getByRole("button", { name: /export excel/i })
    fireEvent.click(exportButton)

    expect(toastMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Export Berhasil",
        description: "Data tamu berhasil diekspor ke Excel",
      }),
    )
  })
})
