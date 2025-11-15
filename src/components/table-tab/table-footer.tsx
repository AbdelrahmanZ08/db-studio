import type { Table } from "@tanstack/react-table";
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Pagination, PaginationContent, PaginationItem } from "../ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export const TableFooter = ({ table }: { table: Table<Record<string, unknown>> }) => {
	return (
		<footer className="h-10 border-t border-zinc-800 w-full flex items-center justify-between bg-black px-2">
			<div className="flex items-center gap-2">
				{/* Results per page */}
				<Label className="text-xs text-zinc-400 whitespace-nowrap">Rows per page</Label>
				<Select
					value={table.getState().pagination.pageSize.toString()}
					onValueChange={(value) => {
						table.setPageSize(Number(value));
					}}
				>
					<SelectTrigger
						size="sm"
						className="h-6 text-xs px-2 border-none bg-transparent! shadow-none hover:bg-transparent! gap-2"
					>
						<SelectValue placeholder="Select number of results" />
					</SelectTrigger>
					<SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 border-zinc-800">
						{[5, 10, 25, 50].map((pageSize) => (
							<SelectItem key={pageSize} value={pageSize.toString()}>
								{pageSize}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Page number information */}
			<div className="flex items-center justify-center text-xs text-zinc-400">
				<p className="whitespace-nowrap" aria-live="polite">
					<span className="text-zinc-200">
						{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
						{Math.min(
							Math.max(
								table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
									table.getState().pagination.pageSize,
								0,
							),
							table.getRowCount(),
						)}
					</span>{" "}
					of <span className="text-zinc-200">{table.getRowCount().toString()}</span>
				</p>
			</div>

			{/* Pagination buttons */}
			<div className="flex items-center">
				<Pagination>
					<PaginationContent className="gap-0.5">
						<PaginationItem>
							<Button
								size="icon-sm"
								variant="ghost"
								className="h-6 w-6 disabled:opacity-30"
								onClick={() => table.firstPage()}
								disabled={!table.getCanPreviousPage()}
								aria-label="Go to first page"
							>
								<ChevronFirstIcon size={14} aria-hidden="true" />
							</Button>
						</PaginationItem>
						<PaginationItem>
							<Button
								size="icon-sm"
								variant="ghost"
								className="h-6 w-6 disabled:opacity-30"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
								aria-label="Go to previous page"
							>
								<ChevronLeftIcon size={14} aria-hidden="true" />
							</Button>
						</PaginationItem>
						<PaginationItem>
							<Button
								size="icon-sm"
								variant="ghost"
								className="h-6 w-6 disabled:opacity-30"
								onClick={() => table.nextPage()}
								disabled={!table.getCanNextPage()}
								aria-label="Go to next page"
							>
								<ChevronRightIcon size={14} aria-hidden="true" />
							</Button>
						</PaginationItem>
						<PaginationItem>
							<Button
								size="icon-sm"
								variant="ghost"
								className="h-6 w-6 disabled:opacity-30"
								onClick={() => table.lastPage()}
								disabled={!table.getCanNextPage()}
								aria-label="Go to last page"
							>
								<ChevronLastIcon size={14} aria-hidden="true" />
							</Button>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</footer>
	);
};
