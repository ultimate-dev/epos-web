import { StatusType } from "./_.pattren";
import { UserPattern } from "./user.pattern";
import { RestaurantPattern } from "./restaurant.pattern";

export class SupplierPattern {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  status: StatusType;

  restaurants: RestaurantPattern[];
  users: UserPattern[];
}
