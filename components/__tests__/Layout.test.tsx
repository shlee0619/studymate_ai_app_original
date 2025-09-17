import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Layout } from "../Layout";

describe("Layout", () => {
  it("calls onScreenChange when a navigation item is clicked", async () => {
    const handleScreenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Layout activeScreen="dashboard" onScreenChange={handleScreenChange}>
        <div>테스트 콘텐츠</div>
      </Layout>
    );

    expect(screen.getByText("테스트 콘텐츠")).toBeInTheDocument();

    const reviewButton = screen.getByRole("button", { name: "복습 화면으로 이동" });
    await user.click(reviewButton);

    expect(handleScreenChange).toHaveBeenCalledWith("review");
  });
});
