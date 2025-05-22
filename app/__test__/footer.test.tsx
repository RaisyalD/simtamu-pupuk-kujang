import { render, screen } from "@testing-library/react"
import { Footer } from "@/components/footer"

describe("Footer component", () => {
  test("renders the footer with all main sections", () => {
    render(<Footer />)

    // Cek judul
    expect(screen.getByText("SIMTAMU")).toBeInTheDocument()
    expect(screen.getByText("Kontak Kami")).toBeInTheDocument()
    expect(screen.getByText("Tautan Cepat")).toBeInTheDocument()

    // Cek kontak info
    expect(screen.getByText(/Jl. Jend. A. Yani No.39/i)).toBeInTheDocument()
    expect(screen.getByText(/\(0264\) 123456/)).toBeInTheDocument()
    expect(screen.getByText("info@pupukkujang.com")).toBeInTheDocument()

    // Cek link navigasi
    expect(screen.getByRole("link", { name: "Beranda" })).toHaveAttribute("href", "/")
    expect(screen.getByRole("link", { name: "Formulir Tamu" })).toHaveAttribute("href", "/formulir")
    expect(screen.getByRole("link", { name: "Kontak" })).toHaveAttribute("href", "/kontak")
    expect(screen.getByRole("link", { name: "Login Admin" })).toHaveAttribute("href", "/login")

    // Cek copyright tahun berjalan
    const year = new Date().getFullYear()
    expect(screen.getByText(`© ${year} PT. Pupuk Kujang. All rights reserved.`)).toBeInTheDocument()

    // Cek versi aplikasi
    expect(screen.getByText("SIMTAMU v1.0")).toBeInTheDocument()
  })
})
