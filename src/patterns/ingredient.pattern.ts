import { StatusType } from "./_.pattren";
import { ProductPattern, QuantityTypesType } from "./product.pattern";
import { TranslationPattern } from "./translation.pattern";
import { RestaurantPattern } from "./restaurant.pattern";
import { StockCodePattern, StockPattern } from "./stock.pattern";
import { ModifierProductPattern } from "./modifier.pattern";

export class IngredientPattern {
  id: number;
  name: string;
  barcode: string;
  quantityType: QuantityTypesType;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
  translations: TranslationPattern[];
  ingredientStock: IngredientStockPattern[];
  stokcs: StockPattern[];
  restaurantId: number;
  restaurant: RestaurantPattern;
}

export class IngredientStockPattern {
  id: number;
  quantity: number;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;

  stockCodeId: number;
  stockCode: StockCodePattern;
  productId: number;
  product: ProductPattern;
  modifierProductId: number;
  modifierProduc: ModifierProductPattern;
  ingredientId: number;
  ingredient: IngredientPattern;
  stokcs: StockPattern[];
}
