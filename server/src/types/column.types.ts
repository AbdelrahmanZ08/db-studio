/**
 * Simplified, generalized data types for frontend rendering
 * Makes it easy to determine which cell component to use
 */
export enum DataType {
  // Short text - for single-line text input
  short-text = 'short-text',

  // Long text - for multi-line text input
  long-text = 'long-text',

  // Boolean - for checkbox/toggle
  BOOLEAN = 'BOOLEAN',

  // Numeric types - for number input
  number = 'number',

  // Array - for array viewer/editor
  ARRAY = 'ARRAY',
}

/**
 * Maps PostgreSQL data types to generic DataType enum
 */
export function mapPostgresToDataType(pgType: string): DataType {
  // Normalize to lowercase and handle composite types
  const normalized = pgType.toLowerCase().trim();

  // Handle array types
  if (normalized.startsWith('array') || normalized.includes('[]')) {
    return DataType.ARRAY;
  }

  // Numeric types - map to number
  if (
    normalized === 'integer' || normalized === 'int' || normalized === 'int4' ||
    normalized === 'bigint' || normalized === 'int8' ||
    normalized === 'smallint' || normalized === 'int2' ||
    normalized === 'decimal' || normalized.startsWith('decimal(') ||
    normalized === 'numeric' || normalized.startsWith('numeric(') ||
    normalized === 'real' || normalized === 'float4' ||
    normalized === 'double precision' || normalized === 'float8' ||
    normalized === 'float' ||
    normalized === 'serial' || normalized === 'serial4' ||
    normalized === 'bigserial' || normalized === 'serial8' ||
    normalized === 'money'
  ) {
    return DataType.number;
  }

  // Boolean
  if (normalized === 'boolean' || normalized === 'bool') {
    return DataType.BOOLEAN;
  }

  // Long string types (text, xml, json)
  if (
    normalized === 'text' ||
    normalized === 'xml' ||
    normalized === 'json' || normalized === 'jsonb'
  ) {
    return DataType.long-text;
  }

  // Short string types (varchar, char, uuid, date, timestamp, etc.)
  if (
    normalized === 'character varying' || normalized.startsWith('varchar') || normalized.startsWith('character varying(') ||
    normalized === 'character' || normalized.startsWith('char') || normalized.startsWith('character(') || normalized === 'bpchar' ||
    normalized === 'uuid' ||
    normalized.startsWith('user-defined') || normalized === 'enum' ||
    normalized === 'date' ||
    normalized === 'time' || normalized === 'time without time zone' || normalized.startsWith('time(') ||
    normalized === 'timestamp' || normalized === 'timestamp without time zone' || normalized.startsWith('timestamp(') ||
    normalized === 'timestamp with time zone' || normalized === 'timestamptz' || normalized.startsWith('timestamp with time zone(') ||
    normalized === 'interval' || normalized.startsWith('interval') ||
    normalized === 'bytea' ||
    normalized === 'point' || normalized === 'line' || normalized === 'polygon' ||
    normalized === 'inet' || normalized === 'cidr' ||
    normalized === 'macaddr' || normalized === 'macaddr8'
  ) {
    return DataType.short-text;
  }

  // Default to short-text for unrecognized types
  return DataType.short-text;
}

/**
 * Maps MySQL data types to generic DataType enum
 */
export function mapMySQLToDataType(mysqlType: string): DataType {
  const normalized = mysqlType.toLowerCase().trim();

  // Boolean (MySQL uses TINYINT(1)) - check this first before numeric
  if (normalized === 'boolean' || normalized === 'bool' || normalized === 'tinyint(1)') {
    return DataType.BOOLEAN;
  }

  // Numeric types - map to number
  if (
    normalized === 'int' || normalized === 'integer' || normalized.startsWith('int(') ||
    normalized === 'bigint' || normalized.startsWith('bigint(') ||
    normalized === 'smallint' || normalized.startsWith('smallint(') ||
    normalized === 'tinyint' || normalized.startsWith('tinyint(') ||
    normalized === 'mediumint' || normalized.startsWith('mediumint(') ||
    normalized === 'decimal' || normalized.startsWith('decimal(') ||
    normalized === 'numeric' || normalized.startsWith('numeric(') ||
    normalized === 'float' || normalized.startsWith('float(') ||
    normalized === 'double' || normalized.startsWith('double(')
  ) {
    return DataType.number;
  }

  // Long string types (text variants, json)
  if (
    normalized === 'text' || normalized === 'longtext' || normalized === 'mediumtext' || normalized === 'tinytext' ||
    normalized === 'json'
  ) {
    return DataType.long-text;
  }

  // Short string types (varchar, char, date/time, binary, etc.)
  if (
    normalized === 'varchar' || normalized.startsWith('varchar(') ||
    normalized === 'char' || normalized.startsWith('char(') ||
    normalized.startsWith('enum(') ||
    normalized.startsWith('set(') ||
    normalized === 'date' ||
    normalized === 'time' || normalized === 'datetime' || normalized === 'timestamp' || normalized === 'year' ||
    normalized === 'blob' || normalized === 'longblob' || normalized === 'mediumblob' ||
    normalized === 'tinyblob' || normalized === 'binary' || normalized === 'varbinary'
  ) {
    return DataType.short-text;
  }

  return DataType.short-text;
}

