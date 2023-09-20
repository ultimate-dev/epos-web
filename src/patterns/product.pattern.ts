import { StatusType } from "./_.pattren";
import { CategoryPattern } from "./category.pattern";
import { RestaurantPattern } from "./restaurant.pattern";
import { OrderProductPattern } from "./order.pattern";
import { ModifierGroupPattern } from "./modifier.pattern";
import { IngredientPattern, IngredientStockPattern } from "./ingredient.pattern";
import { TranslationPattern } from "./translation.pattern";

export class ProductPattern {
  id: number;
  name: string;
  image: string;
  description?: string;
  originalPrice: number;
  sellingPrice: number;
  quantityType: QuantityTypesType;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
  restaurantId: number;
  restourant: RestaurantPattern;
  categoryId: number;
  category: CategoryPattern;
  modifierGroups: ModifierGroupPattern[];
  ingredientStocks: IngredientStockPattern[];
  orderProducts: OrderProductPattern[];
  translations: TranslationPattern[];
}
export type QuantityTypesType = "PIECE" | "PORTION" | "KILOGRAM" | "GRAM";
