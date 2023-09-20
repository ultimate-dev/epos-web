import { useEffect, useState } from "react";
import _ from "lodash";
import moment from "moment";
import { observer } from "mobx-react-lite";
// Components
import DateRange from "components/DateRange";
import Order from "components/Order";
import Ripple from "components/Ripple";
import Select from "components/Select";
import AreaRepport from "components/AreaRepport";
import { Loader } from "components/Loading";
// Services
import { generateTableName } from "services/table.service";
import { match } from "services/_.service";
// i18n
import i18n from "i18n";
// Patterns
import { OrderPattern } from "patterns/order.pattern";
// Store
import IStore from "store/instant.store";
// Controllers
import OrderController from "controllers/order.controller";
// Constants
import { OrderStatusColor } from "constants/colors";
import PaymentController from "controllers/payment.controller";

const OrdersPage = () => {
  let { tables, categories, products } = IStore;
  let [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  let [status, setStatus]: any = useState(0);
  let [orderC] = useState(new OrderController());
  let [paymentC] = useState(new PaymentController());
  useEffect(() => {
    if (products.length) {
      getPastOrders();
      getPastPayments();
    }
  }, [products]);

  const getPastOrders = async () => {
    IStore.showLoader();
    let orders = await orderC.getPostOrders(dateRange);
    IStore.hideLoader();
    orderC.setPastOrders(status, orders);
  };

  const getPastPayments = async () => {
    IStore.showLoader();
    let payments = await paymentC.getPostPayments(dateRange);
    IStore.hideLoader();
    paymentC.setPostPayments(payments);
  };

  return (
    <div className="relative h-full w-full">
      <div className="flex-1 h-full">
        <Loader />
        <div className="w-full h-14 bg-white border-b border-black border-opacity-5 p-2 shadow flex justify-start items-center">
          {/*
          <div className="px-2">
            <Ripple className="flex items-center bg-primary h-10 px-4 rounded">
              <i className="text-white mr-1 ri-chat-history-fill"></i>
              <div className="text-white font-medium -mb-0.5">{i18n.t("button.tableHistory")}</div>
            </Ripple>
  </div>*/}
          <div className="px-2">
            <Select
              defaultValue={status}
              onChange={(e) => setStatus(e.value)}
              options={Object.keys(OrderStatusColor).map((status) => ({
                label: i18n.t("orderStatus." + status),
                value: status,
              }))}
            />
          </div>
          <div className="px-2">
            <DateRange
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={(startDate, endDate) => setDateRange({ startDate, endDate })}
            />
          </div>
          <div className="px-2">
            <Ripple
              className="flex items-center bg-primary h-10 px-4 rounded"
              onClick={getPastOrders}
            >
              <i className="text-white mr-1 ri-search-2-fill"></i>
              <div className="text-white font-medium -mb-0.5">{i18n.t("button.search")}</div>
            </Ripple>
          </div>
        </div>
        <div className="h-full pb-16 flex flex-col p-2 overflow-scroll">
          <div className="w-full">
            <div className="flex flex-col flex-wrap">
              {Object.entries(orderC.pastOrders).length ? (
                Object.entries(orderC.pastOrders).map(([date, orders]: any, index: number) => (
                  <div className="flex flex-wrap border-b pb-2" key={index}>
                    <div className="w-full text-gray-600 text-lg font-medium px-2 mt-2">
                      {moment(date).format("MM.DD.YYYY - dddd")}
                    </div>
                    {orders &&
                      orders.map((order: OrderPattern) => (
                        <div className="w-1/3 p-2" key={order.id}>
                          <div className="w-full bg-white rounded overflow-hidden shadow">
                            <Order
                              tableName={generateTableName(order.tableId, tables, categories)}
                              {...order}
                              payments={_.uniqBy(
                                paymentC.postPayments?.filter(
                                  (payment) =>
                                    order.orderProducts.findIndex(
                                      (orderProduct) =>
                                        payment.paymentItems.findIndex(
                                          (paymentItem) =>
                                            paymentItem.orderProducts.length == 0 ||
                                            orderProduct.paymentItemId == paymentItem.id
                                        ) > -1
                                    ) > -1
                                ),
                                "type"
                              )}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                ))
              ) : (
                <AreaRepport head={i18n.t("repport.notOrderFound")} icon="error-warning" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default observer(OrdersPage);
