import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

export async function POST(request: NextRequest) {
  try {
    const { id, updates } = await request.json()

    if (!id || !updates) {
      return NextResponse.json({ error: "Missing id or updates" }, { status: 400 })
    }

    // Update guest data
    const { data: currentGuest, error: getError } = await supabaseAdmin
      .from("guests")
      .select("*")
      .eq("id", id)
      .single()

    if (getError || !currentGuest) {
      return NextResponse.json({ error: "Guest not found" }, { status: 404 })
    }

    const updateData: any = {}

    if (updates.name) updateData.name = updates.name
    if (updates.institution) updateData.institution = updates.institution
    if (updates.purpose) updateData.purpose = updates.purpose
    if (updates.department) updateData.department = updates.department
    if (updates.person) updateData.person = updates.person
    if (updates.identityNumber) updateData.identity_number = updates.identityNumber
    if (updates.phoneNumber) updateData.phone_number = updates.phoneNumber
    if (updates.email) updateData.email = updates.email
    if (updates.photoUrl) updateData.photo_url = updates.photoUrl

    if (Object.keys(updateData).length > 0) {
      updateData.updated_at = new Date().toISOString()

      const { error: updateError } = await supabaseAdmin.from("guests").update(updateData).eq("id", id)

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    }

    // Handle visit updates if needed
    if (updates.checkOut || updates.status) {
      const { data: visits, error: visitsError } = await supabaseAdmin
        .from("visits")
        .select("*")
        .eq("guest_id", id)
        .order("created_at", { ascending: false })
        .limit(1)

      if (visitsError) {
        return NextResponse.json({ error: visitsError.message }, { status: 500 })
      }

    if (visits && visits.length > 0) {
      const visitUpdateData: any = {}

      if (updates.checkOut) visitUpdateData.check_out = updates.checkOut

      const allowedStatusValues = ["pending", "active", "completed"]
      if (updates.status) {
        if (!allowedStatusValues.includes(updates.status)) {
          return NextResponse.json({ error: `Invalid status value: ${updates.status}` }, { status: 400 })
        }
        visitUpdateData.status = updates.status
      }

      visitUpdateData.date = visits[0].date
      visitUpdateData.updated_at = new Date().toISOString()

      const { error: visitUpdateError } = await supabaseAdmin
        .from("visits")
        .update(visitUpdateData)
        .eq("id", visits[0].id)

      if (visitUpdateError) {
        return NextResponse.json({ error: visitUpdateError.message }, { status: 500 })
      }
    }
    }

    return NextResponse.json({ message: "Guest updated successfully" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 })
  }
}
