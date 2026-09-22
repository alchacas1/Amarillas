import { describe, expect, it } from "vitest";

import nextConfig from "./next.config";

describe("Next security headers", () => {
  it("disables framework disclosure and returns baseline browser protections", async () => {
    expect(nextConfig.poweredByHeader).toBe(false);

    const headerRules = await nextConfig.headers!();
    const headers = new Map(headerRules[0].headers.map(({ key, value }) => [key, value]));

    expect(headers.get("X-Content-Type-Options")).toBe("nosniff");
    expect(headers.get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(headers.get("Permissions-Policy")).toContain("camera=()");
  });
});
