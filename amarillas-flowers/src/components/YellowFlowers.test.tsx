import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import YellowFlowers from "./YellowFlowers";

describe("YellowFlowers", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 320 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 568 });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders every draggable flower as a keyboard-accessible control", () => {
    render(<YellowFlowers startFlowerRain />);
    act(() => vi.runAllTimers());

    const controls = screen.getAllByRole("button", { name: /mover flor amarilla/i });
    expect(controls.length).toBeGreaterThanOrEqual(40);
  });

  it("keeps a flower added at the edge fully inside the viewport", () => {
    render(<YellowFlowers startFlowerRain />);
    act(() => vi.runAllTimers());
    const originalControls = screen.getAllByRole("button", { name: /mover flor amarilla/i });
    const flowerLayer = originalControls[0].parentElement;

    fireEvent.click(flowerLayer!, { clientX: 0, clientY: 0 });
    act(() => vi.advanceTimersByTime(20));

    const controls = screen.getAllByRole("button", { name: /mover flor amarilla/i });
    const addedFlower = controls.at(-1)!;
    expect(Number.parseFloat(addedFlower.style.left)).toBeGreaterThanOrEqual(30);
    expect(Number.parseFloat(addedFlower.style.top)).toBeGreaterThanOrEqual(30);
  });

  it("completes the rain even when the visitor adds another flower", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const onRainComplete = vi.fn();
    render(<YellowFlowers startFlowerRain onRainComplete={onRainComplete} />);
    act(() => vi.advanceTimersByTime(1));
    const flowerLayer = screen.getAllByRole("button", { name: /mover flor amarilla/i })[0].parentElement;

    fireEvent.click(flowerLayer!, { clientX: 100, clientY: 100 });
    act(() => vi.advanceTimersByTime(2000));

    expect(onRainComplete).toHaveBeenCalledTimes(1);
  });

  it("limits visitor-created flowers to avoid unbounded growth", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(<YellowFlowers startFlowerRain />);
    act(() => vi.runAllTimers());

    const initialFlowers = screen.getAllByRole("button", { name: /mover flor amarilla/i });
    const flowerLayer = initialFlowers[0].parentElement!;

    for (let index = 0; index < 25; index += 1) {
      fireEvent.click(flowerLayer, { clientX: 100, clientY: 100 });
      act(() => vi.advanceTimersByTime(20));
    }

    expect(screen.getAllByRole("button", { name: /mover flor amarilla/i })).toHaveLength(
      initialFlowers.length + 20,
    );
  });
});
