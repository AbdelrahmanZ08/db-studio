import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { AddTableFormData } from "@/types/add-table.type";
import { FieldRow } from "./field-row";

export const FormContent = () => {
	const { control } = useFormContext<AddTableFormData>();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "fields",
	});

	const addField = () => {
		append({
			columnName: "",
			columnType: "",
			defaultValue: "",
			isPrimaryKey: false,
			isNullable: true,
			isUnique: false,
			isIdentity: false,
			isArray: false,
		});
	};

	const removeField = (index: number) => {
		if (fields.length > 1) {
			remove(index);
		}
	};

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-4 gap-4">
				<Label>Column Name</Label>
				<Label>Column Type</Label>
				<Label>Default Value</Label>
				<Label>Primary</Label>
			</div>

			{fields.map((field, index) => (
				<FieldRow
					key={field.id}
					index={index}
					onRemove={() => removeField(index)}
					canRemove={fields.length > 1}
				/>
			))}

			<div className="border border-dashed border-input rounded-lg flex justify-center items-center p-6">
				<Button type="button" variant="secondary" onClick={addField}>
					Add New Column
				</Button>
			</div>
		</div>
	);
};
