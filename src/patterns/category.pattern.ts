import { ProductPattern } from "./product.pattern";
import { RestaurantPattern } from "./restaurant.pattern";
import { TablePattern } from "./table.pattern";
import { TranslationPattern } from "./translation.pattern";
import { StatusType } from "./_.pattren";

export class CategoryPattern {
  id: number;
  name: string;
  image: string;
  type: CategoryType;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;

  restaurantId: number;
  restourant: RestaurantPattern;
  tables: TablePattern[];
  products: ProductPattern[];
  translations: TranslationPattern[];
}

type CategoryType = "PRODUCT" | "TABLE";
