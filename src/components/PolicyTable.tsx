"use client";

import * as React from "react";
//@ts-expect-error: react-json-to-excel is not in the type
import { exportToExcel } from "react-json-to-excel";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Edit2,
  Link2,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import TableSkeleton from "./table-skeleton";
import { useQuery } from "convex/react";

export type Policy = {
  _id: Id<"policies">;
  _creationTime: number;
  date: string;
  registeredOwnerName: string;
  vehicleUsedOwnerName: string;
  policyEndDate: string;
  vehicleManufacturingYear: string;
  vehicleRegistrationNumber: string;
  customerMobileNumber: string;
  vehicleModel: string;
  anyVehicleWork: string;
  insuranceCompany: string;
  insuranceAgency: string;
  totalPremium: number;
  netPremium: number;
  idv: number;
  cmCollectAmount: number;
  paidAgency: number;
  agentPayout: number;
  netPayout: number;
  directCmorAgent: string;
  fileUrl: string;
  customerFileUrl: string;
  storageId: Id<"_storage"> | "";
  customerStorageId: Id<"_storage"> | "";
};

export const columns: ColumnDef<Policy>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const formatDate = new Date(row.original.date);
      const formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(formatDate);
      return formattedDate;
    },
  },
  {
    accessorKey: "registeredOwnerName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Registered Owner
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: "vehicleUsedOwnerName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vehicle Used Owner
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: "policyEndDate",
    header: "Policy End",
    cell: ({ row }) => {
      const formatDate = new Date(row.original.policyEndDate);
      const formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(formatDate);
      return formattedDate;
    },
  },
  {
    accessorKey: "vehicleManufacturingYear",
    header: "Vehicle Manufacturing Year",
  },
  {
    accessorKey: "vehicleRegistrationNumber",
    header: "Vehicle Registration Number",
  },
  {
    accessorKey: "customerMobileNumber",
    header: "Customer Mobile Number",
  },
  {
    accessorKey: "vehicleModel",
    header: "Vehicle Model",
  },
  {
    accessorKey: "anyVehicleWork",
    header: "Any Vehicle Work",
  },
  {
    accessorKey: "insuranceCompany",
    header: "Insurance Company",
  },
  {
    accessorKey: "insuranceAgency",
    header: "Insurance Agency",
  },
  {
    accessorKey: "totalPremium",
    header: "Total Premium (₹)",
  },
  {
    accessorKey: "netPremium",
    header: "Net Premium (₹)",
  },
  {
    accessorKey: "idv",
    header: "IDV",
  },
  {
    accessorKey: "cmCollectAmount",
    header: "CM Collect Amount (₹)",
  },
  {
    accessorKey: "paidAgency",
    header: "Paid Agency (₹)",
  },
  {
    accessorKey: "agentPayout",
    header: "Agent Payout (₹)",
  },
  {
    accessorKey: "netPayout",
    header: "Net Payout (₹)",
  },
  {
    accessorKey: "directCmorAgent",
    header: "Direct CMOR Agent",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const policy = row.original;
      const id = policy._id!;
      const fileUrl = policy.fileUrl!;
      const customerFileUrl = policy.customerFileUrl!;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Edit2 size={16} />
              <Link href={`/policy/${id}`} className="w-full">
                Edit Policy
              </Link>
            </DropdownMenuItem>
            {fileUrl && (
              <DropdownMenuItem>
                <Link2 size={16} />
                <Link href={fileUrl} target="_blank" className="w-full">
                  View Policy Documents
                </Link>
              </DropdownMenuItem>
            )}
            {customerFileUrl && (
              <DropdownMenuItem>
                <Link2 size={16} />
                <Link href={customerFileUrl} target="_blank" className="w-full">
                  View Customer Documents
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const PolicyTable = () => {
  const data = useQuery(api.policies.getPolicies);
  const [filter, setFilter] = React.useState<string>("registeredOwnerName");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    //@ts-expect-error: data may be undefined
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleDownload = () => {
    const excelData = data?.map((item) => {
      const formatDate = new Date(item.date);
      const formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(formatDate);

      const formatEndDate = new Date(item.date);
      const formattedEndDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(formatEndDate);
      return {
        Date: formattedDate,
        "Registered Owner": item.registeredOwnerName,
        "Vehicle Used Owner": item.vehicleUsedOwnerName,
        "Policy End Date": formattedEndDate,
        "Vehicle Manufacturing Year": item.vehicleManufacturingYear,
        "Vehicle Registration Number": item.vehicleRegistrationNumber,
        "Customer Mobile Number": item.customerMobileNumber,
        "Vehicle Model": item.vehicleModel,
        "Any Vehicle Work": item.anyVehicleWork,
        "Insurance Company": item.insuranceCompany,
        "Insurance Agency": item.insuranceAgency,
        "Total Premium": item.totalPremium,
        "Net Premium": item.netPremium,
        IDV: item.idv,
        "CM Collect Amount": item.cmCollectAmount,
        "Paid Agency": item.paidAgency,
        "Agent Payout": item.agentPayout,
        "Net Payout": item.netPayout,
        "Direct CMOR Agent": item.directCmorAgent,
      };
    });

    exportToExcel(excelData, "BackupFile");
  };

  if (data === undefined) {
    return (
      <div className="w-full flex items-center justify-center h-1/2">
        <TableSkeleton />
      </div>
    );
  }

  if (data.length == 0) {
    return (
      <div className="w-full flex items-center justify-center h-8 font-semibold">
        No Policies to show !
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 py-4">
        <Input
          placeholder={`Filter ${filter}...`}
          value={(table.getColumn(filter)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filter)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="">
              Filter By <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    onCheckedChange={() =>
                      filter == "registeredOwnerName"
                        ? setFilter(column.id)
                        : filter === column.id
                          ? setFilter("registeredOwnerName")
                          : setFilter(column.id)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s)
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="rounded-md p-2 bg-green-400 text-white text-sm font-semibold cursor-pointer"
      >
        Download
      </button>
    </div>
  );
};

export default PolicyTable;
