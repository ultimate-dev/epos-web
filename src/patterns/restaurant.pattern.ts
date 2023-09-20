import { StatusType, LocaleCodesType } from "./_.pattren";
import { CategoryPattern } from "./category.pattern";
import { ProductPattern } from "./product.pattern";
import { TablePattern } from "./table.pattern";
import { OrderPattern } from "./order.pattern";
import { TranslationPattern } from "./translation.pattern";
import { SupplierPattern } from "./supplier.pattern";
import { UserPattern } from "./user.pattern";

export class RestaurantPattern {
  id: number;
  name: string;
  locale: LocaleCodesType;
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;

  users: UserPattern[];
  categories: CategoryPattern[];
  products: ProductPattern[];
  tables: TablePattern[];
  orders: OrderPattern[];
  translations: TranslationPattern[];
  supplierId: number;
  supplier: SupplierPattern;
}
