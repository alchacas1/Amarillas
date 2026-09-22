import { act, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import PlantGrowthAnimation from "./PlantGrowthAnimation";

describe("PlantGrowthAnimation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("keeps the original timeline when the completion callback changes", () => {
    const firstCallback = vi.fn();
    const latestCallback = vi.fn();
    const { rerender } = render(
      <PlantGrowthAnimation onAnimationComplete={firstCallback} />,
    );

    act(() => vi.advanceTimersByTime(3000));
    rerender(<PlantGrowthAnimation onAnimationComplete={latestCallback} />);
    act(() => vi.advanceTimersByTime(4500));

    expect(firstCallback).not.toHaveBeenCalled();
    expect(latestCallback).toHaveBeenCalledTimes(1);
  });

  it("produces deterministic server-rendered stars", () => {
    const firstHtml = renderToString(
      <PlantGrowthAnimation onAnimationComplete={() => undefined} />,
    );
    const secondHtml = renderToString(
      <PlantGrowthAnimation onAnimationComplete={() => undefined} />,
    );

    expect(firstHtml).toBe(secondHtml);
  });

  it("lets the visitor skip the introduction", () => {
    const onComplete = vi.fn();
    render(<PlantGrowthAnimation onAnimationComplete={onComplete} />);

    fireEvent.click(screen.getByRole("button", { name: /saltar animación/i }));

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("skips the timed introduction when reduced motion is requested", () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true }));
    const onComplete = vi.fn();

    render(<PlantGrowthAnimation onAnimationComplete={onComplete} />);

    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
