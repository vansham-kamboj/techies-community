"use server";

import { cookies } from "next/headers";
import { sql, initDb } from "@/lib/db";
import { TechPassData } from "@/components/techpass/TechPassCard";
import { ConnectionRecord } from "@/components/connections/ConnectionsExportImport";

export interface DbTechPassCard {
  tech_id: string;
  full_name: string;
  designation: string;
  college_company: string;
  expertise_tags: string[];
  instagram: string;
  linkedin: string;
  github: string;
  whatsapp: string;
  email: string;
  profile_photo: string;
  theme: string;
  created_at: string;
  updated_at: string;
}

/**
 * Upserts a TechPass card into NeonDB.
 */
export async function upsertTechPassCard(data: TechPassData, theme: string = "aurora-violet") {
  try {
    await initDb();

    const techId = data.techId || `TECH-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullName = data.fullName || "Anonymous Techie";
    const designation = data.designation || "";
    const collegeCompany = data.collegeCompany || "";
    const expertiseTags = data.expertiseTags || [];
    const instagram = data.instagram || "";
    const linkedin = data.linkedin || "";
    const github = data.github || "";
    const whatsapp = data.whatsapp || "";
    const email = data.email || "";
    const profilePhoto = data.profilePhoto || "";

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

    return { success: true, techId };
  } catch (err) {
    console.error("Error upserting TechPass card into NeonDB:", err);
    return { success: false, error: "Failed to sync card to cloud database." };
  }
}

/**
 * Retrieves all registered TechPass cards from NeonDB with optional search query.
 */
export async function getTechPassCards(searchQuery?: string): Promise<{
  success: boolean;
  cards: DbTechPassCard[];
  error?: string;
}> {
  try {
    await initDb();

    let rows;
    if (searchQuery && searchQuery.trim() !== "") {
      const q = `%${searchQuery.trim()}%`;
      rows = await sql<DbTechPassCard[]>`
        SELECT * FROM techpass_cards
        WHERE full_name ILIKE ${q}
           OR tech_id ILIKE ${q}
           OR college_company ILIKE ${q}
           OR designation ILIKE ${q}
        ORDER BY created_at DESC;
      `;
    } else {
      rows = await sql<DbTechPassCard[]>`
        SELECT * FROM techpass_cards
        ORDER BY created_at DESC;
      `;
    }

    // Convert Date objects to strings for clean serialization
    const serialized = rows.map((row) => ({
      ...row,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updated_at: row.updated_at ? new Date(row.updated_at).toISOString() : new Date().toISOString(),
    }));

    return { success: true, cards: serialized };
  } catch (err) {
    console.error("Error fetching cards from NeonDB:", err);
    return { success: false, cards: [], error: "Failed to retrieve cards from database." };
  }
}

/**
 * Checks if the current request session has valid admin authentication.
 */
export async function checkAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("techies_admin_session");
    return sessionCookie?.value === "authenticated";
  } catch {
    return false;
  }
}

/**
 * Authenticates admin access.
 */
export async function adminLogin(password: string): Promise<{ success: boolean; error?: string }> {
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
    return { success: true };
  } else {
    return { success: false, error: "Invalid admin password. Access denied." };
  }
}

/**
 * Logs out the administrator.
 */
export async function adminLogout(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  cookieStore.delete("techies_admin_session");
  return { success: true };
}

/**
 * Deletes a specific TechPass card record from NeonDB.
 */
export async function deleteTechPassCard(techId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const isAdmin = await checkAdminSession();
    if (!isAdmin) {
      return { success: false, error: "Unauthorized access." };
    }

    await sql`
      DELETE FROM techpass_cards WHERE tech_id = ${techId};
    `;
    return { success: true };
  } catch (err) {
    console.error("Error deleting TechPass card:", err);
    return { success: false, error: "Failed to delete card record." };
  }
}

/**
 * Upserts scanned or imported connection records into NeonDB PostgreSQL.
 */
export async function upsertScannedConnections(
  records: ConnectionRecord[],
  userTechId: string = "TECH-ANON"
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    if (!records || records.length === 0) return { success: true, count: 0 };
    await initDb();

    let synced = 0;
    for (const rec of records) {
      if (!rec || !rec.name) continue;
      const recId = rec.id || `${userTechId}-${rec.techpassId || Date.now()}`;
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
          ${userTechId},
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
      synced++;
    }

    return { success: true, count: synced };
  } catch (err: any) {
    console.error("Error upserting scanned connections to NeonDB:", err);
    return { success: false, error: "Failed to sync connections to database." };
  }
}

/**
 * Retrieves scanned connections from NeonDB.
 */
export async function getScannedConnections(searchQuery?: string, userId?: string): Promise<{
  success: boolean;
  connections: ConnectionRecord[];
  error?: string;
}> {
  try {
    await initDb();

    let rows;
    if (searchQuery && searchQuery.trim() !== "") {
      const q = `%${searchQuery.trim()}%`;
      if (userId) {
        rows = await sql`
          SELECT * FROM scanned_connections
          WHERE user_tech_id = ${userId}
            AND (name ILIKE ${q} OR organization ILIKE ${q} OR designation ILIKE ${q} OR contact_tech_id ILIKE ${q})
          ORDER BY scanned_at DESC;
        `;
      } else {
        rows = await sql`
          SELECT * FROM scanned_connections
          WHERE name ILIKE ${q} OR organization ILIKE ${q} OR designation ILIKE ${q} OR contact_tech_id ILIKE ${q}
          ORDER BY scanned_at DESC;
        `;
      }
    } else if (userId) {
      rows = await sql`
        SELECT * FROM scanned_connections
        WHERE user_tech_id = ${userId}
        ORDER BY scanned_at DESC;
      `;
    } else {
      rows = await sql`
        SELECT * FROM scanned_connections
        ORDER BY scanned_at DESC
        LIMIT 500;
      `;
    }

    const serialized: ConnectionRecord[] = rows.map((row) => ({
      id: row.id,
      techpassId: row.contact_tech_id || "",
      userTechId: row.user_tech_id || "TECH-ANON",
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

    return { success: true, connections: serialized };
  } catch (err: any) {
    console.error("Error fetching scanned connections:", err);
    return { success: false, connections: [], error: "Failed to load connections from database." };
  }
}

/**
 * Deletes a scanned connection record from NeonDB.
 */
export async function deleteScannedConnection(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await initDb();
    await sql`
      DELETE FROM scanned_connections WHERE id = ${id};
    `;
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting connection from NeonDB:", err);
    return { success: false, error: "Failed to delete connection record." };
  }
}
