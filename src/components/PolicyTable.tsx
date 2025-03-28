"use client";

import * as React from "react";
//@ts-ignore
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
  DropdownMenuSeparator,
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
import { databases, storage } from "@/lib/appwrite";
import { BucketId, DatabaseId, PolicyCollectionId } from "@/constants";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

export type Policy = {
  id?: string;
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
  fileId?: string;
};

export const columns: ColumnDef<Policy>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      let formatDate = new Date(row.original.date);
      let formattedDate = new Intl.DateTimeFormat("en-GB", {
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
      let formatDate = new Date(row.original.policyEndDate);
      let formattedDate = new Intl.DateTimeFormat("en-GB", {
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
      const id = policy.id!;
      const fileId = policy.fileId!;

      let url = "";
      if (fileId) {
        url = storage.getFileView(BucketId, fileId).href;
      }

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
                Edit
              </Link>
            </DropdownMenuItem>
            {url && (
              <DropdownMenuItem>
                <Link2 size={16} />
                <Link href={url} target="_blank" className="w-full">
                  View Documents
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
  const [data, setData] = React.useState<Policy[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [filter, setFilter] = React.useState<string>("registeredOwnerName");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    const fetchPolicy = async () => {
      const response = await databases.listDocuments(
        DatabaseId,
        PolicyCollectionId
      );
      const policies = response.documents.map((doc) => ({
        id: doc.$id,
        date: doc.date,
        registeredOwnerName: doc.registeredOwnerName,
        vehicleUsedOwnerName: doc.vehicleUsedOwnerName,
        policyEndDate: doc.policyEndDate,
        vehicleManufacturingYear: doc.vehicleManufacturingYear,
        vehicleRegistrationNumber: doc.vehicleRegistrationNumber,
        customerMobileNumber: doc.customerMobileNumber,
        vehicleModel: doc.vehicleModel,
        anyVehicleWork: doc.anyVehicleWork,
        insuranceCompany: doc.insuranceCompany,
        insuranceAgency: doc.insuranceAgency,
        totalPremium: doc.totalPremium,
        netPremium: doc.netPremium,
        idv: doc.idv,
        cmCollectAmount: doc.cmCollectAmount,
        paidAgency: doc.paidAgency,
        agentPayout: doc.agentPayout,
        netPayout: doc.netPayout,
        directCmorAgent: doc.directCmorAgent,
        fileId: doc.fileId,
      }));
      setData(policies);
      setLoading(false);
    };
    fetchPolicy();
  }, []);

  const table = useReactTable({
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
    const excelData = data.map((item) => {
      let formatDate = new Date(item.date);
      let formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(formatDate);

      let formatEndDate = new Date(item.date);
      let formattedEndDate = new Intl.DateTimeFormat("en-GB", {
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

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-8">
        <ClipLoader color="blue" size={28} />
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
                    onCheckedChange={(value) => {
                      filter == "registeredOwnerName"
                        ? setFilter(column.id)
                        : filter === column.id
                        ? setFilter("registeredOwnerName")
                        : setFilter(column.id);
                    }}
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
