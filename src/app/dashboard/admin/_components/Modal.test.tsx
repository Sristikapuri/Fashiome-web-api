import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "./Modal";

const onCloseMock = vi.fn();

beforeEach(() => {
  onCloseMock.mockClear();
});

describe("Modal", () => {
  test("renders nothing when closed", () => {
    const { container } = render(
      <Modal open={false} onClose={onCloseMock} title="Delete item">
        <p>content</p>
      </Modal>
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("renders the title and children when open", () => {
    render(
      <Modal open onClose={onCloseMock} title="Delete clothes item">
        <p>Are you sure?</p>
      </Modal>
    );

    const dialog = screen.getByRole("dialog", { name: "Delete clothes item" });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  test("clicking the backdrop calls onClose", async () => {
    const user = userEvent.setup();
    render(
      <Modal open onClose={onCloseMock} title="Delete item">
        <p>content</p>
      </Modal>
    );

    await user.click(screen.getByRole("dialog").parentElement!);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("clicking inside the dialog content does not call onClose", async () => {
    const user = userEvent.setup();
    render(
      <Modal open onClose={onCloseMock} title="Delete item">
        <p>content</p>
      </Modal>
    );

    await user.click(screen.getByRole("dialog"));
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  test("pressing Escape calls onClose", async () => {
    const user = userEvent.setup();
    render(
      <Modal open onClose={onCloseMock} title="Delete item">
        <p>content</p>
      </Modal>
    );

    await user.keyboard("{Escape}");
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
