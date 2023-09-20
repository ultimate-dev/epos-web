import Ripple from "components/Ripple";

class TableHeadProps {
  tableName: string;
  tab: string;
  onClickOne: (tab: string) => void;
  onClickTwo: (tab: string) => void;
}
const TableHead = ({ tableName, tab, onClickOne, onClickTwo }: TableHeadProps) => {
  return (
    <div className="absolute bg-white top-0 left-0 w-full flex items-center justify-between h-14 border-b border-black border-opacity-5">
      <div className="flex items-center pl-3">
        <div className="font-semibold text-lg -mb-1">#{tableName}</div>
      </div>
      <div className="flex h-full p-2">
        <Ripple
          className={
            "flex items-center px-6 rounded-tl rounded-bl" +
            (tab == "new" || tab == "edit" ? " bg-primary" : " bg-primary bg-opacity-10 ")
          }
          onClick={() => onClickOne(tab)}
        >
          <div
            className={
              "text-sm font-medium -mb-0.5" +
              (tab == "new" || tab == "edit" ? " text-white" : " text-primary")
            }
          >
            {tab == "edit" ? "DÜZENLE" : "YENİ"}
          </div>
        </Ripple>
        <Ripple
          className={
            "flex items-center px-6 rounded-tr rounded-br" +
            (tab == "bill" ? " bg-primary" : " bg-primary bg-opacity-10 ")
          }
          onClick={() => onClickTwo(tab)}
        >
          <div
            className={
              "text-sm font-medium -mb-0.5" + (tab == "bill" ? " text-white" : " text-primary")
            }
          >
            HESAP
          </div>
        </Ripple>
      </div>
    </div>
  );
};

export default TableHead;
