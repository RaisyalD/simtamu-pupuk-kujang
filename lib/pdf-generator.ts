// Import jsPDF and autoTable plugin
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { format } from "date-fns"
import { id } from "date-fns/locale"

// Function to generate PDF for guest list
export const generateGuestListPDF = (guests: any[], title = "Daftar Tamu") => {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(18)
  doc.text(title, 14, 22)

  // Add date
  doc.setFontSize(11)
  doc.text(`Tanggal: ${format(new Date(), "dd MMMM yyyy", { locale: id })}`, 14, 30)

  // Create table
  const tableColumn = ["ID", "Nama", "Institusi", "Tujuan", "Departemen", "Jam Masuk", "Status"]
  const tableRows = guests.map((guest) => [
    guest.id,
    guest.name,
    guest.institution,
    guest.purpose,
    guest.department,
    guest.checkIn,
    guest.status,
  ])

  // @ts-ignore
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [61, 139, 61], // #3D8B3D
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
  })

  return doc
}

// Function to generate PDF for guest detail
export const generateGuestDetailPDF = (guest: any) => {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(18)
  doc.text("Detail Tamu", 14, 22)

  // Add guest ID
  doc.setFontSize(12)
  doc.text(`ID Tamu: ${guest.id}`, 14, 30)

  // Add date
  doc.setFontSize(11)
  doc.text(`Tanggal Cetak: ${format(new Date(), "dd MMMM yyyy", { locale: id })}`, 14, 36)

  // Personal Information
  doc.setFontSize(14)
  doc.text("Informasi Pribadi", 14, 46)

  doc.setFontSize(10)
  doc.text(`Nama: ${guest.name}`, 14, 54)
  doc.text(`Institusi: ${guest.institution}`, 14, 60)
  doc.text(`Email: ${guest.email || "-"}`, 14, 66)
  doc.text(`Nomor HP: ${guest.phoneNumber || "-"}`, 14, 72)
  doc.text(`Nomor Identitas: ${guest.identityNumber || "-"}`, 14, 78)

  // Visit Information
  doc.setFontSize(14)
  doc.text("Informasi Kunjungan", 14, 88)

  doc.setFontSize(10)
  doc.text(`Tujuan: ${guest.purpose}`, 14, 96)
  doc.text(`Departemen: ${guest.department}`, 14, 102)
  doc.text(`Orang yang Dituju: ${guest.person}`, 14, 108)
  doc.text(`Tanggal: ${guest.date || format(new Date(), "yyyy-MM-dd")}`, 14, 114)
  doc.text(`Jam Masuk: ${guest.checkIn}`, 14, 120)
  doc.text(`Jam Keluar: ${guest.checkOut || "-"}`, 14, 126)
  doc.text(`Status: ${guest.status}`, 14, 132)

  // QR Code
  if (guest.id) {
    doc.addImage(
      `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(
        JSON.stringify({
          id: guest.id,
          name: guest.name,
          timestamp: new Date().toISOString(),
        }),
      )}`,
      "PNG",
      150,
      50,
      40,
      40,
    )
  }

  return doc
}
