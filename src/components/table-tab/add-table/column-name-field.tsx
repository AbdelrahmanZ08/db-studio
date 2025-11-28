import { Controller, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import type { AddTableFormData } from "@/types/add-table.type";

export const ColumnNameField = ({ index }: { index: number }) => {
	const {
		control,
		register,
		formState: { errors },
	} = useFormContext<AddTableFormData>();

	return (
		<Controller
			control={control}
			name={`fields.${index}.columnName`}
			render={() => (
				<div className="flex flex-col gap-2">
					<Input
						id={`fields.${index}.columnName`}
						{...register(`fields.${index}.columnName`, {
							required: "Column name is required",
						})}
						placeholder="column_name"
						className={
							errors?.fields?.[index]?.columnName
								? "border-destructive ring-destructive ring-1"
								: ""
						}
					/>
				</div>
			)}
		/>
	);
};
