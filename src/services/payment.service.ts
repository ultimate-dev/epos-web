import { OrderPattern, OrderProductPattern } from "patterns/order.pattern";
import { PaymentPattern } from "patterns/payment.pattern";

export const filterOrderPayment = (
  orders: OrderPattern[],
  control: (orderProduct: OrderProductPattern) => boolean
) => {
  return orders
    .map((order) => ({
      ...order,
      orderProducts: order.orderProducts.filter(control),
    }))
    .filter((order) => order.orderProducts.length > 0);
};
