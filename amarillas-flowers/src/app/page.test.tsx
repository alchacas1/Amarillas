import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import Home from "./page";

describe("Home", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("removes the opaque introduction after it is skipped", () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: /saltar animación/i }));

    expect(screen.queryByRole("button", { name: /saltar animación/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reiniciar/i })).toBeInTheDocument();
  });

  it("offers a visible retry when the browser blocks music", async () => {
    vi.useFakeTimers();
    const play = vi.fn().mockRejectedValue(new Error("autoplay blocked"));
    vi.stubGlobal("Audio", class {
      volume = 1;
      currentTime = 0;
      play = play;
    });

    render(<Home />);
    fireEvent.click(screen.getByRole("button", { name: /saltar animación/i }));
    act(() => vi.advanceTimersByTime(1000));

    const labels = [
      "hola",
      "estas",
      "flores",
      "son para ti",
      "no te puedo dar físicas",
      "pero te puedo dar estas",
    ];

    labels.forEach((label, index) => {
      fireEvent.click(screen.getByRole("button", { name: label }));
      if (index < labels.length - 1) {
        act(() => vi.advanceTimersByTime(800));
      }
    });
    await act(async () => Promise.resolve());

    expect(play).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /reproducir música/i })).toBeInTheDocument();
  });
});
