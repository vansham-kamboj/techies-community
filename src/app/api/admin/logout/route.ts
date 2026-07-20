import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * POST /api/admin/logout
 * Clears the admin HTTP-only session cookie.
 */
export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("techies_admin_session");

    return NextResponse.json({
      success: true,
      message: "Successfully logged out of admin session.",
    });
  } catch (err: any) {
    console.error("POST /api/admin/logout error:", err);
    return NextResponse.json(
      { success: false, error: "Logout failed." },
      { status: 500 }
    );
  }
}
