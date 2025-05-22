import { render, screen } from '@testing-library/react'
import Home from '../page'
import '@testing-library/jest-dom'
import { useRouter } from 'next/navigation'

// Mock next/link supaya testing bisa jalan tanpa error
jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>
})

// Mock komponen Navbar, Footer, Button jika perlu
jest.mock('@/components/navbar', () => ({ Navbar: () => <div>Navbar</div> }))
jest.mock('@/components/footer', () => ({ Footer: () => <div>Footer</div> }))
jest.mock('@/components/ui/button', () => ({ Button: ({ children, ...props }: any) => <button {...props}>{children}</button> }))

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />)
    
    // Cek ada judul utama
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('SIMTAMU')

    // Cek tombol Masuk sebagai Tamu ada dan href benar
    const tamuLink = screen.getByRole('link', { name: /Masuk sebagai Tamu/i })
    expect(tamuLink).toHaveAttribute('href', '/formulir')

    // Cek tombol Login Admin ada dan href benar
    const loginLink = screen.getByRole('link', { name: /Login Admin/i })
    expect(loginLink).toHaveAttribute('href', '/login')

    // Cek section fitur muncul
    expect(screen.getByRole('heading', { name: /Fitur Unggulan/i })).toBeInTheDocument()

    // Cek footer muncul
    expect(screen.getByText(/Footer/i)).toBeInTheDocument()
  })
})
