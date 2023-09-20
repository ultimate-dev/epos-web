// Pattenrs
import { TablePattern } from "patterns/table.pattern";
import { CategoryPattern } from "patterns/category.pattern";

export const generateTableName = (
  tableId: number,
  tables: TablePattern[],
  categories: CategoryPattern[]
) => {
  try {
    let table = tables.find((table) => table.id == tableId);
    let category = categories.find((category) => category.id == table?.categoryId);
    if (table && category) return category.name + "-" + table.tableNum;
  } catch (err) {}
  return "";
};
