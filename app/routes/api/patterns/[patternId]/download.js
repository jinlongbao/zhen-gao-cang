import { json } from "@remix-run/cloudflare";
import { requireUser } from "~/lib/session";
import { getPatternById, hasUserPurchasedPattern } from "~/lib/db";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function loader({ request, context, params }) {
  const { userId } = await requireUser(request);
  const { patternId } = params;

  const hasPurchased = await hasUserPurchasedPattern(context.env.DB, userId, patternId);
  if (!hasPurchased) {
    return json({ error: "Unauthorized" }, 403);
  }

  const pattern = await getPatternById(context.env.DB, patternId);
  if (!pattern) {
    return json({ error: "Pattern not found" }, 404);
  }

  const object = await context.env.R2_BUCKET.get(pattern.file_path);
  if (object === null) {
    return json({ error: "File not found in storage" }, 404);
  }

  const pdfBuffer = await object.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const firstPage = pdfDoc.getPages()[0];
  const { width, height } = firstPage.getSize();

  // Add watermark
  firstPage.drawText(`Purchased by user ID: ${userId}`, {
    x: 5,
    y: height - 15,
    size: 10,
    font: helveticaFont,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();

  return new Response(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${pattern.title}_watermarked.pdf"`,
    },
  });
}
