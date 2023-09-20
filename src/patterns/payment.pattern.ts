import { OrderProductPattern } from "./order.pattern";
import { RestaurantPattern } from "./restaurant.pattern";
import { StatusType } from "./_.pattren";

export class PaymentPattern {
  id: string;
  groupId: string;
  type: PaymentType;
  totalPrice: number;
  status: StatusType;

  createdAt: Date;
  updatedAt: Date;

  expenseTypeId?: number;
  expenseType?: ExpenseTypePattern;
  restaurantId: number;
  restourant: RestaurantPattern;
  paymentItems: PaymentItemPattern[];
}

export class PaymentItemPattern {
  id: number;
  status: StatusType;
  price: number;
  paymentId: string;
  payment: PaymentPattern;
  orderProducts: OrderProductPattern[];

  createdAt: Date;
  updatedAt: Date;
}

export class ExpenseTypePattern {
  id: number;
  name: string;
  status: StatusType;

  createdAt: Date;
  updatedAt: Date;

  restaurantId: number;
  restourant: RestaurantPattern;
  payments: PaymentPattern[];
}

export type PaymentType = "CASH" | "CREDIT" | "CHANGE" | "DISCOUNT" | "RETURNED" | "CANCELLED";
