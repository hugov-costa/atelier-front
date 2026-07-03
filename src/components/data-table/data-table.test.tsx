import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DataTable, DataTableColumn } from "@/components/data-table/data-table";

interface Row {
  id: string;
  name: string;
}

const columns: DataTableColumn<Row>[] = [
  {
    id: "name",
    header: "Name",
    cell: (row) => row.name,
    sortable: true,
    sortKey: "name",
  },
];

const rows: Row[] = [
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" },
];

describe("DataTable", () => {
  it("renders a row per item", () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(row) => row.id}
        emptyMessage="No users found"
      />,
    );

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("shows the empty message when there is no data", () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        getRowKey={(row) => row.id}
        emptyMessage="No users found"
      />,
    );

    expect(screen.getByText("No users found")).toBeInTheDocument();
  });

  it("does not render data rows while loading", () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        getRowKey={(row) => row.id}
        isLoading
        skeletonRowCount={3}
        emptyMessage="No users found"
      />,
    );

    expect(screen.queryByText("No users found")).not.toBeInTheDocument();
    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
  });

  it("invokes onSortChange with the column sort key when the header is clicked", () => {
    const onSortChange = vi.fn();

    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(row) => row.id}
        emptyMessage="No users found"
        sort={null}
        onSortChange={onSortChange}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /name/i }));

    expect(onSortChange).toHaveBeenCalledWith("name");
  });

  it("marks the active sorted column with aria-sort", () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(row) => row.id}
        emptyMessage="No users found"
        sort={{ key: "name", direction: "asc" }}
        onSortChange={() => {}}
      />,
    );

    expect(screen.getByRole("columnheader", { name: /name/i })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
  });

  it("does not render a sort button without an onSortChange handler", () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(row) => row.id}
        emptyMessage="No users found"
      />,
    );

    expect(
      screen.queryByRole("button", { name: /name/i }),
    ).not.toBeInTheDocument();
  });
});
