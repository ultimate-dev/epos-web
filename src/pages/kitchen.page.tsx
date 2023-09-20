import { useState } from "react";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
// Components
import Order from "components/Order";
import AreaRepport from "components/AreaRepport";
import { Loader } from "components/Loading";
// Services
import { filterOrderStatus } from "services/order.service";
import { generateTableName } from "services/table.service";
import { match } from "services/_.service";
// i18n
import i18n from "i18n";
// Store
import IStore from "store/instant.store";
// Controllers
import OrderController from "controllers/order.controller";

const KitchenPage = () => {
  let navigate = useNavigate();
  let { categories, products, tables } = IStore;

  let orders = filterOrderStatus(IStore.orders, ["CREATED", "PREPARING", "READY"]).map((order) => ({
    ...order,
    orderProducts: match(order.orderProducts, products, {
      name: "productId",
      path: "product",
    }),
  }));
  let [c] = useState(new OrderController());

  return (
    <div className="relative h-full w-full">
      <div className="flex-1 h-full">
        <div className="h-full pb-16 flex flex-col p-2 overflow-scroll">
          <div className="w-full">
            <div className="flex flex-wrap">
              {orders.length > 0 ? (
                orders.map((order, index: number) => (
                  <div key={index} className="w-1/3 p-2">
                    <div className="relative w-full bg-white rounded overflow-hidden shadow">
                      <Loader areaId={order.id} />
                      <Order
                        tableName={generateTableName(order.tableId, tables, categories)}
                        {...order}
                        orderProducts={order.orderProducts}
                        onClick={() => navigate("/products/" + order.tableId + "/" + order.id)}
                        minimize
                        kitchen
                        approveOrder={() => c.onApproveOrder(order, () => {})}
                        readyOrderProduct={(orderProduct) =>
                          c.onReadyOrderProduct(orderProduct, () => {})
                        }
                      />
                    </div>
                  </div>
                ))
              ) : (
                <AreaRepport head={i18n.t("repport.notActiveOrderFound")} icon="error-warning" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default observer(KitchenPage);
