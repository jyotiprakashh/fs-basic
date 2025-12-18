"use client";

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
  Row, // Import Row type
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react"; // Removed useEffect as useMediaQuery handles its own
import { Plus, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, SortAsc, SortDesc, ArrowUp, ArrowDown, ArrowUpDown, ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useMediaQuery } from "@/hooks/use-media-query";

// Extend TableMeta (same as before)
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends unknown, TValue> {
    mobileHeader?: string;
    isNumeric?: boolean;
    mobileHidden?: boolean; // New meta to explicitly hide a column in mobile card view
    enableColumnFilter?: boolean;
  }
}

export interface FilterTab {
  id: string;
  label: string;
  filterFn?: (row: any) => boolean;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumnId?: string;
  searchPlaceholder?: string;
  showGlobalFilter?: boolean;
  showAddButton?: boolean;
  addButtonText?: string;
  onAddButtonClick?: () => void;
  showFilterTabs?: boolean;
  onRowClick?: (row: TData) => void;
  rowClassName?: string;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  showPagination?: boolean;
  mobileBreakpoint?: "sm" | "md" | "lg" | "xl" | "2xl";
  noResultsMessage?: string;
  tableId?: string;
  filterTabs?: FilterTab[];
  defaultFilterTab?: string;
  onFilterChange?: (filterId: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumnId = "title",
  searchPlaceholder = "Search...",
  showGlobalFilter = true,
  showAddButton = true,
  addButtonText = "Add New",
  onAddButtonClick,
  showFilterTabs = false,
  onRowClick,
  rowClassName = "",
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  showPagination = true,
  mobileBreakpoint = "md",
  noResultsMessage = "No results found.",
  tableId = "data-table",
  filterTabs = [],
  defaultFilterTab = '',
  onFilterChange
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [activeFilter, setActiveFilter] = useState<string>(defaultFilterTab);

  const isMobileView = useMediaQuery(mobileBreakpoint);

  // Apply filter if active
  const filteredData = useMemo(() => {
    if (!activeFilter || !filterTabs.length) return data;
    const activeTab = filterTabs.find(tab => tab.id === activeFilter);
    return activeTab?.filterFn ? data.filter(activeTab.filterFn) : data;
  }, [data, activeFilter, filterTabs]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: searchColumnId
      ? (row, columnId, filterValue) => {
        const value = row.getValue(searchColumnId);
        return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
      }
      : undefined,
  });

  const searchColumnExists = searchColumnId ? table.getColumn(searchColumnId) : true;

  // Helper function to get header string for mobile cards
  const getMobileHeader = (column: any): string => {
    const meta = column.columnDef.meta as any;
    if (meta?.mobileHeader) return meta.mobileHeader;
    if (typeof column.columnDef.header === 'string') return column.columnDef.header;
    return column.id;
  };

  const renderDesktopTable = () => (
    <ScrollArea className="w-full rounded-md">
      <Table className="min-w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={`text-sm px-4 font-medium ${(header.column.columnDef.meta as any)?.isNumeric ? 'text-right' : 'text-left'}`}
                >
                  <div className="flex items-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    {header.column.columnDef.enableColumnFilter &&
                      <div className="ml-2">
                        {header.column.getIsSorted() === "asc" ? (
                          <ArrowDownUp className="cursor-pointer" width={16} height={16} onClick={() => header.column.toggleSorting(true)} />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ArrowUpDown className="cursor-pointer" width={16} height={16} onClick={() => header.column.toggleSorting(false)} />
                        ) : (
                          <ArrowUpDown className="cursor-pointer" width={16} height={16} onClick={() => header.column.toggleSorting(true)} />
                        )}
                      </div>
                    }
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => onRowClick?.(row.original)}
                className={`${onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''} ${rowClassName}`}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`py-2 px-4 text-sm whitespace-nowrap ${(cell.column.columnDef.meta as any)?.isNumeric ? 'text-right' : 'text-left'}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {noResultsMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );

  const renderMobileCardView = () => (
    <div className="">
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row: Row<TData>) => (
          <div
            key={row.id}
            className={`border-b bg-card text-card-foreground shadow-sm p-4 space-y-2 ${onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''} ${rowClassName}`}
            onClick={() => onRowClick?.(row.original)}
          >
            {row.getVisibleCells().map((cell) => {
              const columnMeta = cell.column.columnDef.meta as any;
              if (columnMeta?.mobileHidden) return null; // Skip rendering if mobileHidden is true

              const headerText = getMobileHeader(cell.column);
              // For "actions" or "select" columns, we might not want a label, or a different layout.
              // This is a simple example; you might want more complex logic for specific columns.
              const isActionOrSelect = cell.column.id === 'actions' || cell.column.id === 'select';

              return (
                <div key={cell.id} className={`flex ${isActionOrSelect ? 'justify-end' : 'justify-between items-start'} text-sm`}>
                  {!isActionOrSelect && (
                    <strong className="text-muted-foreground mr-2 w-1/3 flex-shrink-0">{headerText}:</strong>
                  )}
                  <div className={`flex-grow ${columnMeta?.isNumeric ? 'text-right' : (isActionOrSelect ? 'text-right' : 'text-left')}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </div>
              );
            })}
          </div>
        ))
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          {noResultsMessage}
        </div>
      )}
    </div>
  );


  return (
    <div className="w-full space-y-4">

      {/* Top Controls: Search and Add Button (common for both views) */}
      {(showGlobalFilter || showAddButton || showFilterTabs) && (
        <div className={`flex flex-col sm:flex-row items-stretch sm:items-center w-full gap-3 ${showFilterTabs ? 'justify-between' : 'justify-end'}`}>
          {/* Filter Tabs */}
          {showFilterTabs && filterTabs.length > 0 && (
            <div className="relative w-full sm:w-auto">
              <div 
                className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/30"
                style={{
                  scrollSnapType: 'x mandatory',
                  scrollPadding: '0 16px',
                  WebkitOverflowScrolling: 'touch',
                  scrollbarGutter: 'stable',
                }}
              >
                {filterTabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeFilter === tab.id ? 'default' : 'ghost'}
                    onClick={() => {
                      setActiveFilter(tab.id);
                      onFilterChange?.(tab.id);
                    }}
                    className={`whitespace-nowrap flex-shrink-0 scroll-ml-2 transition-colors duration-200 rounded-full`}
                    style={{
                      scrollSnapAlign: 'start',
                      scrollMargin: '0 8px',
                    }}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center sm:flex-row flex-col gap-3 w-full sm:w-auto">
            {showGlobalFilter && searchColumnExists && (
            <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id={`${tableId}-search`}
                  className="pl-10 w-full"
                  placeholder={searchColumnId ? `Search ${searchColumnId}...` : searchPlaceholder}
                  value={globalFilter ?? ""}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                />
              </div>
            )}
            {showAddButton && onAddButtonClick && (
            <Button onClick={onAddButtonClick} className="h-9 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                {addButtonText}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Conditional rendering for Table or Cards */}
      {isMobileView ? renderMobileCardView() : renderDesktopTable()}

      {/* Pagination Controls (common for both views) */}
      {showPagination && table.getPageCount() > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 text-sm text-muted-foreground">
          <div className="flex-1 whitespace-nowrap hidden sm:block">
            {Object.keys(rowSelection).length > 0 ? (
              <>
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </>
            ) : (
              <>
                Showing {table.getRowModel().rows.length > 0 ? (table.getState().pagination.pageIndex * table.getState().pagination.pageSize) + 1 : 0}
                -
                {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}{" "}
                of {table.getFilteredRowModel().rows.length} results.
              </>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
            <span className="hidden lg:inline-block">Rows per page:</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger id={`${tableId}-page-size`} className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="whitespace-nowrap">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 hidden sm:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="Go to first page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Go to next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 hidden sm:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              aria-label="Go to last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}