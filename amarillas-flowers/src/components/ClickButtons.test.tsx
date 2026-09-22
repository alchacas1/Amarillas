import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ClickButtons from "./ClickButtons";

describe("ClickButtons", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("animates click particles without a React render loop", () => {
    const requestAnimationFrameSpy = vi.spyOn(window, "requestAnimationFrame");
    render(
      <ClickButtons
        onButtonClick={() => undefined}
        onMusicStart={() => undefined}
      />,
    );
    act(() => vi.advanceTimersByTime(1000));

    fireEvent.click(screen.getByRole("button", { name: "hola" }));

    expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
  });

  it("requests music during the final user interaction", () => {
    const onMusicStart = vi.fn();
    render(
      <ClickButtons
        onButtonClick={() => undefined}
        onMusicStart={onMusicStart}
      />,
    );
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

    expect(onMusicStart).toHaveBeenCalledTimes(1);
  });
});
