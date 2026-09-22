import { describe, expect, it } from "vitest";

import { siteMetadata } from "./siteMetadata";

describe("site metadata", () => {
  it("describes the Spanish flower experience", () => {
    expect(siteMetadata.title).toBe("Flores amarillas para ti");
    expect(siteMetadata.description).toContain("flores amarillas");
  });
});
