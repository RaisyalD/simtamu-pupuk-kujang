"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileDown, Printer } from "lucide-react"

// Import chart components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

// Sample data for charts
const monthlyVisitData = [
  { name: "Jan", visits: 65 },
  { name: "Feb", visits: 59 },
  { name: "Mar", visits: 80 },
  { name: "Apr", visits: 81 },
  { name: "Mei", visits: 56 },
  { name: "Jun", visits: 55 },
  { name: "Jul", visits: 40 },
  { name: "Agu", visits: 45 },
  { name: "Sep", visits: 67 },
  { name: "Okt", visits: 78 },
  { name: "Nov", visits: 90 },
  { name: "Des", visits: 100 },
]

const departmentData = [
  { name: "Produksi", value: 35 },
  { name: "HSSE", value: 20 },
  { name: "IT", value: 15 },
  { name: "Keuangan", value: 10 },
  { name: "HR", value: 10 },
  { name: "Pemasaran", value: 5 },
  { name: "Lainnya", value: 5 },
]

const weeklyVisitData = [
  { name: "Senin", visits: 24 },
  { name: "Selasa", visits: 30 },
  { name: "Rabu", visits: 28 },
  { name: "Kamis", visits: 32 },
  { name: "Jumat", visits: 26 },
  { name: "Sabtu", visits: 12 },
  { name: "Minggu", visits: 5 },
]

const COLORS = ["#3D8B3D", "#F2C300", "#FF8042", "#0088FE", "#00C49F", "#FFBB28", "#999999"]

export default function StatisticsPage() {
  const [period, setPeriod] = useState("year")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistik Kunjungan</h1>
        <p className="text-muted-foreground">Visualisasi data kunjungan tamu PT. Pupuk Kujang</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Tabs defaultValue="monthly" className="w-full md:w-auto">
          <TabsList>
            <TabsTrigger value="weekly">Mingguan</TabsTrigger>
            <TabsTrigger value="monthly">Bulanan</TabsTrigger>
            <TabsTrigger value="department">Departemen</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Bulan Ini</SelectItem>
              <SelectItem value="quarter">Kuartal Ini</SelectItem>
              <SelectItem value="year">Tahun Ini</SelectItem>
              <SelectItem value="custom">Kustom</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <FileDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="monthly" className="w-full">
        <TabsContent value="monthly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kunjungan Bulanan</CardTitle>
              <CardDescription>Jumlah kunjungan tamu per bulan selama tahun 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyVisitData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="visits" name="Jumlah Kunjungan" fill="#3D8B3D" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Statistik Kunjungan</CardTitle>
                <CardDescription>Ringkasan statistik kunjungan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Kunjungan</span>
                    <span className="font-medium">816</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rata-rata per Bulan</span>
                    <span className="font-medium">68</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bulan Tertinggi</span>
                    <span className="font-medium">Desember (100)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bulan Terendah</span>
                    <span className="font-medium">Juli (40)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tren</span>
                    <span className="font-medium text-green-600">+12% dari tahun lalu</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tren Tahunan</CardTitle>
                <CardDescription>Perbandingan kunjungan dengan tahun sebelumnya</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={monthlyVisitData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="visits" name="2024" stroke="#3D8B3D" activeDot={{ r: 8 }} />
                      <Line
                        type="monotone"
                        dataKey="visits"
                        name="2023"
                        stroke="#F2C300"
                        activeDot={{ r: 8 }}
                        // Simulate previous year data by offsetting current data
                        data={monthlyVisitData.map((item) => ({
                          name: item.name,
                          visits: Math.floor(item.visits * 0.88),
                        }))}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kunjungan Mingguan</CardTitle>
              <CardDescription>Jumlah kunjungan tamu per hari dalam seminggu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyVisitData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="visits" name="Jumlah Kunjungan" fill="#3D8B3D" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="department" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kunjungan per Departemen</CardTitle>
              <CardDescription>Distribusi kunjungan tamu berdasarkan departemen tujuan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} kunjungan`, "Jumlah"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
