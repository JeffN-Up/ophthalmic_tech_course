import type { NextFunction, Request, Response } from "express";

export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(self)",
  "Cross-Origin-Opener-Policy": "same-origin",
} as const;

const previewFriendlyAssetPrefixes = ["/course-assets/"] as const;

export function applySecurityHeaders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  Object.entries(securityHeaders).forEach(([headerName, headerValue]) => {
    if (
      headerName === "X-Frame-Options" &&
      previewFriendlyAssetPrefixes.some(prefix => req.path.startsWith(prefix))
    ) {
      return;
    }

    res.setHeader(headerName, headerValue);
  });

  next();
}
