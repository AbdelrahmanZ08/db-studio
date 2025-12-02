import { Controller, type ControllerRenderProps, useFormContext } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { AddRecordFormData } from "@/hooks/use-create-record";
import type { ColumnInfo } from "@/services/get-table-cols.service";

export const AddRecordField = ({
	columnName,
	dataTypeLabel,
	columnDefault,
	enumValues,
}: ColumnInfo) => {
	const { control } = useFormContext<AddRecordFormData>();

	const renderInputField = (field: ControllerRenderProps<AddRecordFormData, string>) => {
		// Number types (int, bigint, smallint, numeric, float, double, money)
		if (
			dataTypeLabel === "int" ||
			dataTypeLabel === "bigint" ||
			dataTypeLabel === "smallint" ||
			dataTypeLabel === "numeric" ||
			dataTypeLabel === "float" ||
			dataTypeLabel === "double" ||
			dataTypeLabel === "money"
		) {
			return (
				<Input
					id={columnName}
					type="number"
					placeholder={columnDefault ?? "0"}
					{...field}
				/>
			);
		}

		// Boolean type
		if (dataTypeLabel === "boolean") {
			return (
				<Select
					value={field.value}
					onValueChange={(value) => field.onChange(value)}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder={columnDefault ?? "true"} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="true">true</SelectItem>
						<SelectItem value="false">false</SelectItem>
					</SelectContent>
				</Select>
			);
		}

		// Long text types (text, xml)
		if (dataTypeLabel === "text" || dataTypeLabel === "xml") {
			return (
				<Textarea
					id={columnName}
					placeholder={columnDefault ?? ""}
					rows={4}
					{...field}
				/>
			);
		}

		// JSON types (json, jsonb)
		if (dataTypeLabel === "json" || dataTypeLabel === "jsonb") {
			return (
				<Textarea
					id={columnName}
					placeholder={columnDefault ?? '{"key": "value"}'}
					rows={6}
					{...field}
				/>
			);
		}

		// Date type
		if (
			dataTypeLabel === "date" ||
			dataTypeLabel === "timestamp" ||
			dataTypeLabel === "timestamptz"
		) {
			return (
				<DatePicker
					value={field.value ? new Date(field.value) : undefined}
					onChange={(date) =>
						field.onChange(date ? date.toISOString().split("T")[0] : "")
					}
					placeholder={columnDefault ?? "Select a date"}
				/>
			);
		}

		// UUID type
		if (dataTypeLabel === "uuid") {
			return (
				<Input
					id={columnName}
					type="text"
					placeholder={columnDefault ?? "00000000-0000-0000-0000-000000000000"}
					pattern="[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}"
					{...field}
				/>
			);
		}

		// Array type
		if (dataTypeLabel === "array") {
			return (
				<Textarea
					id={columnName}
					placeholder={columnDefault ?? '["item1", "item2"]'}
					rows={3}
					{...field}
				/>
			);
		}

		// Enum type
		if (dataTypeLabel === "enum") {
			if (enumValues && enumValues.length > 0) {
				return (
					<Select
						value={field.value}
						onValueChange={(value) => field.onChange(value)}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder={columnDefault ?? "Select a value"} />
						</SelectTrigger>
						<SelectContent>
							{enumValues.map((enumValue: string) => (
								<SelectItem
									key={enumValue}
									value={enumValue}
								>
									{enumValue}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				);
			}
			// Fallback if enumValues not available
			return (
				<Input
					id={columnName}
					placeholder={columnDefault ?? ""}
					{...field}
				/>
			);
		}

		// Interval type
		if (dataTypeLabel === "interval") {
			return (
				<Input
					id={columnName}
					type="text"
					placeholder={columnDefault ?? "1 day"}
					{...field}
				/>
			);
		}

		// Binary type (bytea)
		if (dataTypeLabel === "bytea") {
			return (
				<Input
					id={columnName}
					type="file"
					{...field}
				/>
			);
		}

		// Network types (inet, cidr, macaddr, macaddr8)
		if (
			dataTypeLabel === "inet" ||
			dataTypeLabel === "cidr" ||
			dataTypeLabel === "macaddr" ||
			dataTypeLabel === "macaddr8"
		) {
			return (
				<Input
					id={columnName}
					type="text"
					placeholder={
						dataTypeLabel === "inet"
							? "192.168.1.1"
							: dataTypeLabel === "cidr"
								? "192.168.1.0/24"
								: dataTypeLabel === "macaddr"
									? "08:00:2b:01:02:03"
									: "08:00:2b:01:02:03:04:05"
					}
					{...field}
				/>
			);
		}

		// Geometric types (point, line, polygon)
		if (
			dataTypeLabel === "point" ||
			dataTypeLabel === "line" ||
			dataTypeLabel === "polygon"
		) {
			return (
				<Input
					id={columnName}
					type="text"
					placeholder={
						dataTypeLabel === "point"
							? "(x,y)"
							: dataTypeLabel === "line"
								? "{A,B,C}"
								: "((x1,y1),(x2,y2),...)"
					}
					{...field}
				/>
			);
		}

		// Default: Short text types (varchar, char, and others)
		return (
			<Input
				id={columnName}
				type="text"
				placeholder={columnDefault ?? ""}
				{...field}
			/>
		);
	};

	return (
		<Controller
			key={columnName}
			control={control}
			name={columnName}
			render={({ field }) => (
				<div className="grid grid-cols-3 gap-4">
					<div className="col-span-1 flex flex-col gap-1">
						<Label htmlFor={columnName}>{columnName}</Label>
						<span className="text-xs text-muted-foreground">{dataTypeLabel}</span>
					</div>
					<div className="col-span-2 w-full">{renderInputField(field)}</div>
				</div>
			)}
		/>
	);
};
