import _ from "lodash";
import { configure, makeAutoObservable } from "mobx";
// Networking
import axios, { APIS } from "networking";
// Patterns
import { OrderPattern, OrderProductPattern, OrderStatusType } from "patterns/order.pattern";
import { tranlateTolocalization } from "services/locale.service";
// Store
import IStore from "store/instant.store";

configure({ enforceActions: "never" });

class OrderController {
  pastOrders: object = {};

  constructor() {
    makeAutoObservable(this);
  }

  setPastOrders = (status: OrderStatusType | 0, orders: OrderPattern[]) =>
    (this.pastOrders = this.generateGroupPastOrders(status, orders));

  generateGroupPastOrders = (status: OrderStatusType | 0, orders: OrderPattern[]) => {
    return _.groupBy(
      orders.filter((order) => (status ? order.status == status : true)),
      (item) => String(item.orderDate).split("T")[0]
    );
  };

  getOrders = async (dateRange?: { startDate: Date; endDate: Date }) => {
    try {
      let { data } = await axios.get(APIS.ORDERS.rawValue, { params: dateRange });
      if (!data.error) return <OrderPattern[]>_.orderBy(data.orders, ["orderDate"], ["desc"]);
    } catch (err) {}
    return [];
  };

  getPostOrders = async (dateRange?: { startDate: Date; endDate: Date }) => {
    try {
      let { data } = await axios.get(APIS.ORDER_POSTS.rawValue, { params: dateRange });
      if (!data.error) return <OrderPattern[]>_.orderBy(
          data.orders.map((order: OrderPattern) => ({
            ...order,
            orderProducts: order.orderProducts.map((orderProduct) => ({
              ...orderProduct,
              product: tranlateTolocalization([orderProduct.product])[0],
            })),
          })),
          ["orderDate"],
          ["desc"]
        );
    } catch (err) {}
    return [];
  };

  saveOrder = async (order: OrderPattern, cb: (err: boolean) => void) => {
    try {
      IStore.showLoader();
      let { data } = await axios.post(APIS.ORDERS.rawValue, { ...order });
      IStore.hideLoader();
      cb(data.error);
    } catch (err) {}
  };

  onTransferOrder = async (
    transferTable: {
      source: { tableId: number; tableName: string } | null;
      target: { tableId: number; tableName: string } | null;
    } | null,
    callback: (err: boolean) => void
  ) => {
    try {
      IStore.showLoader();
      let { data } = await axios.post(APIS.ORDER_TRANSFER.rawValue, { ...transferTable });
      IStore.hideLoader();
      if (!data.error) {
        callback(false);
      } else callback(true);
    } catch (err) {
      callback(true);
    }
  };

  onApproveOrder = async (order: OrderPattern, callback: (err: boolean) => void) => {
    try {
      IStore.showLoader(order.id);
      let { data } = await axios.post(APIS.ORDER_APPROVE.rawValue, { ...order });
      IStore.hideLoader();
      if (!data.error) {
        callback(false);
      } else callback(true);
    } catch (err) {
      callback(true);
    }
  };

  onReadyOrderProduct = async (
    orderProduct: OrderProductPattern,
    callback: (err: boolean) => void
  ) => {
    try {
      IStore.showLoader(orderProduct.orderId);
      let { data } = await axios.post(APIS.ORDER_READY.rawValue, { ...orderProduct });
      IStore.hideLoader();
      if (!data.error) {
        callback(false);
      } else callback(true);
    } catch (err) {
      callback(true);
    }
  };

  onCompleted = async (tableId: number, callback: (err: boolean) => void) => {
    try {
      IStore.showLoader();
      let { data } = await axios.post(APIS.ORDER_COMPLETED.rawValue, { tableId });
      IStore.hideLoader();
      if (!data.error) {
        callback(false);
      } else callback(true);
    } catch (err) {
      callback(true);
    }
  };
}

export default OrderController;
