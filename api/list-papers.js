/**
 * Vercel serverless function: list all papers from Cloudinary.
 * Set env: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

function parseContext(context) {
  if (!context || typeof context !== "object") return {};
  const custom = context.custom || context;
  const get = (key) => {
    const v = custom[key];
    if (typeof v !== "string") return v || "";
    try {
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  };
  return {
    subjectCode: get("subjectCode"),
    subjectName: get("subjectName"),
    paperType: get("paperType"),
    paperName: get("paperName"),
  };
}

async function listResources(resourceType) {
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/${resourceType}/upload?max_results=500&context=true`;
  const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");
  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!res.ok) throw new Error(`Cloudinary API error: ${res.status}`);
  const data = await res.json();
  return (data.resources || []).map((r) => ({
    id: r.public_id,
    secure_url: r.secure_url,
    format: r.format,
    resource_type: resourceType,
    ...parseContext(r.context || {}),
  }));
}

export default async function handler(req, res) {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    return res.status(500).json({ error: "Cloudinary env not configured" });
  }
  try {
    const [images, raws] = await Promise.all([
      listResources("image"),
      listResources("raw"),
    ]);
    const papers = [...images, ...raws].filter((p) => p.subjectCode && p.paperName);
    res.setHeader("Cache-Control", "public, max-age=60");
    return res.status(200).json({ papers });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
