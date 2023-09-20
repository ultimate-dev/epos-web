// Components
import Ripple from "./Ripple";
import AreaRepport from "./AreaRepport";
// i18n
import i18n from "i18n";
// Patterns
import { ModifierSelectPattern } from "patterns/modifier.pattern";
import { OrderProductPattern } from "patterns/order.pattern";
// Services
import { calcTotalModifierSelect } from "services/order.service";

class ProductTableProps {
  products: OrderProductPattern[];
  onItemClick: (index: number) => void;
}
const ProductTable = ({ products = [], onItemClick = () => {} }: ProductTableProps) => {
  return (
    <div className="flex flex-col w-full">
      <div className="sticky left-0 top-0 z-20 bg-gray-100 flex border-b border-black border-opacity-5 font-medium text-sm text-gray-600">
        <span className="flex flex-col items-start justify-center px-3 py-1 flex-1 border-r border-black border-opacity-5">
          <span className="-mb-0.5">{i18n.t("productTable.product")}</span>
        </span>
        <span className="flex items-center justify-center py-1 px-3 w-[80px] border-r border-black border-opacity-5">
          <span className="-mb-0.5">{i18n.t("productTable.quantity")}</span>
        </span>
        <span className="flex items-center justify-end py-1 px-3 w-[100px]">
          <span className="-mb-0.5">{i18n.t("productTable.price")}</span>
        </span>
      </div>

      {products.length ? (
        products.map((item, index: number) => (
          <Item key={index} {...item} onClick={() => onItemClick(index)} />
        ))
      ) : (
        <AreaRepport icon="menu-add" />
      )}
    </div>
  );
};
class ItemProps extends OrderProductPattern {
  count: number;
  modifierSelections: ModifierSelectPattern[];
  onClick: () => void;
}
const Item = ({ product, count, modifierSelections, onClick = () => {} }: ItemProps) => {
  return (
    <div>
      <Ripple className="flex flex-col" onClick={onClick}>
        <>
          <div className="flex border-b border-black border-opacity-5 font-medium">
            <span className="flex flex-col items-start justify-center py-2 px-3 flex-1 border-r border-black border-opacity-5">
              <div className="text-primary text-sm">{product.name}</div>
              <div className="text-xs">
                {product.originalPrice == product.sellingPrice ? (
                  <span>{Number(product.sellingPrice).toFixed(2)} TL</span>
                ) : (
                  <>
                    <span className="mr-2 line-through text-gray-400">
                      {Number(product.originalPrice).toFixed(2)} TL
                    </span>
                    <span>{Number(product.sellingPrice).toFixed(2)} TL</span>
                  </>
                )}
              </div>
            </span>
            <span className="flex flex-col items-center justify-center py-2 px-3 w-[80px] border-r border-black border-opacity-5">
              <span className="-mb-1">{Number(count).toFixed(2)}</span>
              <span className="text-xs text-gray-400">
                {i18n.t(`quantityType.${product.quantityType}`)}
              </span>
            </span>
            <span className="flex items-center justify-end py-2 px-3 w-[100px] text-green">
              <span className="-mb-1">
                {Number(count * product.sellingPrice).toFixed(2)} TL
              </span>
            </span>
          </div>
          {product.modifierGroups.map((modifierGroup, index: number) => {
            let _modifierSelections = modifierSelections.filter(
              (select) => select.modifierGroupId == modifierGroup.id
            );
            return (
              <div
                className="flex items-center border-b border-black border-opacity-5 text-xs py-1 px-3"
                key={index}
              >
                <i className="ri-add-fill text-gray-400 mr-1" />
                <div className="flex flex-col pl-1 w-full">
                  <span className="w-full flex justify-between items-center text-primary mb-0.5">
                    <span className="-mb-1">{modifierGroup.name}</span>
                    <span className="text-green -mb-1">
                      {calcTotalModifierSelect(_modifierSelections, [modifierGroup]) + " TL"}
                    </span>
                  </span>
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
        </>
      </Ripple>
    </div>
  );
};
export default ProductTable;
