import { configure, makeAutoObservable } from "mobx";
import toast from "react-hot-toast";
import _ from "lodash";
// Patterns
import { ProductPattern } from "patterns/product.pattern";
import {
  ModifierGroupPattern,
  ModifierProductPattern,
  ModifierSelectPattern,
} from "patterns/modifier.pattern";
import { OrderPattern, OrderProductPattern } from "patterns/order.pattern";
// Networking
import axios, { APIS } from "networking";
// Services
import { tranlateTolocalization } from "services/locale.service";
// i18n
import i18n from "i18n";
import { IngredientPattern, IngredientStockPattern } from "patterns/ingredient.pattern";

configure({ enforceActions: "never" });

class ProductController {
  search: string | null = null;
  keyboardVisible: boolean = false;
  modal: any = null;
  order: any = {
    totalPrice: 0,
    orderProducts: [],
    status: "CREATED",
    tableId: null,
    id: null,
  };
  scrollActive: string | null = null;

  constructor(tableId?: number, orderId?: number) {
    this.order.tableId = Number(tableId);
    this.order.id = Number(orderId);
    makeAutoObservable(this);
  }

  setOrder = (order: OrderPattern) => (this.order = order);
  setModal = (modal: any) => (this.modal = modal);
  setScrollActive = (scrollActive: string) => (this.scrollActive = scrollActive);

  getProducts = async () => {
    try {
      let { data } = await axios.get(APIS.PRODUCTS.rawValue);
      if (!data.error) return <ProductPattern[]>tranlateTolocalization(data.products).map(
          (product: ProductPattern) => ({
            ...product,
            ingredientStocks: <IngredientStockPattern[]>product.ingredientStocks.map(
              (ingredientStock) => ({
                ...ingredientStock,
                ingredient: <IngredientPattern>(
                  tranlateTolocalization([ingredientStock.ingredient])[0]
                ),
              })
            ),
            modifierGroups: <ModifierGroupPattern[]>tranlateTolocalization(
              product.modifierGroups
            ).map((modifierGroup: ModifierGroupPattern) => ({
              ...modifierGroup,
              modifierProducts: <ModifierProductPattern[]>(
                tranlateTolocalization(modifierGroup.modifierProducts)
              ),
            })),
          })
        );
    } catch (err) {}
    return [];
  };

  setSearch = (search: string | null) => {
    this.search = search;
  };
  setKeyboardVisible = (keyboardVisible: boolean) => {
    this.keyboardVisible = keyboardVisible;
  };

  addOrder = (product: ProductPattern) => {
    if (product.modifierGroups.length)
      this.setModal({
        name: "modifier",
        orderProduct: { modifierSelections: [], product },
      });
    else this.addBasket({ modifierSelections: [], product }, () => {});
  };

  addBasket = (
    basketProduct: { modifierSelections: ModifierSelectPattern[]; product: ProductPattern },
    callback: () => void = () => {}
  ) => {
    if (
      this.controlModifier(basketProduct.product.modifierGroups, basketProduct.modifierSelections)
    ) {
      let item = {
        productId: basketProduct.product.id,
        modifierSelections: basketProduct.modifierSelections
          ? _.orderBy(basketProduct.modifierSelections, ["modifierProductId"], ["asc"])
          : [],
      };
      let basketIndex = this.order.orderProducts.findIndex((baketItem: OrderProductPattern) => {
        return _.isEqual(
          {
            productId: baketItem.productId,
            modifierSelections: baketItem.modifierSelections,
            count: baketItem.count,
          },
          {
            productId: item.productId,
            modifierSelections: item.modifierSelections,
            count: baketItem.count,
          }
        );
      });
      if (basketIndex > -1) {
        this.order.orderProducts[basketIndex].count =
          this.order.orderProducts[basketIndex].count + 1;
        this.setOrder({ ...this.order });
      } else
        this.setOrder({
          ...this.order,
          orderProducts: [...this.order.orderProducts, { ...item, count: 1 }],
        });
      callback();
    }
  };

  controlModifier = (groups: ModifierGroupPattern[], selections: ModifierSelectPattern[]) => {
    let err = false;
    let message = "";
    groups.map((group) => {
      let sets = selections.filter((select) => select.modifierGroupId == group.id);
      if (group.required) {
        message += '"' + group.name + '" ';
        if (sets.length == 0 || !sets) {
          err = true;
          message += i18n.t("modifierSelect.control.fieldRequired");
        } else if (group.min && group.min > sets.length) {
          err = true;
          message += i18n.t("modifierSelect.control.fieldMin");
        } else if (group.max && group.max < sets.length) {
          err = true;
          message += i18n.t("modifierSelect.control.fieldMax");
        }
      }
    });
    if (err) {
      toast.error(message);
      return false;
    } else return true;
  };

  saveItem = (count: number) => {
    this.order.orderProducts[this.modal.index].count = count;
    this.setOrder({ ...this.order });
  };
}

export default ProductController;
