import * as XLSX from "xlsx"
import { format } from "date-fns"

// Function to generate Excel for guest list
export const generateGuestListExcel = (guests: any[], filename = "Daftar_Tamu") => {
  // Prepare data for Excel
  const excelData = guests.map((guest) => ({
    ID: guest.id,
    Nama: guest.name,
    Institusi: guest.institution,
    Tujuan: guest.purpose,
    Departemen: guest.department,
    "Jam Masuk": guest.checkIn,
    "Jam Keluar": guest.checkOut || "-",
    Status: guest.status,
    Tanggal: guest.date || format(new Date(), "yyyy-MM-dd"),
  }))

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData)

  // Create workbook
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tamu")

  // Generate Excel file
  XLSX.writeFile(workbook, `${filename}_${format(new Date(), "yyyy-MM-dd")}.xlsx`)
}
