import { LocaleCodesType } from "./_.pattren";
import { CategoryPattern } from "./category.pattern";
import { ModifierGroupPattern, ModifierProductPattern } from "./modifier.pattern";
import { ProductPattern } from "./product.pattern";
import { RestaurantPattern } from "./restaurant.pattern";

export class TranslationPattern {
  id: number;
  code: LocaleCodesType;
  area: string;
  translate: string;
  createdAt: Date;
  updatedAt: Date;

  productId?: number;
  product?: ProductPattern;
  categoryId?: number;
  category?: CategoryPattern;
  modifierGroupId?: number;
  modifierGroup?: ModifierGroupPattern;
  modifierProductId?: number;
  modifierProduct?: ModifierProductPattern;
  restaurantId: number;
  restourant: RestaurantPattern;
}
