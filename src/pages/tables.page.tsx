import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Element, Link, scroller } from "react-scroll";
import _ from "lodash";
import { DragDropContext, Draggable, Droppable, resetServerContext } from "react-beautiful-dnd";
import { observer } from "mobx-react-lite";
// Components
import Category from "components/Category";
import Table from "components/Table";
import SubHead from "components/SubHead";
import Order from "components/Order";
import Modal from "components/Modal";
import AreaRepport from "components/AreaRepport";
import { Loader } from "components/Loading";
// Services
import { generateTableName } from "services/table.service";
import { filterOrderStatus } from "services/order.service";
import { match } from "services/_.service";
// i18n
import i18n from "i18n";
// Store
import IStore from "store/instant.store";
// Controllers
import TableController from "controllers/table.controller";
import OrderController from "controllers/order.controller";

const scrollOptions = {
  spy: true,
  duration: 400,
  smooth: "easeInOutQuint",
  containerId: "tables",
};

const TablesPage = () => {
  let navigate = useNavigate();
  let { categories, tables, orders, products } = IStore;
  let [c] = useState(new TableController());

  useEffect(() => {
    resetServerContext();
  }, [tables, orders]);

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-0 top-0 h-full w-[400px] bg-white border-r border-black border-opacity-5 shadow">
        <div className="flex flex-col w-full h-full overflow-auto">
          {orders.length ? (
            orders.map((order, index: number) => (
              <div key={index} className="w-full border-b border-opacity-5 border-black">
                <Order
                  tableName={generateTableName(order.tableId, tables, categories)}
                  {...order}
                  minimize
                  orderProducts={match(order.orderProducts, products, {
                    name: "productId",
                    path: "product",
                  })}
                  onClick={() => navigate("/products/" + order.tableId + "/" + order.id)}
                />
              </div>
            ))
          ) : (
            <AreaRepport head={i18n.t("repport.notActiveOrderFound")} icon="error-warning" />
          )}
        </div>
      </div>
      <div className="flex-1 h-full pl-[400px]">
        <div className="w-full h-14 bg-white border-b border-black border-opacity-5 p-2 shadow flex overflow-x-auto">
          {categories
            .filter((category) => category.tables.length > 0)
            .map((category, index: number) => (
              <Fragment key={index}>
                <Link
                  to={"T-" + category.id}
                  className="none"
                  onSetActive={(e) => c.setScrollActive(e)}
                  {...scrollOptions}
                />
                <Category
                  key={index}
                  onClick={() => {
                    scroller.scrollTo("T-" + category.id, {
                      ...scrollOptions,
                      offset: 10,
                    });
                  }}
                  active={
                    (index == 0 && c.scrollActive == null) || c.scrollActive == "T-" + category.id
                  }
                  {...category}
                  badge={
                    Object.keys(
                      _.groupBy(
                        filterOrderStatus(orders, [
                          "CREATED",
                          "PREPARING",
                          "READY",
                          "PAID",
                          "ONTHEWAY",
                          "COMPLATED",
                        ]),
                        "tableId"
                      )
                    ).filter(
                      (tableId) =>
                        category.tables.findIndex((table) => parseInt(tableId) == table.id) > -1
                    ).length
                  }
                />
              </Fragment>
            ))}
        </div>
        <div id="tables" className="h-full pb-16 flex flex-col p-2 overflow-scroll">
          <DragDropContext
            onDragStart={(e) =>
              c.setTransferTable({
                source: {
                  tableId: parseInt(e.source.droppableId.split(",")[0]),
                  tableName: e.source.droppableId.split(",")[1],
                },
                target: null,
              })
            }
            onDragEnd={(e) =>
              e.destination && c.transferTable
                ? c.setTransferTable({
                    ...c.transferTable,
                    target: {
                      tableId: parseInt(e.destination.droppableId.split(",")[0]),
                      tableName: e.destination.droppableId.split(",")[1],
                    },
                  })
                : c.setTransferTable(null)
            }
          >
            {categories.length ? (
              categories
                .filter((category) => category.tables.length > 0)
                .map((category, index: number) => (
                  <Element name={"T-" + category.id} key={index}>
                    <div key={index} className="w-full">
                      <SubHead head={category.name} badge={category.tables.length} />
                      <div className="flex flex-wrap">
                        {match(category.tables, tables, { name: "id" }).map(
                          (table, index: number) => {
                            let tableActive =
                              filterOrderStatus(orders, [
                                "CREATED",
                                "PREPARING",
                                "READY",
                                "PAID",
                                "ONTHEWAY",
                                "COMPLATED",
                              ]).filter((order) => order.tableId == table.id).length > 0;
                            let dragdropId = table.id + "," + category.name + "-" + table.tableNum;
                            return (
                              <Droppable
                                mode="standard"
                                key={index}
                                droppableId={dragdropId}
                                isDropDisabled={tableActive}
                              >
                                {(dropProvided, dropSnapshot) => (
                                  <Draggable
                                    key={dragdropId}
                                    draggableId={dragdropId}
                                    index={index}
                                    disableInteractiveElementBlocking={true}
                                  >
                                    {(dragProvided) => (
                                      <Table
                                        drop={dropProvided}
                                        drag={dragProvided}
                                        active={tableActive}
                                        over={dropSnapshot.isDraggingOver}
                                        key={index}
                                        {...table}
                                        onClick={(active) =>
                                          active
                                            ? navigate("/products/" + table.id)
                                            : navigate("/products/" + table.id + "/new")
                                        }
                                        transferTable={c.transferTable}
                                        onTransferClick={() =>
                                          c.transferTable
                                            ? c.transferTable.source &&
                                              c.transferTable.source.tableId == table.id
                                              ? c.setTransferTable(null)
                                              : c.setTransferTable({
                                                  ...c.transferTable,
                                                  target: {
                                                    tableId: parseInt(table.id),
                                                    tableName: category.name + "-" + table.tableNum,
                                                  },
                                                })
                                            : c.setTransferTable({
                                                source: {
                                                  tableId: parseInt(table.id),
                                                  tableName: category.name + "-" + table.tableNum,
                                                },
                                                target: null,
                                              })
                                        }
                                      />
                                    )}
                                  </Draggable>
                                )}
                              </Droppable>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </Element>
                ))
            ) : (
              <AreaRepport head={i18n.t("repport.notFountInformation")} icon="error-warning" />
            )}
          </DragDropContext>
        </div>
        {c.transferTable && c.transferTable.source && c.transferTable.target && (
          <TransferTableModal
            transferTable={c.transferTable}
            setTransferTable={c.setTransferTable}
          />
        )}
      </div>
    </div>
  );
};
class TransferTableProps {
  source: { tableId: number; tableName: string } | null;
  target: { tableId: number; tableName: string } | null;
}
class TransferTableModalProps {
  transferTable: TransferTableProps | null;
  setTransferTable: (transferTable: TransferTableProps | null) => void;
}
const TransferTableModal = ({
  transferTable = null,
  setTransferTable = () => {},
}: TransferTableModalProps) => {
  let [orderC] = useState(new OrderController());

  return (
    <Modal
      buttons={[
        {
          text: i18n.t("button.save"),
          color: "primary",
          textColor: "white",
          block: true,
          onClick: () => orderC.onTransferOrder(transferTable, () => setTransferTable(null)),
        },
        {
          text: i18n.t("button.cancel"),
          color: "gray-100",
          textColor: "gray-600",
          onClick: () => setTransferTable(null),
        },
      ]}
      onClose={() => setTransferTable(null)}
    >
      <>
        <Loader />
        <div className="w-full flex items-center -m-2 text-lg">
          <div className="flex-1 bg-primary text-white m-2 py-4 rounded text-center">
            <div className="-mb-0.5">#{transferTable?.source?.tableName}</div>
          </div>
          <div className="mx-2 text-gray-300 -mb-0.5">
            <i className="ri-arrow-left-right-fill" />
          </div>
          <div className="flex-1 bg-green text-white m-2 py-4 rounded text-center">
            <div className="-mb-0.5">#{transferTable?.target?.tableName}</div>
          </div>
        </div>
        <div className="text-center mt-3 text-gray-600">{i18n.t("modal.tableTransfer")}</div>
      </>
    </Modal>
  );
};

export default observer(TablesPage);
