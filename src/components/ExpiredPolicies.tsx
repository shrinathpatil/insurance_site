"use client";
import { DatabaseId, PolicyCollectionId } from "@/constants";
import { databases } from "@/lib/appwrite";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Button } from "./ui/button";
import { ArrowUpDown, Link2, MoreHorizontal } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";

type ExpiredPolicy = {
  id: string;
  registeredOwnerName: string;
  vehicleUsedOwnerName: string;
  vehicleRegistrationNumber: string;
  customerMobileNumber: string;
  policyStartDate: string;
  policyEndDate: string;
  daysLeft: number;
  status: string;
};

const columns: ColumnDef<ExpiredPolicy>[] = [
  {
    accessorKey: "policyStartDate",
    header: "Policy Start Date",
    cell: ({ row }) => {
      let formatDate = new Date(row.original.policyStartDate);
      let formattedDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(formatDate);
      return formattedDate;
    },
  },
  {
    accessorKey: "policyEndDate",
    header: "Policy End Date",
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
    accessorKey: "vehicleRegistrationNumber",
    header: "Vehicle Registration Number",
  },
  {
    accessorKey: "customerMobileNumber",
    header: "Customer Mobile Number",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      if (row.original.status === "expired") {
        return (
          <span className="bg-red-100 font-semibold text-sm text-red-500 cursor-pointer py-1 px-2 rounded-md">
            Expired
          </span>
        );
      } else {
        let days = row.original.daysLeft;
        return (
          <span className="bg-yellow-100 font-semibold text-sm text-yellow-500 cursor-pointer py-1 px-2 rounded-md">
            {days} days left
          </span>
        );
      }
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const policy = row.original;
      const id = policy.id!;
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
              <Link2 size={16} />
              <Link href={`/policy/${id}`} className="w-full">
                view
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const ExpiredPolicies = () => {
  const [expiredPolicies, setExpiredPolicies] = useState<ExpiredPolicy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    const getExpiredPolicies = async () => {
      const result = await databases.listDocuments(
        DatabaseId,
        PolicyCollectionId
      );
      let policies = [];
      result.documents.forEach((policy) => {
        let today = new Date().toString();

        let sDate1 = new Date(policy.policyEndDate).toLocaleString(undefined, {
          timeZone: "Asia/Kolkata",
        });
        let sDate2 = new Date(today).toLocaleString(undefined, {
          timeZone: "Asia/Kolkata",
        });

        let date1 = new Date(sDate1);
        let date2 = new Date(sDate2);
        //@ts-ignore
        let diffTime = Math.floor((date1 - date2) / 86400000);

        if (diffTime <= 10) {
          policies.push({
            id: policy.$id,
            registeredOwnerName: policy.registeredOwnerName,
            vehicleUsedOwnerName: policy.vehicleUsedOwnerName,
            vehicleRegistrationNumber: policy.vehicleRegistrationNumber,
            customerMobileNumber: policy.customerMobileNumber,
            policyStartDate: policy.date,
            policyEndDate: policy.policyEndDate,
            daysLeft: diffTime,
            status: diffTime <= 0 ? "expired" : "near",
          });
        }
        //@ts-ignore
        setExpiredPolicies(policies);
        setLoading(false);
      });
    };
    getExpiredPolicies();
  }, []);

  const table = useReactTable({
    data: expiredPolicies,
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

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-8">
        <ClipLoader color="blue" size={28} />
      </div>
    );
  }

  if (expiredPolicies.length == 0) {
    return (
      <div className="w-full flex items-center justify-center h-8 font-semibold">
        No Policies near Expiry !
      </div>
    );
  }

  return (
    <div className="w-full">
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
    </div>
  );
};
export default ExpiredPolicies;
