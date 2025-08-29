import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/**
 * Serve i file dalla cartella <repo>/media con supporto a richieste Range (seek).
 * Esempio: /media/chap-01.mp4 → <repo>/media/chap-01.mp4
 */
export const runtime = "nodejs";

function contentType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".webp":
      return "image/webp";
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    default:
      return "application/octet-stream";
  }
}

export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  const filePath = path.join(process.cwd(), "..", "media", ...(params.path || []));
  try {
    const stat = await fs.stat(filePath);
    const fileSize = stat.size;
    const range = req.headers.get("range");

    const headersBase: Record<string, string> = {
      "content-type": contentType(filePath),
      "accept-ranges": "bytes",
      "cache-control": "public, max-age=31536000, immutable",
    };

    // Nessuna Range: rispondiamo 200 intero (il browser può comunque chiedere Range dopo)
    if (!range) {
      const data = await fs.readFile(filePath);
      return new NextResponse(data, {
        status: 200,
        headers: {
          ...headersBase,
          "content-length": String(fileSize),
        },
      });
    }

    // Esempio Range: "bytes=START-END"
    const m = range.match(/bytes=(\d*)-(\d*)/);
    if (!m) {
      // Range malformata → 416
      return new NextResponse(null, {
        status: 416,
        headers: {
          ...headersBase,
          "content-range": `bytes */${fileSize}`,
        },
      });
    }

    let start = m[1] ? parseInt(m[1], 10) : 0;
    let end = m[2] ? parseInt(m[2], 10) : fileSize - 1;

    // Clamp su limiti validi
    if (isNaN(start) || start < 0) start = 0;
    if (isNaN(end) || end >= fileSize) end = fileSize - 1;
    if (end < start) end = start;

    const chunkSize = end - start + 1;
    const fd = await fs.open(filePath, "r");
    const buffer = Buffer.alloc(chunkSize);
    await fd.read(buffer, 0, chunkSize, start);
    await fd.close();

    return new NextResponse(buffer, {
      status: 206,
      headers: {
        ...headersBase,
        "content-length": String(chunkSize),
        "content-range": `bytes ${start}-${end}/${fileSize}`,
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
