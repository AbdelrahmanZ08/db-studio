import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Sheet } from "@/components/components/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/utils/cn";
import { PSQL_TYPE_LABEL_MAP, PSQL_TYPES } from "@/utils/constants/add-table";

const { fieldContext, formContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
	fieldComponents: {
		input: Input,
		label: Label,
		checkbox: Checkbox,
	},
	formComponents: {
		submitButton: Button,
		resetButton: Button,
	},
	fieldContext,
	formContext,
});

export const AddTableForm = () => {
	const [open, setOpen] = useState(false);

	const form = useAppForm({
		defaultValues: {
			tableName: "",
			columnName: "",
			columnType: "",
			defaultValue: "",
			isPrimaryKey: false,
		},
		validators: {
			onChange: z.object({
				tableName: z.string(),
				columnName: z.string(),
				columnType: z.string(),
				defaultValue: z.string(),
				isPrimaryKey: z.boolean(),
			}),
		},
		onSubmit: ({ value }) => {
			console.log(value);
		},
	});

	return (
		<Sheet title="Create a new table" name="add-table">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
				className="p-4 space-y-4"
			>
				<form.AppField
					name="tableName"
					children={(field) => (
						<div className="flex flex-col gap-2">
							<field.label htmlFor="tableName">Table Name</field.label>
							<field.input id="tableName" />
						</div>
					)}
				/>

				<div className="grid grid-cols-4 gap-4">
					<form.AppField
						name="columnName"
						children={(field) => (
							<div className="flex flex-col gap-2">
								<field.label htmlFor="columnName">Name</field.label>
								<field.input id="columnName" placeholder="column_name" />
							</div>
						)}
					/>

					<form.AppField
						name="columnType"
						children={(field) => (
							<div className="flex flex-col gap-2">
								<Label htmlFor="columnType">Type</Label>
								<Popover open={open} onOpenChange={setOpen}>
									<PopoverTrigger asChild>
										<Button
											id="columnType"
											role="combobox"
											aria-expanded={open}
											variant="outline"
											className="w-full justify-between border-input bg-background px-3 font-normal outline-none outline-offset-0 hover:bg-background focus-visible:outline-[3px]"
										>
											<span className={cn("truncate", !field.state.value && "text-muted-foreground")}>
												{field.state.value ? PSQL_TYPE_LABEL_MAP[field.state.value] : "Select type"}
											</span>
											<ChevronDownIcon aria-hidden="true" className="shrink-0 text-muted-foreground/80" size={16} />
										</Button>
									</PopoverTrigger>
									<PopoverContent align="start" className="w-full min-w-(--radix-popper-anchor-width) border-input p-0">
										<Command>
											<CommandInput placeholder="Search type..." />
											<CommandList>
												<CommandEmpty>No type found.</CommandEmpty>
												{Object.entries(PSQL_TYPES).map(([key, value]) => (
													<CommandGroup key={key} heading={key}>
														{value.map((item) => (
															<CommandItem
																key={item.value}
																value={`${item.label} ${item.description}`}
																onSelect={() => {
																	field.setValue(item.value);
																	setOpen(false);
																}}
															>
																<div className="flex flex-col gap-1 items-start flex-1">
																	<p className="font-medium" data-label>
																		{item.label}
																	</p>
																	<span className="text-xs text-muted-foreground">{item.description}</span>
																</div>
																{field.state.value === item.value && (
																	<CheckIcon className="ml-auto shrink-0" size={16} />
																)}
															</CommandItem>
														))}
													</CommandGroup>
												))}
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
							</div>
						)}
					/>

					<form.AppField
						name="defaultValue"
						children={(field) => (
							<div className="flex flex-col gap-2">
								<field.label htmlFor="defaultValue">Default Value</field.label>
								<field.input id="defaultValue" placeholder="NULL" />
							</div>
						)}
					/>

					<div className="flex gap-2">
						<form.AppField
							name="isPrimaryKey"
							children={(field) => (
								<div className="flex flex-col gap-2">
									<field.label htmlFor="isPrimaryKey">Primary</field.label>
									<div className="flex flex-1 items-center justify-start">
										<field.checkbox
											id="isPrimaryKey"
											checked={field.state.value}
											onCheckedChange={(value) => field.setValue(Boolean(value))}
											size="lg"
										/>
									</div>
								</div>
							)}
						/>

						<div className="flex items-end justify-center">
							<form.resetButton type="button" variant="ghost" size="icon-sm">
								<XIcon className="size-4" />
							</form.resetButton>
						</div>
					</div>
				</div>

				<div className="flex justify-end gap-2">
					<form.resetButton type="button" variant="outline">
						Cancel
					</form.resetButton>

					<form.submitButton type="submit" variant="default">
						Save
					</form.submitButton>
				</div>
			</form>
		</Sheet>
	);
};
