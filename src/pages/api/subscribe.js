import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, newsletters } = req.body;

    try {
      await pool.query(
        `INSERT INTO users (name, email, newsletters)
         VALUES ($1, $2, $3)
         ON CONFLICT (email) DO UPDATE
         SET newsletters = EXCLUDED.newsletters`,
        [name, email, newsletters]
      );

      res.status(200).json({ success: true });
    } catch (err) {
      console.error("DB Error:", err);
      res.status(500).json({ error: "Database insert failed" });
    }
  } else {
    res.status(405).end(); // method not allowed
  }
}
