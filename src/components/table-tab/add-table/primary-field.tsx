import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import type { AddTableFormData } from "@/types/add-table.type";

export const PrimaryField = ({ index }: { index: number }) => {
	const { control, register, setValue } = useFormContext<AddTableFormData>();

	return (
		<Controller
			control={control}
			name={`fields.${index}.isPrimaryKey`}
			render={() => (
				<div className="flex flex-1 items-center justify-start">
					<Checkbox
						id={`fields.${index}.isPrimaryKey`}
						{...register(`fields.${index}.isPrimaryKey`)}
						onChange={(e) => {
							register(`fields.${index}.isPrimaryKey`).onChange(e);
							setValue(`fields.${index}.isNullable`, false);
						}}
						className="size-5"
					/>
				</div>
			)}
		/>
	);
};
