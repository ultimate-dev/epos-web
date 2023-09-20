import i18n from "i18n";
import { OrderProductPattern } from "patterns/order.pattern";
import { calcTotalModifierSelect, calcTotalPrice } from "services/order.service";
import Ripple from "./Ripple";

class ProductItemProps extends OrderProductPattern {
  onClick?: () => void;
}
const ProductItem = (props: ProductItemProps) => {
  let { onClick = () => null, product, count, modifierSelections, paymentItemId } = props;
  return (
    <div className={"relative w-full" + (paymentItemId ? " opacity-50" : "")}>
      {paymentItemId && <div className={"striping z-10"} />}
      <Ripple className="" onClick={onClick}>
        <div className="w-full flex flex-col border-b border-opacity-5 border-black">
          <div className="w-full flex items-center">
            <div className="px-3 py-1 flex-1 h-full flex flex-col items-start justify-center border-r border-opacity-5 border-black">
              <div className="font-semibold text-primary text-sm">{product.name}</div>
              <div className="text-xs font-medium opacity-80">
                {product.originalPrice == product.sellingPrice ? (
                  <span>{Number(product.sellingPrice).toFixed(2) + " TL"}</span>
                ) : (
                  <div className="flex">
                    <span className="line-through opacity-60">
                      {Number(product.originalPrice).toFixed(2) + " TL"}
                    </span>
                    <span className="ml-1">{Number(product.sellingPrice).toFixed(2) + " TL"}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="px-3 py-1 w-16 h-full flex items-center justify-center border-r border-opacity-5 border-black">
              <div className="font-semibold">{Number(count).toFixed(2)}</div>
            </div>
            <div className="px-3 py-1 w-28 h-full flex items-center justify-end text-green-400">
              <div className="font-medium">
                {Number(calcTotalPrice([props])).toFixed(2) + " TL"}
              </div>
            </div>
          </div>
          <div className="flex flex-col text-xs">
            {product.modifierGroups.map((modifierGroup) => {
              let _modifierSelections = modifierSelections.filter(
                (select) => select.modifierGroupId == modifierGroup.id
              );
              return (
                <div className="px-3 py-1 flex items-start my-0.5 border-t border-opacity-5 border-black">
                  <i className="block ri-add-fill text-gray-400 mr-1 mt-1" />
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between w-full">
                      <span className="text-primary mb-0.5">
                        <span className="block -mb-1">{modifierGroup.name}</span>
                      </span>
                      <span className="text-gray-400 -mb-1">
                        {calcTotalModifierSelect(_modifierSelections, [modifierGroup]) + " TL"}
                      </span>
                    </div>
                    <span className="text-gray-400">
                      <span className="block -mb-1">
                        {_modifierSelections.length > 0
                          ? _modifierSelections
                              .map((select) => {
                                let f = modifierGroup.modifierProducts.find(
                                  (selectProduct) => selectProduct.id == select.modifierProductId
                                );
                                return (
                                  f?.name +
                                  (f && f?.price > 0
                                    ? "(" + Number(f?.price).toFixed(2) + " TL)"
                                    : "")
                                );
                              })
                              .join(", ")
                          : i18n.t(`NOCHOICE`)}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Ripple>
    </div>
  );
};
export default ProductItem;
