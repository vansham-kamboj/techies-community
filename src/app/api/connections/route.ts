import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sql, initDb } from "@/lib/db";
import { ConnectionRecord } from "@/components/connections/ConnectionsExportImport";

/**
 * GET /api/connections
 * Retrieves scanned connections from NeonDB.
 * Optional ?userId=TECH-XXXX to filter by user who scanned, or ?search=
 */
export async function GET(req: NextRequest) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const search = searchParams.get("search");

    let rows;
    if (userId && search) {
      const q = `%${search.trim()}%`;
      rows = await sql`
        SELECT * FROM scanned_connections
        WHERE user_tech_id = ${userId}
          AND (name ILIKE ${q} OR organization ILIKE ${q} OR designation ILIKE ${q} OR contact_tech_id ILIKE ${q})
        ORDER BY scanned_at DESC;
      `;
    } else if (userId) {
      rows = await sql`
        SELECT * FROM scanned_connections
        WHERE user_tech_id = ${userId}
        ORDER BY scanned_at DESC;
      `;
    } else if (search) {
      const q = `%${search.trim()}%`;
      rows = await sql`
        SELECT * FROM scanned_connections
        WHERE name ILIKE ${q} OR organization ILIKE ${q} OR designation ILIKE ${q} OR contact_tech_id ILIKE ${q}
        ORDER BY scanned_at DESC;
      `;
    } else {
      rows = await sql`
        SELECT * FROM scanned_connections
        ORDER BY scanned_at DESC
        LIMIT 500;
      `;
    }

    const serialized = rows.map((row) => ({
      id: row.id,
      techpassId: row.contact_tech_id || "",
      userTechId: row.user_tech_id || "",
      name: row.name || "",
      designation: row.designation || "",
      organization: row.organization || "",
      expertise: row.expertise || [],
      whatsapp: row.whatsapp || "",
      instagram: row.instagram || "",
      linkedin: row.linkedin || "",
      github: row.github || "",
      email: row.email || "",
      profilePhoto: row.profile_photo || "",
      scannedAt: row.scanned_at ? new Date(row.scanned_at).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      count: serialized.length,
      data: serialized,
    });
  } catch (err: any) {
    console.error("GET /api/connections error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve scanned connections." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/connections
 * Upserts one or multiple connection records into scanned_connections.
 * Payload can be a single ConnectionRecord or { userId?: string, records: ConnectionRecord[] }
 */
export async function POST(req: NextRequest) {
  try {
    await initDb();
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    const userId = body.userId || body.user_tech_id || "TECH-ANON";
    const records: ConnectionRecord[] = Array.isArray(body.records)
      ? body.records
      : Array.isArray(body)
      ? body
      : [body];

    if (records.length === 0) {
      return NextResponse.json(
        { success: false, error: "No connection records provided." },
        { status: 400 }
      );
    }

    let syncedCount = 0;
    for (const rec of records) {
      if (!rec || !rec.name) continue;
      const recId = rec.id || `${userId}-${rec.techpassId || Date.now()}`;
      const contactId = rec.techpassId || rec.id || "";
      const name = rec.name;
      const designation = rec.designation || "";
      const org = rec.organization || "";
      const expertise = Array.isArray(rec.expertise) ? rec.expertise : [];
      const whatsapp = rec.whatsapp || "";
      const instagram = rec.instagram || "";
      const linkedin = rec.linkedin || "";
      const github = rec.github || "";
      const email = rec.email || "";
      const profilePhoto = rec.profilePhoto || "";

      await sql`
        INSERT INTO scanned_connections (
          id,
          user_tech_id,
          contact_tech_id,
          name,
          designation,
          organization,
          expertise,
          whatsapp,
          instagram,
          linkedin,
          github,
          email,
          profile_photo,
          scanned_at
        )
        VALUES (
          ${recId},
          ${userId},
          ${contactId},
          ${name},
          ${designation},
          ${org},
          ${expertise},
          ${whatsapp},
          ${instagram},
          ${linkedin},
          ${github},
          ${email},
          ${profilePhoto},
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          designation = EXCLUDED.designation,
          organization = EXCLUDED.organization,
          expertise = EXCLUDED.expertise,
          whatsapp = EXCLUDED.whatsapp,
          instagram = EXCLUDED.instagram,
          linkedin = EXCLUDED.linkedin,
          github = EXCLUDED.github,
          email = EXCLUDED.email,
          profile_photo = EXCLUDED.profile_photo,
          scanned_at = CURRENT_TIMESTAMP;
      `;
      syncedCount++;
    }

    return NextResponse.json(
      { success: true, message: `Successfully synced ${syncedCount} connection(s).`, syncedCount },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /api/connections error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to sync connections to database." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/connections
 * Deletes a scanned connection by ?id=XXX.
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id parameter." },
        { status: 400 }
      );
    }

    await initDb();
    await sql`
      DELETE FROM scanned_connections WHERE id = ${id};
    `;

    return NextResponse.json({
      success: true,
      message: `Connection ${id} deleted successfully.`,
    });
  } catch (err: any) {
    console.error("DELETE /api/connections error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete connection." },
      { status: 500 }
    );
  }
}
