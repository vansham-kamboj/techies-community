import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * POST /api/admin/login
 * Authenticates admin and sets HTTP-only session cookie.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const password = body.password;
    const expectedPassword = process.env.ADMIN_PASSWORD || "techiesadmin2026";

    if (password === expectedPassword) {
      const cookieStore = await cookies();
      cookieStore.set("techies_admin_session", "authenticated", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax",
      });

      return NextResponse.json({
        success: true,
        message: "Admin access granted.",
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid admin authorization key." },
        { status: 401 }
      );
    }
  } catch (err: any) {
    console.error("POST /api/admin/login error:", err);
    return NextResponse.json(
      { success: false, error: "Authentication check failed." },
      { status: 500 }
    );
  }
}
