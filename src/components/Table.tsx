// Components
import Ripple from "../components/Ripple";
// Patterns
import { TablePattern } from "patterns/table.pattern";

class TableProps extends TablePattern {
  drop?: any;
  drag?: any;
  active?: boolean;
  over?: boolean;
  transferTable?: {
    target: { tableId: number; tableName: string };
    source: { tableId: number; tableName: string };
  };
  onClick?: (active: boolean) => void;
  onTransferClick?: (active: boolean) => void;
}
const Table = ({
  drop,
  drag,
  over,
  active = false,
  transferTable,
  id,
  tableNum,
  onClick = () => {},
  onTransferClick = () => {},
}: TableProps) => {
  return (
    <div
      className="relative w-[20%] pt-[20%] overflow-hidden"
      ref={drop.innerRef}
      {...drop.droppableProps}
    >
      <div
        className={
          "absolute top-0 left-0 p-2 w-full h-full z-10" +
          (transferTable && !active && transferTable.source.tableId !== id
            ? " animate-pulse"
            : "")
        }
        ref={drag.innerRef}
        {...drag.draggableProps}
        style={transferTable?.source.tableId !== id ? {} : drag.draggableProps.style}
      >
        <Ripple
          className={
            "relative flex items-center justify-center shadow rounded cursor-pointer" +
            (active || over ? " bg-primary" : " bg-green")
          }
          onClick={() => onClick(active)}
        >
          <div className="absolute top-0 w-full p-1 flex items-center justify-end">
            <Ripple
              {...drag.dragHandleProps}
              className={
                "w-8 h-8 rounded flex items-center justify-center" +
                (transferTable &&
                transferTable.source &&
                transferTable.source.tableId !== id &&
                !active
                  ? " animate__animated animate__pulse animate__infinite"
                  : "")
              }
              onClick={() => onTransferClick(active)}
            >
              <>
                {!transferTable && active ? (
                  <i className="ri-arrow-left-right-fill text-white text-xl" />
                ) : null}
                {transferTable &&
                transferTable.source &&
                transferTable.source.tableId !== id &&
                !active ? (
                  <i className="ri-arrow-left-right-fill text-white text-xl" />
                ) : null}
                {transferTable &&
                  transferTable.source &&
                  transferTable.source.tableId == id && (
                    <i className="ri-close-fill text-white text-xl" />
                  )}
              </>
            </Ripple>
          </div>
          <span className="text-white font-bold text-2xl -mb-1">{tableNum}</span>
        </Ripple>
      </div>
      {transferTable?.source.tableId == id && (
        <div className="absolute top-0 left-0 p-2 w-full h-full z-0">
          <div
            className={
              "relative flex items-center justify-center shadow rounded cursor-pointer bg-green w-full h-full"
            }
          >
            <span className="text-white font-bold text-2xl -mb-1">{tableNum}</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default Table;
