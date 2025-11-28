import { z } from "zod";

const fieldSchema = z.object({
	columnName: z.string().min(1, "Column name is required"),
	columnType: z.string().min(1, "Column type is required"),
	defaultValue: z.string(),
	isPrimaryKey: z.boolean(),
	isNullable: z.boolean(),
	isUnique: z.boolean(),
	isIdentity: z.boolean(),
	isArray: z.boolean(),
});

export const addTableSchema = z.object({
	tableName: z.string().min(1, "Table name is required"),
	fields: z.array(fieldSchema).min(1, "At least one column is required"),
});

export type FieldData = z.infer<typeof fieldSchema>;
export type AddTableFormData = z.infer<typeof addTableSchema>;

export type AddTableOption = {
	name: keyof Pick<FieldData, "isNullable" | "isUnique" | "isIdentity" | "isArray">;
	label: string;
	description: string;
};
