/**
 * What the offer page's "Upload a file" button accepts. Shared by the page,
 * which checks before sending anything, and /api/submit-jd/extract, which
 * checks again. The app's extract endpoint enforces the same rules.
 */

// Read in the browser: their text is already the text, so no request is made.
export const TEXT_EXTENSIONS = ["txt", "md", "markdown"] as const;
// Sent to the app to be read by the parser its own "Upload New" button uses.
// No legacy .doc: that parser cannot open it, so accepting it would only
// fail after the upload.
export const PARSED_EXTENSIONS = ["pdf", "docx"] as const;

export const ACCEPT = [...PARSED_EXTENSIONS, ...TEXT_EXTENSIONS].map((ext) => `.${ext}`).join(",");

// A JD is a page or two; a 5 MB one is almost certainly not a JD.
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export function extensionOf(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot === -1 ? "" : filename.slice(dot + 1).toLowerCase();
}

export function isTextFile(filename: string): boolean {
  return (TEXT_EXTENSIONS as readonly string[]).includes(extensionOf(filename));
}

export function isParsedFile(filename: string): boolean {
  return (PARSED_EXTENSIONS as readonly string[]).includes(extensionOf(filename));
}

export const UNSUPPORTED_FILE = "Upload a PDF, Word (.docx) or text file.";
export const FILE_TOO_LARGE = "That file is too large. The limit is 5 MB.";
