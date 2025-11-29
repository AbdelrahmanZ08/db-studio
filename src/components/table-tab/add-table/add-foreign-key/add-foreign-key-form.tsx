import { useFormContext } from "react-hook-form";
import { Sheet } from "@/components/components/sheet";
import { useSheetStore } from "@/stores/sheet.store";
import type { AddTableFormData } from "@/types/add-table.type";
import { ForeignKeySelectorField } from "./foreign-key-selector-field";
import { ReferencedTableField } from "./referenced-table-field";

export const AddForeignKeyForm = ({ index }: { index: number }) => {
	const { closeSheet } = useSheetStore();
	const { setValue } = useFormContext<AddTableFormData>();

	const _resetForeignKey = () => {
		setValue(`foreignKeys.${index}`, {
			columnName: "",
			referencedTable: "",
			referencedColumn: "",
			onUpdate: "NO ACTION",
			onDelete: "NO ACTION",
		});
	};

	return (
		<Sheet
			title="Add foreign key relationship"
			name={`add-foreign-key-${index}`}
			width={500}
			onClose={() => {
				closeSheet(`add-foreign-key-${index}`);
				// resetForeignKey();
			}}
		>
			<div className="px-5 py-6 space-y-6">
				<ReferencedTableField index={index} />
				<ForeignKeySelectorField index={index} />
			</div>
		</Sheet>
	);
};
