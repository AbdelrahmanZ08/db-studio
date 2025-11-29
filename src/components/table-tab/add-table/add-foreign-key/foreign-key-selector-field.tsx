import { ArrowRight, XIcon } from "lucide-react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
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

	const { fields, append, remove } = useFieldArray({
		control,
		name: "foreignKeys",
	});

	const addForeignKey = () => {
		// todo: review this shit
		append({
			columnName: "none",
			referencedTable: foreignKeyData?.referencedTable || "none",
			referencedColumn: "none",
			onUpdate: "NO ACTION",
			onDelete: "NO ACTION",
		});
	};

	const removeForeignKey = (index: number) => {
		if (fields.length > 1) {
			remove(index);
		}
	};

	if (!foreignKeyData) return null;

	return (
		<div className="flex flex-col gap-4">
			<p className="text-xs text-muted-foreground">
				Select columns from{" "}
				<span className="font-mono text-primary">{foreignKeyData.referencedTable}</span>{" "}
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

				{fields.map((_, i) => (
					<div
						className="grid grid-cols-2 gap-4"
						key={i}
					>
						<div className="flex items-center gap-2">
							<ColNameField index={i} />
							<ArrowRight className="size-6 text-muted-foreground" />
						</div>

						<div className="flex items-center gap-2">
							<ReferencedColField index={i} />
							<div className="flex items-end justify-center">
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="size-9"
									onClick={() => removeForeignKey(i)}
									disabled={fields.length <= 1}
								>
									<XIcon className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>

			<Button
				type="button"
				variant="secondary"
				size="sm"
				onClick={addForeignKey}
				className="w-fit"
			>
				<span className="text-xs">add another relationship</span>
			</Button>
		</div>
	);
};

// import { ArrowRight, XIcon } from "lucide-react";
// import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import type { AddTableFormData } from "@/types/add-table.type";
// import { ColNameField } from "./col-name-field";
// import { ReferencedColField } from "./referenced-col-field";

// export const ForeignKeySelectorField = ({ index }: { index: number }) => {
//   const { control, watch } = useFormContext<AddTableFormData>();
//   const foreignKeyData = useWatch({
//     control,
//     name: `foreignKeys.${index}`,
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "foreignKeys",
//   });

//   const addForeignKey = () => {
//     append({
//       columnName: foreignKeyData?.columnName || "",
//       referencedTable: foreignKeyData?.referencedTable || "",
//       referencedColumn: foreignKeyData?.referencedColumn || "",
//       onUpdate: "NO ACTION",
//       onDelete: "NO ACTION"
//     });
//   };

//   if (!foreignKeyData) return null;

//   return (
//     <div className="flex flex-col gap-4">
//       <p className="text-xs text-muted-foreground">
//         Select columns from{" "}
//         <span className="font-mono text-primary">
//           {foreignKeyData.referencedTable}
//         </span>{" "}
//         to reference to
//       </p>

//       <div className="space-y-2">
//         <div className="grid grid-cols-2">
//           <Label htmlFor={`foreignKeys.${index}.columnName`}>
//             {watch("tableName") || "Unnamed table"}
//           </Label>

//           <Label htmlFor={`foreignKeys.${index}.referencedColumn`}>
//             {foreignKeyData.referencedTable || "Unnamed table"}
//           </Label>
//         </div>

//         {fields.map((field) => (
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-x-2 flex items-center">
//               <ColNameField index={index} />
//               <ArrowRight className="size-6 text-muted-foreground" />
//             </div>

//             <div className="space-x-2 flex items-center">
//               <ReferencedColField index={index} />
//               <div className="flex items-end justify-center">
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="icon"
//                   className="size-9"
//                 // onClick={onRemove}
//                 // disabled={!canRemove}
//                 >
//                   <XIcon className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>
//         ))}

//         <Button
//           type="button"
//           variant="secondary"
//           size="sm"
//           onClick={() => append({ columnName: "", referencedTable: "", referencedColumn: "", onUpdate: "NO ACTION", onDelete: "NO ACTION" })}
//         >
//           Add Foreign Key
//         </Button>
//       </div>
//     </div>
//   );
// };
