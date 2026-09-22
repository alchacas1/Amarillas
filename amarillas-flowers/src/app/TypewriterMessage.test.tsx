import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TypewriterMessage } from "./page";

describe("TypewriterMessage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("stops its timer after revealing the complete message", () => {
    render(<TypewriterMessage />);

    act(() => vi.advanceTimersByTime(5000));

    expect(screen.getByRole("status")).toHaveTextContent(
      "Espero que estas flores iluminen tu día 🌼💛",
    );
    expect(vi.getTimerCount()).toBe(0);
  });
});
