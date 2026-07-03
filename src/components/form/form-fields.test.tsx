import { zodResolver } from "@hookform/resolvers/zod";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { Form } from "@/components/form/form";
import { FormInput } from "@/components/form/form-fields";

const schema = z.object({ email: z.string().email("Invalid email") });
type Values = z.infer<typeof schema>;

function Harness({ onSubmit }: { onSubmit: (values: Values) => void }) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormInput name="email" label="Email" />
      <button type="submit">Submit</button>
    </Form>
  );
}

describe("FormInput", () => {
  it("binds the label to the input", () => {
    render(<Harness onSubmit={() => {}} />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows a validation error and blocks submission on invalid input", async () => {
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText("Invalid email")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits the parsed values when the input is valid", async () => {
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        { email: "user@example.com" },
        expect.anything(),
      ),
    );
  });
});
