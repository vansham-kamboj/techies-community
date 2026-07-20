import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql, initDb } from "@/lib/db";
import { DbTechPassCard } from "@/app/actions/techpass";

/**
 * GET /api/techpass/[id]
 * Retrieves a specific TechPass card by its tech_id.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDb();
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing techId parameter." },
        { status: 400 }
      );
    }

    const rows = await sql<DbTechPassCard[]>`
      SELECT * FROM techpass_cards
      WHERE tech_id = ${id}
      LIMIT 1;
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { success: false, error: `TechPass card ${id} not found.` },
        { status: 404 }
      );
    }

    const row = rows[0];
    const serialized = {
      ...row,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: serialized });
  } catch (err: any) {
    console.error("GET /api/techpass/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve TechPass card." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/techpass/[id]
 * Deletes a specific TechPass card (requires valid admin session or header).
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing techId parameter." },
        { status: 400 }
      );
    }

    // Check authorization: either admin session cookie or Authorization Bearer header matching ADMIN_PASSWORD
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("techies_admin_session");
    const authHeader = req.headers.get("authorization");
    const expectedPassword = process.env.ADMIN_PASSWORD || "techiesadmin2026";

    const isAuthorized =
      sessionCookie?.value === "authenticated" ||
      authHeader === `Bearer ${expectedPassword}`;

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin authentication required." },
        { status: 401 }
      );
    }

    await initDb();
    await sql`
      DELETE FROM techpass_cards WHERE tech_id = ${id};
    `;

    return NextResponse.json({
      success: true,
      message: `TechPass card ${id} successfully deleted.`,
    });
  } catch (err: any) {
    console.error("DELETE /api/techpass/[id] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete TechPass card." },
      { status: 500 }
    );
  }
}
