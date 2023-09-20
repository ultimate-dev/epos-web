import { StatusType } from "./_.pattren";
import { CategoryPattern } from "./category.pattern";
import { OrderPattern } from "./order.pattern";
import { RestaurantPattern } from "./restaurant.pattern";

export class TablePattern {
  id: number;
  tableNum: number;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;

  restaurantId: number;
  restourant: RestaurantPattern;
  categoryId: number;
  category: CategoryPattern;
  orders: OrderPattern[];
}
