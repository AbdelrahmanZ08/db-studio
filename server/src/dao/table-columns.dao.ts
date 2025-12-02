import { db } from "../db.js";
import {
	type DataTypes,
	mapPostgresToDataType,
	standardizeDataTypeLabel,
} from "../types/column.types.js";

export interface ColumnInfo {
	columnName: string;
	dataType: DataTypes;
	isNullable: boolean;
	columnDefault: string | null;
	isPrimaryKey: boolean;
	isForeignKey: boolean;
	referencedTable: string | null;
	referencedColumn: string | null;
}

export const getTableColumns = async (tableName: string): Promise<ColumnInfo[]> => {
	const client = await db.connect();
	try {
		const res = await client.query(
			`
      SELECT 
        c.column_name as "columnName",
        c.data_type as "dataType",
        c.is_nullable = 'YES' as "isNullable",
        c.column_default as "columnDefault",
        CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END as "isPrimaryKey",
        CASE WHEN fk.column_name IS NOT NULL THEN true ELSE false END as "isForeignKey",
        fk.referenced_table as "referencedTable",
        fk.referenced_column as "referencedColumn"
      FROM information_schema.columns c
      LEFT JOIN (
        SELECT ku.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage ku
          ON tc.constraint_name = ku.constraint_name
          AND tc.table_schema = ku.table_schema
        WHERE tc.constraint_type = 'PRIMARY KEY'
          AND tc.table_schema = 'public'
          AND tc.table_name = $1
      ) pk ON c.column_name = pk.column_name
      LEFT JOIN (
        SELECT 
          kcu.column_name,
          ccu.table_name AS referenced_table,
          ccu.column_name AS referenced_column
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage ccu
          ON tc.constraint_name = ccu.constraint_name
          AND tc.table_schema = ccu.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_schema = 'public'
          AND tc.table_name = $1
      ) fk ON c.column_name = fk.column_name
      WHERE c.table_schema = 'public'
        AND c.table_name = $1
      ORDER BY c.ordinal_position;
    `,
			[tableName],
		);

		return res.rows.map((r) => ({
			columnName: r.columnName,
			dataType: mapPostgresToDataType(r.dataType),
			dataTypeLabel: standardizeDataTypeLabel(r.dataType),
			isNullable: r.isNullable,
			columnDefault: r.columnDefault,
			isPrimaryKey: r.isPrimaryKey,
			isForeignKey: r.isForeignKey,
			referencedTable: r.referencedTable,
			referencedColumn: r.referencedColumn,
		}));
	} finally {
		client.release();
	}
};
