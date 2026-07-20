import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || "";

// Singleton pattern for Postgres connection in Next.js Server environments
const globalForDb = globalThis as unknown as {
  sql: postgres.Sql | undefined;
};

export const sql =
  globalForDb.sql ??
  postgres(connectionString, {
    ssl: "require",
    prepare: false, // Essential for NeonDB serverless/pgbouncer compatibility
  });

if (process.env.NODE_ENV !== "production") globalForDb.sql = sql;

/**
 * Initializes the required table schema in NeonDB PostgreSQL.
 * Safe to run on startup or on first action query.
 */
export async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS techpass_cards (
        tech_id VARCHAR(50) PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        designation VARCHAR(255),
        college_company VARCHAR(255),
        expertise_tags TEXT[],
        instagram VARCHAR(255),
        linkedin VARCHAR(255),
        github VARCHAR(255),
        whatsapp VARCHAR(100),
        email VARCHAR(255),
        profile_photo TEXT,
        theme VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS scanned_connections (
        id VARCHAR(100) PRIMARY KEY,
        user_tech_id VARCHAR(50),
        contact_tech_id VARCHAR(50),
        name VARCHAR(255) NOT NULL,
        designation VARCHAR(255),
        organization VARCHAR(255),
        expertise TEXT[],
        whatsapp VARCHAR(100),
        instagram VARCHAR(255),
        linkedin VARCHAR(255),
        github VARCHAR(255),
        email VARCHAR(255),
        profile_photo TEXT,
        scanned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    return { success: true };
  } catch (err) {
    console.error("Failed to initialize NeonDB tables:", err);
    throw err;
  }
}
