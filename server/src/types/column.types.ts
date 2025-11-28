export const DataTypes = {
	short: "short",
	long: "long",
	boolean: "boolean",
	number: "number",
	enum: "enum",
	json: "json",
} as const;

export type DataTypes = (typeof DataTypes)[keyof typeof DataTypes];

/**
 * Maps PostgreSQL data types to generic DataType enum
 */
export function mapPostgresToDataType(pgType: string): DataTypes {
	const normalized = pgType.toLowerCase().trim();

	// Handle array types and date/time types
	if (
		normalized.startsWith("array") ||
		normalized.includes("[]") ||
		normalized === "date" ||
		normalized === "time" ||
		normalized === "time without time zone" ||
		normalized.startsWith("time(") ||
		normalized === "timestamp" ||
		normalized === "timestamp without time zone" ||
		normalized.startsWith("timestamp(") ||
		normalized === "timestamp with time zone" ||
		normalized === "timestamptz" ||
		normalized.startsWith("timestamp with time zone(")
	) {
		return DataTypes.long;
	}

	// Numeric types
	if (
		normalized === "integer" ||
		normalized === "int" ||
		normalized === "int4" ||
		normalized === "bigint" ||
		normalized === "int8" ||
		normalized === "smallint" ||
		normalized === "int2" ||
		normalized === "decimal" ||
		normalized.startsWith("decimal(") ||
		normalized === "numeric" ||
		normalized.startsWith("numeric(") ||
		normalized === "real" ||
		normalized === "float4" ||
		normalized === "double precision" ||
		normalized === "float8" ||
		normalized === "float" ||
		normalized === "serial" ||
		normalized === "serial4" ||
		normalized === "bigserial" ||
		normalized === "serial8" ||
		normalized === "money"
	) {
		return DataTypes.number;
	}

	// Boolean
	if (normalized === "boolean" || normalized === "bool") {
		return DataTypes.boolean;
	}

	// JSON types
	if (normalized === "json" || normalized === "jsonb") {
		return DataTypes.json;
	}

	// Enum types and long text types
	if (
		normalized.startsWith("user-defined") ||
		normalized === "enum" ||
		normalized === "text" ||
		normalized === "xml"
	) {
		return DataTypes.long;
	}

	// Short string types (varchar, char, uuid, etc.)
	if (
		normalized === "character varying" ||
		normalized.startsWith("varchar") ||
		normalized.startsWith("character varying(") ||
		normalized === "character" ||
		normalized.startsWith("char") ||
		normalized.startsWith("character(") ||
		normalized === "bpchar" ||
		normalized === "uuid" ||
		normalized === "interval" ||
		normalized.startsWith("interval") ||
		normalized === "bytea" ||
		normalized === "point" ||
		normalized === "line" ||
		normalized === "polygon" ||
		normalized === "inet" ||
		normalized === "cidr" ||
		normalized === "macaddr" ||
		normalized === "macaddr8"
	) {
		return DataTypes.short;
	}

	// Default to short for unrecognized types
	return DataTypes.short;
}

/**
 * Maps PostgreSQL data types to standardized display labels
 */
export function standardizeDataTypeLabel(pgType: string): string {
	const normalized = pgType.toLowerCase().trim();

	// Numeric types
	if (
		normalized === "integer" ||
		normalized === "int" ||
		normalized === "int4" ||
		normalized === "serial" ||
		normalized === "serial4"
	) {
		return "int";
	}

	if (
		normalized === "bigint" ||
		normalized === "int8" ||
		normalized === "bigserial" ||
		normalized === "serial8"
	) {
		return "bigint";
	}

	if (normalized === "smallint" || normalized === "int2") {
		return "smallint";
	}

	if (
		normalized === "decimal" ||
		normalized.startsWith("decimal(") ||
		normalized === "numeric" ||
		normalized.startsWith("numeric(")
	) {
		return "numeric";
	}

	if (normalized === "real" || normalized === "float4") {
		return "float";
	}

	if (
		normalized === "double precision" ||
		normalized === "float8" ||
		normalized === "float"
	) {
		return "double";
	}

	if (normalized === "money") {
		return "money";
	}

	// Boolean
	if (normalized === "boolean" || normalized === "bool") {
		return "boolean";
	}

	// Text types
	if (normalized === "text") {
		return "text";
	}

	if (
		normalized === "character varying" ||
		normalized.startsWith("varchar") ||
		normalized.startsWith("character varying(")
	) {
		return "varchar";
	}

	if (
		normalized === "character" ||
		normalized.startsWith("char") ||
		normalized.startsWith("character(") ||
		normalized === "bpchar"
	) {
		return "char";
	}

	// JSON types
	if (normalized === "json") {
		return "json";
	}

	if (normalized === "jsonb") {
		return "jsonb";
	}

	if (normalized === "xml") {
		return "xml";
	}

	// UUID
	if (normalized === "uuid") {
		return "uuid";
	}

	// Date/Time types
	if (normalized === "date") {
		return "date";
	}

	if (
		normalized === "time" ||
		normalized === "time without time zone" ||
		normalized.startsWith("time(")
	) {
		return "time";
	}

	if (
		normalized === "timestamp" ||
		normalized === "timestamp without time zone" ||
		normalized.startsWith("timestamp(")
	) {
		return "timestamp";
	}

	if (
		normalized === "timestamp with time zone" ||
		normalized === "timestamptz" ||
		normalized.startsWith("timestamp with time zone(")
	) {
		return "timestamptz";
	}

	if (normalized === "interval" || normalized.startsWith("interval")) {
		return "interval";
	}

	// Binary
	if (normalized === "bytea") {
		return "bytea";
	}

	// Network types
	if (normalized === "inet") {
		return "inet";
	}

	if (normalized === "cidr") {
		return "cidr";
	}

	if (normalized === "macaddr") {
		return "macaddr";
	}

	if (normalized === "macaddr8") {
		return "macaddr8";
	}

	// Geometric types
	if (normalized === "point") {
		return "point";
	}

	if (normalized === "line") {
		return "line";
	}

	if (normalized === "polygon") {
		return "polygon";
	}

	// Array types
	if (normalized.startsWith("array") || normalized.includes("[]")) {
		return "array";
	}

	// User-defined types (enums)
	if (normalized.startsWith("user-defined") || normalized === "enum") {
		return "enum";
	}

	// Default: return the original type
	return pgType;
}
