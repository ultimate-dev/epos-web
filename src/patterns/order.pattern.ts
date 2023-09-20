import { ModifierSelectPattern } from "./modifier.pattern";
import { PaymentItemPattern } from "./payment.pattern";
import { ProductPattern } from "./product.pattern";
import { RestaurantPattern } from "./restaurant.pattern";
import { TablePattern } from "./table.pattern";

export class OrderPattern {
  id: number;
  note: string;
  groupId: string;
  completed: boolean;
  status: OrderStatusType;
  totalPrice: number;
  data: OrderPattern;
  orderDate: Date;
  createdAt: Date;
  updatedAt: Date;

  orderProducts: OrderProductPattern[];
  tableId: number;
  table: TablePattern;
  restaurantId: number;
  restourant: RestaurantPattern;
}

export class OrderProductPattern {
  id: number;
  count: number;
  status: OrderProductStatusType;
  createdAt: Date;
  updatedAt: Date;
  orderId: number;
  order: OrderPattern;
  productId: number;
  product: ProductPattern;
  paymentItemId?: number;
  paymentItem?: PaymentItemPattern;
  modifierSelections: ModifierSelectPattern[];
}

export type OrderStatusType =
  | "CREATED"
  | "PREPARING"
  | "READY"
  | "PAID"
  | "ONTHEWAY"
  | "COMPLATED"
  | "CANCELLED"
  | "RETURNED";

export type OrderProductStatusType = "WAITING" | "APPROVED";
