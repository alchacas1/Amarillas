import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import FallingPetalsBackground from "./FallingPetalsBackground";

describe("FallingPetalsBackground", () => {
  it("animates petals without a React render loop", () => {
    const requestAnimationFrameSpy = vi.spyOn(window, "requestAnimationFrame");

    render(<FallingPetalsBackground />);

    expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
  });
});
