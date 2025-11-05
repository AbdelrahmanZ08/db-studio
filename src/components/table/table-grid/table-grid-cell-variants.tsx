import type { Cell, Table } from "@tanstack/react-table";
import {
	type ChangeEvent,
	type ComponentProps,
	type FormEvent,
	type KeyboardEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/components/popover";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { cn } from "@/utils/cn";
import { DataGridCellWrapper } from "./table-grid-cell-wrapper";

interface CellVariantProps<TData> {
	cell: Cell<TData, unknown>;
	table: Table<TData>;
	rowIndex: number;
	columnId: string;
	isEditing: boolean;
	isFocused: boolean;
	isSelected: boolean;
}

export function ShortTextCell<TData>({
	cell,
	table,
	rowIndex,
	columnId,
	isEditing,
	isFocused,
	isSelected,
}: CellVariantProps<TData>) {
	const initialValue = cell.getValue() as string;
	const [value, setValue] = useState(initialValue);
	const cellRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const meta = table.options.meta;

	const onBlur = useCallback(() => {
		// Read the current value directly from the DOM to avoid stale state
		const currentValue = cellRef.current?.textContent ?? "";
		if (currentValue !== initialValue) {
			meta?.onDataUpdate?.({ rowIndex, columnId, value: currentValue });
		}
		meta?.onCellEditingStop?.();
	}, [meta, rowIndex, columnId, initialValue]);

	const onInput = useCallback((event: FormEvent<HTMLDivElement>) => {
		const currentValue = event.currentTarget.textContent ?? "";
		setValue(currentValue);
	}, []);

	const onWrapperKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			if (isEditing) {
				if (event.key === "Enter") {
					event.preventDefault();
					const currentValue = cellRef.current?.textContent ?? "";
					if (currentValue !== initialValue) {
						meta?.onDataUpdate?.({ rowIndex, columnId, value: currentValue });
					}
					meta?.onCellEditingStop?.({ moveToNextRow: true });
				} else if (event.key === "Tab") {
					event.preventDefault();
					const currentValue = cellRef.current?.textContent ?? "";
					if (currentValue !== initialValue) {
						meta?.onDataUpdate?.({ rowIndex, columnId, value: currentValue });
					}
					meta?.onCellEditingStop?.({
						direction: event.shiftKey ? "left" : "right",
					});
				} else if (event.key === "Escape") {
					event.preventDefault();
					setValue(initialValue);
					cellRef.current?.blur();
				}
			} else if (isFocused && event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
				// Handle typing to pre-fill the value when editing starts
				setValue(event.key);

				queueMicrotask(() => {
					if (cellRef.current && cellRef.current.contentEditable === "true") {
						cellRef.current.textContent = event.key;
						const range = document.createRange();
						const selection = window.getSelection();
						range.selectNodeContents(cellRef.current);
						range.collapse(false);
						selection?.removeAllRanges();
						selection?.addRange(range);
					}
				});
			}
		},
		[isEditing, isFocused, initialValue, meta, rowIndex, columnId],
	);

	useEffect(() => {
		setValue(initialValue);
		if (cellRef.current && !isEditing) {
			cellRef.current.textContent = initialValue;
		}
	}, [initialValue, isEditing]);

	useEffect(() => {
		if (isEditing && cellRef.current) {
			cellRef.current.focus();

			if (!cellRef.current.textContent && value) {
				cellRef.current.textContent = value;
			}

			if (cellRef.current.textContent) {
				const range = document.createRange();
				const selection = window.getSelection();
				range.selectNodeContents(cellRef.current);
				range.collapse(false);
				selection?.removeAllRanges();
				selection?.addRange(range);
			}
		}
		// Don't focus if we're in the middle of a scroll operation
		if (isFocused && !isEditing && !meta?.searchOpen && !meta?.isScrolling && containerRef.current) {
			containerRef.current.focus();
		}
	}, [isFocused, isEditing, value, meta?.searchOpen, meta?.isScrolling]);

	const displayValue = !isEditing ? (value ?? "") : "";

	return (
		<DataGridCellWrapper
			ref={containerRef}
			cell={cell}
			table={table}
			rowIndex={rowIndex}
			columnId={columnId}
			isEditing={isEditing}
			isFocused={isFocused}
			isSelected={isSelected}
			onKeyDown={onWrapperKeyDown}
		>
			<div
				role="textbox"
				data-slot="grid-cell-content"
				contentEditable={isEditing}
				tabIndex={-1}
				ref={cellRef}
				onBlur={onBlur}
				onInput={onInput}
				suppressContentEditableWarning
				className={cn("size-full overflow-hidden outline-none", {
					// "whitespace-nowrap [&_*]:inline [&_*]:whitespace-nowrap [&_br]:hidden":
					isEditing,
				})}
			>
				{displayValue}
			</div>
		</DataGridCellWrapper>
	);
}

export function LongTextCell<TData>({
	cell,
	table,
	rowIndex,
	columnId,
	isFocused,
	isEditing,
	isSelected,
}: CellVariantProps<TData>) {
	const initialValue = cell.getValue() as string;
	const [value, setValue] = useState(initialValue ?? "");
	const [open, setOpen] = useState(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const meta = table.options.meta;
	const sideOffset = -(containerRef.current?.clientHeight ?? 0);

	const prevInitialValueRef = useRef(initialValue);
	if (initialValue !== prevInitialValueRef.current) {
		prevInitialValueRef.current = initialValue;
		setValue(initialValue ?? "");
	}

	// Debounced auto-save (300ms delay)
	const debouncedSave = useDebouncedCallback((newValue: string) => {
		meta?.onDataUpdate?.({ rowIndex, columnId, value: newValue });
	}, 300);

	const onSave = useCallback(() => {
		// Immediately save any pending changes and close the popover
		if (value !== initialValue) {
			meta?.onDataUpdate?.({ rowIndex, columnId, value });
		}
		setOpen(false);
		meta?.onCellEditingStop?.();
	}, [meta, value, initialValue, rowIndex, columnId]);

	const onCancel = useCallback(() => {
		// Restore the original value
		setValue(initialValue ?? "");
		meta?.onDataUpdate?.({ rowIndex, columnId, value: initialValue });
		setOpen(false);
		meta?.onCellEditingStop?.();
	}, [meta, initialValue, rowIndex, columnId]);

	const onChange = useCallback(
		(event: ChangeEvent<HTMLTextAreaElement>) => {
			const newValue = event.target.value;
			setValue(newValue);
			// Debounced auto-save
			debouncedSave(newValue);
		},
		[debouncedSave],
	);

	const onOpenChange = useCallback(
		(isOpen: boolean) => {
			setOpen(isOpen);
			if (!isOpen) {
				// Immediately save any pending changes when closing
				if (value !== initialValue) {
					meta?.onDataUpdate?.({ rowIndex, columnId, value });
				}
				meta?.onCellEditingStop?.();
			}
		},
		[meta, value, initialValue, rowIndex, columnId],
	);

	const onOpenAutoFocus: NonNullable<ComponentProps<typeof PopoverContent>["onOpenAutoFocus"]> = useCallback(
		(event) => {
			event.preventDefault();
			if (textareaRef.current) {
				textareaRef.current.focus();
				const length = textareaRef.current.value.length;
				textareaRef.current.setSelectionRange(length, length);
			}
		},
		[],
	);

	const onWrapperKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			if (isEditing && !open) {
				if (event.key === "Escape") {
					event.preventDefault();
					meta?.onCellEditingStop?.();
				} else if (event.key === "Tab") {
					event.preventDefault();
					// Save any pending changes
					if (value !== initialValue) {
						meta?.onDataUpdate?.({ rowIndex, columnId, value });
					}
					meta?.onCellEditingStop?.({
						direction: event.shiftKey ? "left" : "right",
					});
				}
			}
		},
		[isEditing, open, meta, value, initialValue, rowIndex, columnId],
	);

	const onTextareaKeyDown = useCallback(
		(event: KeyboardEvent<HTMLTextAreaElement>) => {
			if (event.key === "Escape") {
				event.preventDefault();
				onCancel();
			} else if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
				event.preventDefault();
				onSave();
			}
			// Stop propagation to prevent grid navigation
			event.stopPropagation();
		},
		[onCancel, onSave],
	);

	const onTextareaBlur = useCallback(() => {
		// Immediately save any pending changes on blur
		if (value !== initialValue) {
			meta?.onDataUpdate?.({ rowIndex, columnId, value });
		}
		setOpen(false);
		meta?.onCellEditingStop?.();
	}, [meta, value, initialValue, rowIndex, columnId]);

	useEffect(() => {
		if (isEditing && !open) {
			setOpen(true);
		}
		if (isFocused && !isEditing && !meta?.searchOpen && !meta?.isScrolling && containerRef.current) {
			containerRef.current.focus();
		}
	}, [isFocused, isEditing, open, meta?.searchOpen, meta?.isScrolling]);

	return (
		<Popover open={open} onOpenChange={onOpenChange}>
			<PopoverAnchor asChild>
				<DataGridCellWrapper
					ref={containerRef}
					cell={cell}
					table={table}
					rowIndex={rowIndex}
					columnId={columnId}
					isEditing={isEditing}
					isFocused={isFocused}
					isSelected={isSelected}
					onKeyDown={onWrapperKeyDown}
				>
					<span data-slot="grid-cell-content">{value}</span>
				</DataGridCellWrapper>
			</PopoverAnchor>
			<PopoverContent
				data-grid-cell-editor=""
				align="start"
				side="bottom"
				sideOffset={sideOffset}
				className="w-[400px] rounded-none p-0"
				onOpenAutoFocus={onOpenAutoFocus}
			>
				<textarea
					ref={textareaRef}
					value={value}
					onChange={onChange}
					onKeyDown={onTextareaKeyDown}
					onBlur={onTextareaBlur}
					className="min-h-[150px] resize-none rounded-none border-0 shadow-none focus-visible:ring-0"
					placeholder="Enter text..."
				/>
			</PopoverContent>
		</Popover>
	);
}
