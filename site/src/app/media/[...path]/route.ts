import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

function contentType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".mp4": return "video/mp4";
    case ".webm": return "video/webm";
    case ".webp": return "image/webp";
    case ".png": return "image/png";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    default: return "application/octet-stream";
  }
}

export async function GET(_req: Request, { params }: { params: { path: string[] } }) {
  const filePath = path.join(process.cwd(), "..", "media", ...(params.path || []));
  try {
    const buf = await fs.readFile(filePath);
    return new NextResponse(buf, {
      headers: {
        "content-type": contentType(filePath),
        "cache-control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
