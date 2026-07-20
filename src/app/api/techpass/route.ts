import { NextRequest, NextResponse } from "next/server";
import { sql, initDb } from "@/lib/db";
import { DbTechPassCard } from "@/app/actions/techpass";

/**
 * GET /api/techpass
 * Retrieves registered TechPass cards from NeonDB with optional ?search= parameter.
 */
export async function GET(req: NextRequest) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const limitParam = searchParams.get("limit");
    const limit = limitParam && !isNaN(Number(limitParam)) ? Number(limitParam) : 100;

    let rows;
    if (search && search.trim() !== "") {
      const q = `%${search.trim()}%`;
      rows = await sql<DbTechPassCard[]>`
        SELECT * FROM techpass_cards
        WHERE full_name ILIKE ${q}
           OR tech_id ILIKE ${q}
           OR college_company ILIKE ${q}
           OR designation ILIKE ${q}
        ORDER BY created_at DESC
        LIMIT ${limit};
      `;
    } else {
      rows = await sql<DbTechPassCard[]>`
        SELECT * FROM techpass_cards
        ORDER BY created_at DESC
        LIMIT ${limit};
      `;
    }

    const serialized = rows.map((row) => ({
      ...row,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      count: serialized.length,
      data: serialized,
    });
  } catch (err: any) {
    console.error("GET /api/techpass error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch TechPass records from database." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/techpass
 * Upserts a TechPass card from a JSON request body.
 */
export async function POST(req: NextRequest) {
  try {
    await initDb();
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request payload." },
        { status: 400 }
      );
    }

    const techId = body.techId || body.tech_id || `TECH-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullName = body.fullName || body.full_name || "Anonymous Techie";
    const designation = body.designation || "";
    const collegeCompany = body.collegeCompany || body.college_company || "";
    const expertiseTags = Array.isArray(body.expertiseTags || body.expertise_tags)
      ? (body.expertiseTags || body.expertise_tags)
      : [];
    const instagram = body.instagram || "";
    const linkedin = body.linkedin || "";
    const github = body.github || "";
    const whatsapp = body.whatsapp || "";
    const email = body.email || "";
    const profilePhoto = body.profilePhoto || body.profile_photo || "";
    const theme = body.theme || "aurora-violet";

    await sql`
      INSERT INTO techpass_cards (
        tech_id,
        full_name,
        designation,
        college_company,
        expertise_tags,
        instagram,
        linkedin,
        github,
        whatsapp,
        email,
        profile_photo,
        theme,
        updated_at
      )
      VALUES (
        ${techId},
        ${fullName},
        ${designation},
        ${collegeCompany},
        ${expertiseTags},
        ${instagram},
        ${linkedin},
        ${github},
        ${whatsapp},
        ${email},
        ${profilePhoto},
        ${theme},
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (tech_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        designation = EXCLUDED.designation,
        college_company = EXCLUDED.college_company,
        expertise_tags = EXCLUDED.expertise_tags,
        instagram = EXCLUDED.instagram,
        linkedin = EXCLUDED.linkedin,
        github = EXCLUDED.github,
        whatsapp = EXCLUDED.whatsapp,
        email = EXCLUDED.email,
        profile_photo = EXCLUDED.profile_photo,
        theme = EXCLUDED.theme,
        updated_at = CURRENT_TIMESTAMP;
    `;

    return NextResponse.json(
      { success: true, message: "TechPass card synced successfully.", techId },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /api/techpass error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save TechPass card to cloud database." },
      { status: 500 }
    );
  }
}
