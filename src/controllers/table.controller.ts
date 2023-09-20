import { configure, makeAutoObservable } from "mobx";
// Networking
import axios, { APIS } from "networking";
// Patterns
import { TablePattern } from "patterns/table.pattern";

configure({ enforceActions: "never" });

class TableController {
  transferTable: {
    source: { tableId: number; tableName: string } | null;
    target: { tableId: number; tableName: string } | null;
  } | null = null;
  scrollActive: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getTables = async () => {
    try {
      let { data } = await axios.get(APIS.TABLES.rawValue);
      if (!data.error) return <TablePattern[]>data.tables;
    } catch (err) {}
    return [];
  };

  setTransferTable = (
    transferTable: {
      source: { tableId: number; tableName: string } | null;
      target: { tableId: number; tableName: string } | null;
    } | null
  ) => (this.transferTable = transferTable);

  setScrollActive = (scrollActive: string) => (this.scrollActive = scrollActive);
}

export default TableController;
