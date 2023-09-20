import { StatusType } from "./_.pattren";
import { SupplierPattern } from "./supplier.pattern";
import { RestaurantPattern } from "./restaurant.pattern";

export class UserPattern {
  id: number;
  name: string;
  surname: string;
  email: string;
  letters: string;
  password: string;
  gender: GenderType;
  role: UserRoleType;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;

  restaurantId?: number;
  restaurant?: RestaurantPattern;
  supplierId: number;
  supplier: SupplierPattern;
}

type UserRoleType = "SUPERADMIN" | "ADMIN" | "USER";
type GenderType = "MALE" | "FEMALE" | "UNSPECIFIED";
