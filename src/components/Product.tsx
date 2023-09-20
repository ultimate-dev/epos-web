// Components
import Ripple from "./Ripple";
// Patterns
import { ProductPattern } from "patterns/product.pattern";
import { useState } from "react";
import Modal from "./Modal";
import i18n from "i18n";
import { toJS } from "mobx";

class ProductProps extends ProductPattern {
  onClick: () => void;
}
const Product = (props: ProductProps) => {
  console.log(toJS(props.ingredientStocks));
  let { name, image, originalPrice = 0, sellingPrice = 0, onClick, modifierGroups = [] } = props;
  let [modal, setModal] = useState(false);
  return (
    <>
      <Ripple
        className="relative flex flex-col bg-white w-full shadow rounded"
        onClick={() => (onClick ? onClick() : setModal(true))}
      >
        <>
          <img
            draggable={false}
            src={image}
            className="w-full h-40 rounded object-contain bg-gray-200"
          />
          <div className="text-center py-2 font-medium">{name}</div>
          <div className="absolute right-1 top-1 rounded bg-primary px-2 text-white font-medium text-sm">
            {originalPrice == sellingPrice ? (
              <span>{sellingPrice} TL</span>
            ) : (
              <>
                <span className="line-through opacity-60 text-xs mr-1">{originalPrice} TL</span>
                <span>{sellingPrice} TL</span>
              </>
            )}
          </div>
          <div className="absolute right-1 bottom-0.5">
            <Ripple
              className="flex rounded bg-gray-200 px-1 text-gray-400 font-medium text-xl"
              onClick={() => setModal(true)}
            >
              <i className="ri-information-line" />
            </Ripple>
          </div>
          {modifierGroups.length > 0 && (
            <div className="flex absolute left-1 top-1 rounded bg-primary px-1 text-white font-medium text-sm">
              <i className="ri-list-check-2" />
            </div>
          )}
        </>
      </Ripple>
      {modal && <DetailModal product={props} onClose={() => setModal(false)} />}
    </>
  );
};

class DetailModalProps {
  product: ProductProps;
  onClose: () => void;
}
const DetailModal = ({ product, onClose = () => {} }: DetailModalProps) => {
  return (
    <Modal
      buttons={[
        {
          text: i18n.t("button.close"),
          color: "gray-200",
          textColor: "gray-600",
          block: true,
          onClick: () => {
            onClose();
          },
        },
      ]}
      onClose={onClose}
    >
      <div className="relative mb-4 bg-gray-100 rounded w-full h-56 overflow-hidden">
        <img
          draggable={false}
          src={product.image}
          className="w-full h-full object-contain rounded"
        />
        <div className="absolute right-1 top-1 rounded bg-primary px-2 text-white font-medium text-sm">
          {product.originalPrice == product.sellingPrice ? (
            <span>{product.sellingPrice} TL</span>
          ) : (
            <>
              <span className="line-through opacity-60 text-xs mr-1">
                {product.originalPrice} TL
              </span>
              <span>{product.sellingPrice} TL</span>
            </>
          )}
        </div>
      </div>
      <h4 className="text-xl font-semibold">{product.name}</h4>
      <div className="mb-4 text-sm text-gray-600">{product.description}</div>
      <>
        {product.modifierGroups.length > 0 && (
          <div className="mb-2">
            <div className="mb-1 flex items-center text-gray-600 font-medium">
              <div className="flex items-center justify-center rounded w-4 h-4 bg-primary bg-opacity-20">
                <i className="ri-star-fill text-xs text-primary"></i>
              </div>
              <span className="text-primary text-sm ml-2 -mb-0.5">Seçenekler</span>
            </div>
            <div className="border-t border-black border-opacity-5 pt-2">
              <div className="text-gray-600 font-medium text-sm">
                {product.modifierGroups
                  .map(
                    ({ name, modifierProducts }) =>
                      name +
                      "(" +
                      modifierProducts
                        .map(
                          ({ name, price }) =>
                            name + (price > 0 ? "(" + Number(price).toFixed(2) + "TL)" : "")
                        )
                        .join(" - ") +
                      ")"
                  )
                  .join(", ")}
              </div>
            </div>
          </div>
        )}
        {product.ingredientStocks.length > 0 && (
          <div className="mb-2">
            <div className="mb-1 flex items-center text-gray-600 font-medium">
              <div className="flex items-center justify-center rounded w-4 h-4 bg-primary bg-opacity-20">
                <i className="ri-star-fill text-xs text-primary"></i>
              </div>
              <span className="text-primary text-sm ml-2 -mb-0.5">İçindekiler</span>
            </div>
            <div className="border-t border-black border-opacity-5 pt-2">
              <div className="text-gray-600 font-medium text-sm">
                {product.ingredientStocks
                  .map(
                    ({ quantity, ingredient }) =>
                      ingredient.name +
                      "(" +
                      quantity +
                      " " +
                      i18n.t("quantityType." + ingredient.quantityType) +
                      ")"
                  )
                  .join(", ")}
              </div>
            </div>
          </div>
        )}
      </>
    </Modal>
  );
};
export default Product;
