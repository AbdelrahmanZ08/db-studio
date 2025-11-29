import { ArrowRight, XIcon } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { AddTableFormData } from "@/types/add-table.type";
import { ColNameField } from "./col-name-field";
import { ReferencedColField } from "./referenced-col-field";

export const ForeignKeySelectorField = ({ index }: { index: number }) => {
	const { control, watch } = useFormContext<AddTableFormData>();
	const foreignKeyData = useWatch({
		control,
		name: `foreignKeys.${index}`,
	});

	// const { fields, append, remove } = useFieldArray({
	//   control,
	//   name: "foreignKeys",
	// });

	if (!foreignKeyData) return null;

	return (
		<div className="flex flex-col gap-2">
			<p>
				Select columns from{" "}
				<span className="font-mono text-foreground">
					{foreignKeyData.referencedTable}
				</span>{" "}
				to reference to
			</p>

			<div className="space-y-2">
				<div className="grid grid-cols-2">
					<Label htmlFor={`foreignKeys.${index}.columnName`}>
						{watch("tableName") || "Unnamed table"}
					</Label>

					<Label htmlFor={`foreignKeys.${index}.referencedColumn`}>
						{foreignKeyData.referencedTable || "Unnamed table"}
					</Label>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-x-2 flex items-center">
						<ColNameField index={index} />
						<ArrowRight className="size-6 text-muted-foreground" />
					</div>

					<div className="space-x-2 flex items-center">
						<ReferencedColField index={index} />
						<div className="flex items-end justify-center">
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="size-9"
								// onClick={onRemove}
								// disabled={!canRemove}
							>
								<XIcon className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
