import { StatusType } from "./_.pattren";
import { ProductPattern, QuantityTypesType } from "./product.pattern";
import { TranslationPattern } from "./translation.pattern";
import { IngredientPattern, IngredientStockPattern } from "./ingredient.pattern";
import { RestaurantPattern } from "./restaurant.pattern";

export class StockPattern {
  id: number;
  quantity: number;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;

  ingredientStockId: number;
  ingredientStock: IngredientStockPattern;
  ingredientId: number;
  ingredient: IngredientPattern;
  stockCodeId: number;
  stockCode: StockCodePattern;
  restaurantId: number;
  restaurant: RestaurantPattern;
}

export class StockCodePattern {
  id: number;
  name: String;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
  stokcs: StockPattern[];
  ingredientStock: IngredientStockPattern[];
  restaurantId: number;
  restaurant: RestaurantPattern;
}
