// Pattenrs
import { ProductPattern } from "patterns/product.pattern";

export const searchProducts = (search: string | null, products: ProductPattern[]) => {
  try {
    return products.filter(
      (product) => !search || String(product.name).toLocaleLowerCase().indexOf(search) > -1
    );
  } catch (err) {}
  return [];
};
