/**
 * Vercel serverless function: list all papers from Cloudinary.
 * Set env in Vercel: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */

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

async function listResources(cloudName, apiKey, apiSecret, resourceType) {
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/${resourceType}/upload?max_results=500&context=true`;
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
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

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60",
      ...headers,
    },
  });
}

export async function GET() {
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const API_KEY = process.env.CLOUDINARY_API_KEY;
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;

  const missing = [
    !CLOUD_NAME && "CLOUDINARY_CLOUD_NAME",
    !API_KEY && "CLOUDINARY_API_KEY",
    !API_SECRET && "CLOUDINARY_API_SECRET",
  ].filter(Boolean);
  if (missing.length) {
    return jsonResponse(
      { error: "Cloudinary env not configured", missing },
      500
    );
  }

  try {
    const [images, raws] = await Promise.all([
      listResources(CLOUD_NAME, API_KEY, API_SECRET, "image"),
      listResources(CLOUD_NAME, API_KEY, API_SECRET, "raw"),
    ]);
    const papers = [...images, ...raws].filter(
      (p) => p.subjectCode && p.paperName
    );
    return jsonResponse({ papers });
  } catch (err) {
    return jsonResponse({ error: err.message || "Server error" }, 500);
  }
}
