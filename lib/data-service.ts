import { createClientSupabaseClient } from "@/lib/supabase/client"

// Types
export interface User {
  id: string
  email: string
  name: string
  role: string
}

export interface Guest {
  id: string
  name: string
  institution: string
  purpose: string
  department: string
  person: string
  identityNumber: string
  phoneNumber: string
  email: string
  photoUrl?: string
  checkIn?: string
  checkOut?: string
  status?: string
  date?: string
}

export interface Visit {
  id: string
  guestId: string
  checkIn: string
  checkOut?: string
  status: string
  date: string
}

// Auth functions
export const auth = {
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      const supabase = createClientSupabaseClient()

      // For demo purposes, hardcoded credentials
      if (email === "admin@pupukkujang.com" && password === "admin123") {
        const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

        if (error || !data) {
          throw new Error("Invalid credentials")
        }

        const user: User = {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
        }

        localStorage.setItem("currentUser", JSON.stringify(user))
        return user
      }

      throw new Error("Invalid credentials")
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },

  logout: (): Promise<void> => {
    return new Promise((resolve) => {
      localStorage.removeItem("currentUser")
      resolve()
    })
  },

  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null

    const userJson = localStorage.getItem("currentUser")
    if (userJson) {
      return JSON.parse(userJson)
    }
    return null
  },
}

// Guest data functions
export const guestService = {
  getGuests: async (): Promise<Guest[]> => {
    try {
      const supabase = createClientSupabaseClient()

      const { data: guestsData, error: guestsError } = await supabase.from("guests").select("*")

      if (guestsError) {
        throw guestsError
      }

      const { data: visitsData, error: visitsError } = await supabase.from("visits").select("*")

      if (visitsError) {
        throw visitsError
      }

      // Map the data to our Guest interface
      const guests: Guest[] = guestsData.map((guest) => {
        const guestVisits = visitsData.filter((visit) => visit.guest_id === guest.id)
        const latestVisit =
          guestVisits.length > 0
            ? guestVisits.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
            : null

        return {
          id: guest.id,
          name: guest.name,
          institution: guest.institution,
          purpose: guest.purpose,
          department: guest.department,
          person: guest.person || "",
          identityNumber: guest.identity_number,
          phoneNumber: guest.phone_number,
          email: guest.email,
          photoUrl: guest.photo_url,
          checkIn: latestVisit?.check_in || "",
          checkOut: latestVisit?.check_out || "",
          status: latestVisit?.status || "",
          date: latestVisit?.date || new Date().toISOString().split("T")[0],
        }
      })

      return guests
    } catch (error) {
      console.error("Error fetching guests:", error)
      // Fallback to local data if there's an error
      return []
    }
  },

  getTodayGuests: async (): Promise<Guest[]> => {
    try {
      const supabase = createClientSupabaseClient()
      const today = new Date().toISOString().split("T")[0] // Format: YYYY-MM-DD

      const { data: visitsData, error: visitsError } = await supabase.from("visits").select("*").eq("date", today)

      if (visitsError) {
        throw visitsError
      }

      if (!visitsData || visitsData.length === 0) {
        return []
      }

      const guestIds = visitsData.map((visit) => visit.guest_id)

      const { data: guestsData, error: guestsError } = await supabase.from("guests").select("*").in("id", guestIds)

      if (guestsError) {
        throw guestsError
      }

      // Map the data to our Guest interface
      const guests: Guest[] = guestsData.map((guest) => {
        const guestVisit = visitsData.find((visit) => visit.guest_id === guest.id)

        return {
          id: guest.id,
          name: guest.name,
          institution: guest.institution,
          purpose: guest.purpose,
          department: guest.department,
          person: guest.person || "",
          identityNumber: guest.identity_number,
          phoneNumber: guest.phone_number,
          email: guest.email,
          photoUrl: guest.photo_url,
          checkIn: guestVisit?.check_in || "",
          checkOut: guestVisit?.check_out || "",
          status: guestVisit?.status || "",
          date: guestVisit?.date || today,
        }
      })

      return guests
    } catch (error) {
      console.error("Error fetching today guests:", error)
      // Fallback to local data if there's an error
      return []
    }
  },

  getGuestById: async (id: string): Promise<Guest | null> => {
    try {
      const supabase = createClientSupabaseClient()

      const { data: guestData, error: guestError } = await supabase.from("guests").select("*").eq("id", id).single()

      if (guestError || !guestData) {
        throw guestError
      }

      const { data: visitsData, error: visitsError } = await supabase
        .from("visits")
        .select("*")
        .eq("guest_id", id)
        .order("created_at", { ascending: false })

      if (visitsError) {
        throw visitsError
      }

      const latestVisit = visitsData && visitsData.length > 0 ? visitsData[0] : null

      // Map to our Guest interface
      const guest: Guest = {
        id: guestData.id,
        name: guestData.name,
        institution: guestData.institution,
        purpose: guestData.purpose,
        department: guestData.department,
        person: guestData.person || "",
        identityNumber: guestData.identity_number,
        phoneNumber: guestData.phone_number,
        email: guestData.email,
        photoUrl: guestData.photo_url,
        checkIn: latestVisit?.check_in || "",
        checkOut: latestVisit?.check_out || "",
        status: latestVisit?.status || "",
        date: latestVisit?.date || new Date().toISOString().split("T")[0],
      }

      return guest
    } catch (error) {
      console.error("Error fetching guest by ID:", error)
      return null
    }
  },

  addGuest: async (guest: Omit<Guest, "id">): Promise<Guest> => {
    try {
      const supabase = createClientSupabaseClient()

      // Insert guest data
      const { data: guestData, error: guestError } = await supabase
        .from("guests")
        .insert({
          name: guest.name,
          institution: guest.institution,
          purpose: guest.purpose,
          department: guest.department,
          person: guest.person || "",
          identity_number: guest.identityNumber,
          phone_number: guest.phoneNumber,
          email: guest.email,
          photo_url: guest.photoUrl || null,
        })
        .select("id")
        .single()

      if (guestError || !guestData) {
        throw guestError
      }

      // Insert visit data
      const now = new Date()
      const checkInTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      const today = now.toISOString().split("T")[0]

      const { error: visitError } = await supabase.from("visits").insert({
        guest_id: guestData.id,
        check_in: checkInTime,
        status: "active",
        date: today,
      })

      if (visitError) {
        throw visitError
      }

      return {
        id: guestData.id,
        ...guest,
        checkIn: checkInTime,
      status: "active",
      date: today,
    }
    } catch (error) {
      console.error("Error adding guest:", error)
      throw error
    }
  },

  updateGuest: async (id: string, updates: Partial<Guest>): Promise<Guest | null> => {
    try {
      // Call API route for update using service_role key
      const response = await fetch("/api/guest/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, updates }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update guest")
      }

      // Tidak melakukan fetch data tamu terbaru karena endpoint tidak ada
      // Sebagai gantinya, kembalikan data lokal yang sudah diupdate
      return { id, ...updates } as Guest
    } catch (error) {
      console.error("Error updating guest:", error)
      return null
    }
  },

  checkoutGuest: async (id: string): Promise<Guest | null> => {
    const now = new Date()
    const checkOutTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`

    return guestService.updateGuest(id, {
      checkOut: checkOutTime,
      status: "completed",
    })
  },
}
