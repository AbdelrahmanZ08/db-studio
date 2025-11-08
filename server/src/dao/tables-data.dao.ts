import { db } from "../db.js";

export interface TableDataResult {
  data: Record<string, unknown>[];
  pagination: {
    page: number;
    pageSize: number;
    totalRows: number;
    totalPages: number;
  };
}

const PAGE_SIZE = 100;

export const getTableData = async (
  tableName: string,
  page: number = 1
): Promise<TableDataResult> => {
  const client = await db.connect();
  try {
    // Calculate offset
    const offset = (page - 1) * PAGE_SIZE;

    // Get total count
    const countRes = await client.query(
      `SELECT COUNT(*) as total FROM "${tableName}"`
    );
    const totalRows = Number(countRes.rows[0].total);
    const totalPages = Math.ceil(totalRows / PAGE_SIZE);

    // Get paginated data
    const dataRes = await client.query(
      `SELECT * FROM "${tableName}" LIMIT $1 OFFSET $2`,
      [PAGE_SIZE, offset]
    );

    return {
      data: dataRes.rows,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        totalRows,
        totalPages,
      },
    };
  } finally {
    client.release();
  }
};

