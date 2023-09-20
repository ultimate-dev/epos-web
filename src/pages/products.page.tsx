import { forwardRef, Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import _ from "lodash";
import { Element, Link, scroller } from "react-scroll";
import { observer } from "mobx-react-lite";
// Components
import Category from "components/Category";
import Product from "components/Product";
import Ripple from "components/Ripple";
import SubHead from "components/SubHead";
import Keyboard from "components/Keyboard";
import ProductTable from "components/ProductTable";
import Modal from "components/Modal";
import CheckBox from "components/CheckBox";
import Select from "components/Select";
import AreaRepport from "components/AreaRepport";
import { Loader } from "components/Loading";
// Services
import { searchProducts } from "services/product.service";
import { generateTableName } from "services/table.service";
import { calcTotalPrice, filterOrderStatus } from "services/order.service";
import { match } from "services/_.service";
// Patterns
import { OrderPattern, OrderProductPattern, OrderStatusType } from "patterns/order.pattern";
// i18n
import i18n from "i18n";
// Store
import IStore from "store/instant.store";
// Controller
import ProductController from "controllers/product.controller";
import OrderController from "controllers/order.controller";
// Constants
import { OrderStatusColor } from "constants/colors";
import TableHead from "components/TableHead";
import MStore from "store/main.store";
import { OrderStatus } from "constants/statuses";

const scrollOptions = {
  spy: true,
  duration: 400,
  smooth: "easeInOutQuint",
  containerId: "products",
};

const ProductsPage = () => {
  let { tableId, orderId }: any = useParams();
  let navigate = useNavigate();
  let { categories, products, tables, orders } = IStore;

  let [c] = useState(new ProductController(tableId, orderId !== "new" ? orderId : null));
  let [orderC] = useState(new OrderController());

  useEffect(() => {
    if (orders.length > 0 && orderId && orderId !== "new")
      c.setOrder({
        ...JSON.parse(JSON.stringify(orders.find((order: OrderPattern) => order.id == orderId))),
        tableId: parseInt(tableId),
      });
  }, [tableId, orderId, orders]);

  let [openNote, setOpenNote]: any = useState(null);

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-0 top-0 h-full w-[400px] bg-white border-r border-black border-opacity-5 shadow">
        <div className="relative flex flex-col w-full h-full pt-14">
          {tableId ? (
            <>
              <Loader />
              <TableHead
                tableName={generateTableName(tableId, tables, categories)}
                tab={orderId == "new" ? "new" : "edit"}
                onClickOne={(tab) =>
                  navigate(`/products/${tableId}/${tab == "new" ? "new" : orderId}`)
                }
                onClickTwo={(tab) => navigate(`/products/${tableId}`)}
              />
              <div className="flex-1 overflow-auto">
                <ProductTable
                  products={match(
                    c.order?.orderProducts?.filter((item: OrderProductPattern) => item.count > 0),
                    products,
                    { name: "productId", path: "product" }
                  )}
                  onItemClick={(index) => c.setModal({ name: "count", index })}
                />
              </div>
              <div className="flex flex-wrap items-center justify-center p-2 pb-0 border-t border-opacity-5 border-black">
                {MStore.settings.orderStatusSelection == "multiple" &&
                  Object.keys(OrderStatusColor).map((status, index) => (
                    <Status
                      key={index}
                      active={c.order.status == status}
                      name={i18n.t(`orderStatus.${status}`)}
                      color={Object.values(OrderStatusColor)[index]}
                      onClick={() => c.setOrder({ ...c.order, status })}
                    />
                  ))}
                {MStore.settings.orderStatusSelection == "inLine" && (
                  <StatusButton
                    status={c.order.status}
                    onClick={() => {
                      let inLineStatus = [
                        OrderStatus.CREATED,
                        OrderStatus.PREPARING,
                        OrderStatus.READY,
                        OrderStatus.PAID,
                        OrderStatus.COMPLATED,
                      ];
                      let index = inLineStatus.findIndex((status) => c.order.status == status);
                      if (index > -1 && inLineStatus.length - 1 > index)
                        c.setOrder({ ...c.order, status: inLineStatus[index + 1] });
                    }}
                  />
                )}
              </div>
              <div className="relative p-2 pb-8">
                <SaveButton
                  disabled={
                    c.order.orderProducts.filter((item: OrderProductPattern) => item.count > 0)
                      .length == 0
                  }
                  totalPrice={calcTotalPrice(
                    match(
                      c.order?.orderProducts?.filter((item: OrderProductPattern) => item.count > 0),
                      products,
                      { name: "productId", path: "product" }
                    )
                  )}
                  onClick={(totalPrice) => {
                    orderC.saveOrder(
                      {
                        ...c.order,
                        totalPrice,
                      },
                      (err) => !err && navigate("/tables")
                    );
                  }}
                />
                <NoteArea
                  open={openNote}
                  setOpen={setOpenNote}
                  value={c.order?.note}
                  onChange={(value) => c.setOrder({ ...c.order, note: value })}
                />
              </div>
            </>
          ) : (
            <AreaRepport
              head={i18n.t("repport.selectTableCreateOrder")}
              body={
                <button>
                  <Ripple className="bg-primary rounded" onClick={() => navigate("/tables")}>
                    <span className="text-sm font-medium -mb-0.5 text-white px-4 py-2 uppercase">
                      {i18n.t("routes.tables")}
                    </span>
                  </Ripple>
                </button>
              }
              icon="error-warning"
            />
          )}
        </div>
      </div>

      <div className="flex-1 h-full pl-[400px]">
        <div className="w-full h-14 bg-white border-b border-black border-opacity-5 shadow flex">
          {c.search !== null && (
            <div className="p-2">
              <Ripple
                className={
                  "px-3 h-full rounded flex items-center justify-center" +
                  (c.keyboardVisible ? " bg-gray-100" : "")
                }
                onClick={() => c.setKeyboardVisible(!c.keyboardVisible)}
              >
                <i className="ri-keyboard-line text-xl" />
              </Ripple>
            </div>
          )}
          {c.search == null ? (
            <div className="w-full h-full py-2 px-1 flex overflow-x-auto">
              {categories &&
                categories
                  .filter((category) => category.type == "PRODUCT")
                  .map((category, index: number) => (
                    <Fragment key={index}>
                      <Link
                        to={"P-" + category.id}
                        className="none"
                        onSetActive={(e) => c.setScrollActive(e)}
                        {...scrollOptions}
                      />
                      <Category
                        key={index}
                        onClick={() => {
                          scroller.scrollTo("P-" + category.id, {
                            ...scrollOptions,
                            offset: 10,
                          });
                        }}
                        active={
                          (index == 0 && c.scrollActive == null) ||
                          c.scrollActive == "P-" + category.id
                        }
                        {...category}
                        badge={category.products.length}
                      />
                    </Fragment>
                  ))}
            </div>
          ) : (
            <input
              placeholder="Ara"
              className="w-full h-full px-2 outline-none pt-1"
              value={c.search}
              onChange={(e) => c.setSearch(e.target.value)}
              autoFocus
            />
          )}

          <div className="p-2">
            <Ripple
              className="px-3 h-full rounded flex items-center justify-center text-xl"
              onClick={() => c.setSearch(c.search == null ? "" : null)}
            >
              <i className={c.search == null ? "ri-search-line" : "ri-close-line"} />
            </Ripple>
          </div>
        </div>
        <div className="relative z-10">
          {c.search !== null && c.keyboardVisible && (
            <div className="absolute w-full p-2 bg-white border-b border-black border-opacity-5 shadow">
              <div className="rounded">
                <Keyboard value={c.search} onChange={(value) => c.setSearch(value)} />
              </div>
            </div>
          )}
        </div>
        <div
          id="products"
          className={
            "relative z-5 h-full pb-16 flex flex-col p-2 overflow-scroll" +
            (c.search !== null && c.keyboardVisible ? " pt-[250px]" : "")
          }
        >
          {categories.length ? (
            categories
              .filter((category) => category.type == "PRODUCT")
              .map((category, index: number) => (
                <Element name={"P-" + category.id} key={index}>
                  <div className="w-full" key={index}>
                    <SubHead head={category.name} badge={category.products.length} />
                    <div className="flex flex-wrap">
                      {match(category.products, searchProducts(c.search, products), {
                        name: "id",
                      }).map((product, index: number) => (
                        <div key={index} className={"p-2 w-1/3"}>
                          <Product
                            {...product}
                            onClick={c.order.tableId ? () => c.addOrder(product) : null}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Element>
              ))
          ) : (
            <AreaRepport head={i18n.t("repport.notFountInformation")} icon="error-warning" />
          )}
        </div>
      </div>

      {c.modal && c.modal.name == "modifier" && (
        <ModifierModal
          orderProduct={c.modal.orderProduct}
          setOrderProduct={(orderProduct) => c.setModal({ ...c.modal, orderProduct })}
          onClose={() => c.setModal(null)}
          addBasket={c.addBasket}
        />
      )}
      {c.modal && c.modal.name == "count" && (
        <CountModal
          orderProduct={c.order.orderProducts[c.modal.index]}
          onClose={() => c.setModal(null)}
          saveItem={c.saveItem}
        />
      )}
    </div>
  );
};
class StatusProps {
  name?: string;
  color?: string | unknown;
  active?: boolean;
  onClick?: () => void;
}
const Status = ({ name, color, active, onClick }: StatusProps) => {
  return (
    <div className="m-1">
      <Ripple
        onClick={onClick}
        className={
          "px-2 py-1 rounded" +
          (active
            ? " bg-" + color + " text-white"
            : " bg-opacity-10 bg-" + color + " text-" + color)
        }
      >
        <span className="text-xs font-medium -mb-0.5">{name}</span>
      </Ripple>
    </div>
  );
};
class SaveButtonProps {
  totalPrice?: number;
  onClick?: (totalPrice: number) => void;
  disabled?: boolean;
}
const SaveButton = ({ totalPrice = 0, onClick = () => {}, disabled }: SaveButtonProps) => {
  return (
    <Ripple
      className={"bg-primary rounded" + (disabled ? " bg-opacity-80" : "")}
      onClick={() => onClick(totalPrice)}
      disabled={disabled}
    >
      <div className="flex justify-center items-center p-2 w-full h-full">
        <span className="flex-1 text-white text-center font-medium">{i18n.t("button.save")}</span>
        <div className="flex bg-white rounded py-2 px-4">
          <span className="-mb-0.5 font-semibold text-primary">
            {Number(totalPrice).toFixed(2)} TL
          </span>
        </div>
      </div>
    </Ripple>
  );
};

class NoteAreaProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  onChange: (value: string) => void;
}
const NoteArea = forwardRef(({ open, setOpen, value, onChange }: NoteAreaProps, ref) => {
  return (
    <>
      <div
        className={
          "absolute left-0 w-full h-40 bg-white border-t border-black border-opacity-5 z-20 transition-all duration-200 ease-in-out" +
          (open ? " bottom-0" : " -bottom-40")
        }
        onMouseOut={() => setOpen(false)}
        onMouseOver={() => setOpen(true)}
      >
        <div className="w-full h-6 bg-gray-300 -mt-6">
          <Ripple className="justify-center items-center" onClick={() => setOpen(!open)}>
            <i className="ri-sticky-note-fill text-gray-600" />
          </Ripple>
        </div>
        <textarea
          className="w-full h-full outline-none p-4 resize-none"
          placeholder="Sipariş Notu"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </>
  );
});

class StatusButtonProps {
  onClick: (status: OrderStatusType) => void;
  status: OrderStatusType;
}
const StatusButton = ({ onClick = () => {}, status }: StatusButtonProps) => {
  return (
    <Ripple
      className={"rounded bg-opacity-20 bg-" + OrderStatusColor[status]}
      onClick={() => onClick(status)}
    >
      <div className="flex justify-center items-center p-2 w-full h-full">
        <span className={"-mb-0.5 flex-1 text-center font-medium text-" + OrderStatusColor[status]}>
          {i18n.t("orderStatus." + status)}
        </span>
      </div>
    </Ripple>
  );
};

class ModifierModalProps {
  orderProduct: OrderProductPattern;
  setOrderProduct: (orderProduct: OrderProductPattern) => void;
  onClose: () => void;
  addBasket: (item: OrderProductPattern, callback: () => void) => void;
}
const ModifierModal = ({
  orderProduct,
  setOrderProduct = () => {},
  onClose = () => {},
  addBasket = () => {},
}: ModifierModalProps) => {
  return (
    <Modal
      buttons={[
        {
          text: i18n.t("button.save"),
          color: "primary",
          textColor: "white",
          block: true,
          onClick: () =>
            addBasket(orderProduct, () => {
              onClose();
            }),
        },
        {
          text: i18n.t("button.cancel"),
          color: "gray-100",
          textColor: "gray-600",
          onClick: () => onClose(),
        },
      ]}
      onClose={onClose}
    >
      {orderProduct &&
        orderProduct.product.modifierGroups.map((modifierGroup, index: number) => {
          let modifierSelectIndex = orderProduct.modifierSelections.findIndex(
            (modifierSelect) => modifierGroup.id == modifierSelect.modifierGroupId
          );

          return (
            <div key={index} className="w-full mb-4">
              <div className="flex font-medium items-center mb-2">
                <div className="flex items-center justify-center rounded w-4 h-4 bg-primary bg-opacity-20">
                  <i className="ri-add-fill text-sm text-primary"></i>
                </div>
                <span className="ml-2 -mb-1">
                  <span>{modifierGroup.name}</span>
                  {modifierGroup.required && (
                    <span className="text-red text-xs ml-1">({i18n.t("form.required")})</span>
                  )}
                  {modifierGroup.min && modifierGroup.min > 1 && (
                    <span className="text-red text-xs ml-1">(en az {modifierGroup.min})</span>
                  )}
                  {modifierGroup.max && modifierGroup.max > 1 && (
                    <span className="text-red text-xs ml-1">(en fazla {modifierGroup.max})</span>
                  )}
                </span>
              </div>
              {modifierGroup.multiple ? (
                <div className="w-full">
                  {modifierGroup.modifierProducts.map((modifierProduct, index: number) => {
                    let modifierCheckIndex = orderProduct.modifierSelections.findIndex(
                      (modifierSelect) =>
                        modifierGroup.id == modifierSelect.modifierGroupId &&
                        modifierProduct.id == modifierSelect.modifierProductId
                    );
                    return (
                      <div key={index} className="w-full">
                        <CheckBox
                          label={
                            modifierProduct.name +
                            (modifierProduct.price > 0 ? " (" + modifierProduct.price + " TL)" : "")
                          }
                          checked={modifierCheckIndex > -1}
                          onChange={() => {
                            let _val: any = {
                              modifierGroupId: modifierGroup.id,
                              modifierProductId: modifierProduct.id,
                            };

                            if (modifierCheckIndex > -1) {
                              orderProduct.modifierSelections = [
                                ...orderProduct.modifierSelections.slice(0, modifierCheckIndex),
                                ...orderProduct.modifierSelections.slice(modifierCheckIndex + 1),
                              ];
                            } else {
                              orderProduct.modifierSelections.push(_val);
                            }
                            setOrderProduct({ ...orderProduct });
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="w-full">
                  <Select
                    options={modifierGroup.modifierProducts.map((modifierProduct) => ({
                      label:
                        modifierProduct.name +
                        (modifierProduct.price > 0 ? " (" + modifierProduct.price + " TL)" : ""),
                      value: modifierProduct.id,
                    }))}
                    defaultValue={
                      modifierSelectIndex > -1
                        ? orderProduct.modifierSelections[modifierSelectIndex]?.modifierProductId
                        : 0
                    }
                    onChange={(e) => {
                      let _val: any = {
                        modifierGroupId: modifierGroup.id,
                        modifierProductId: e.value,
                      };
                      if (modifierSelectIndex > -1) {
                        orderProduct.modifierSelections = [
                          ...orderProduct.modifierSelections.slice(0, modifierSelectIndex),
                          ...orderProduct.modifierSelections.slice(modifierSelectIndex + 1),
                        ];
                      }
                      if (e.value !== 0) orderProduct.modifierSelections.push(_val);
                      setOrderProduct({ ...orderProduct });
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
    </Modal>
  );
};

class CountModalProps {
  orderProduct: OrderProductPattern;
  onClose: () => void;
  saveItem: (count: number) => void;
}
const CountModal = ({ orderProduct, onClose = () => {}, saveItem = () => {} }: CountModalProps) => {
  const CountButton = ({
    className = "",
    value = "",
    col = 3,
    onClick = () => {},
  }: {
    className?: string;
    value?: string | number | JSX.Element;
    col?: number;
    onClick?: () => void;
  }) => {
    return (
      <div className={"p-1 w-1/" + col}>
        <Ripple
          onClick={onClick}
          className={
            "flex items-center justify-center h-16 bg-gray-100 rounded text-gray-600 " + className
          }
        >
          <span className="flex text-xl font-semibold -mb-0.5">{value}</span>
        </Ripple>
      </div>
    );
  };

  const CountInput = ({
    label,
    value,
    onChange = () => null,
    onInsc = () => null,
    onDisc = () => null,
  }: {
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    onInsc?: () => void;
    onDisc?: () => void;
  }) => {
    return (
      <div className="flex-1 p-1 text-right h-full">
        <div className="flex items-end h-full border-b w-full border-gray-200">
          <div className="flex flex-col">
            <button className="w-10 flex-1">
              <Ripple
                onClick={onInsc}
                className="flex justify-center items-center bg-gray-100 rounded"
              >
                <i className="ri-add-fill" />
              </Ripple>
            </button>
            <button className="w-10 flex-1">
              <Ripple
                onClick={onDisc}
                className="flex justify-center items-center bg-gray-100 rounded"
              >
                <i className="ri-subtract-fill" />
              </Ripple>
            </button>
          </div>
          <input
            type="text"
            className="bg-transparent outline-none text-right font-semibold text-gray-600 w-full text-3xl"
            value={Number(value)}
            onChange={(e) => onChange(e.target.value)}
            autoFocus
          />
          <div className="ml-2 text-gray-400 font-semibold text-lg">{label}</div>
        </div>
      </div>
    );
  };

  let [count, setCount]: any = useState("0");

  useEffect(() => {
    setCount(orderProduct?.count);
  }, [orderProduct]);
  return (
    <Modal
      buttons={[
        {
          text: i18n.t("button.save"),
          color: "primary",
          textColor: "white",
          block: true,
          onClick: () => {
            saveItem(count);
            onClose();
          },
        },
      ]}
      onClose={onClose}
    >
      <div className="flex items-end -mx-1">
        <CountInput
          label={i18n.t(`quantityType.${orderProduct.product.quantityType}`)}
          value={count}
          onInsc={() => setCount(Number(count) + 1)}
          onDisc={() => (Number(count) > 0 ? setCount(Number(count) - 1) : 0)}
          onChange={(value) => setCount(value)}
        />
        <CountButton
          value={"Sil"}
          className="text-primary"
          onClick={() =>
            count.length > 1 ? setCount(count.slice(0, count.length - 1)) : setCount("0")
          }
        />
      </div>
      <div className="flex -mx-1">
        <CountButton value={1} onClick={() => setCount(count + "1")} />
        <CountButton value={2} onClick={() => setCount(count + "2")} />
        <CountButton value={3} onClick={() => setCount(count + "3")} />
      </div>
      <div className="flex -mx-1">
        <CountButton value={4} onClick={() => setCount(count + "4")} />
        <CountButton value={5} onClick={() => setCount(count + "5")} />
        <CountButton value={6} onClick={() => setCount(count + "6")} />
      </div>
      <div className="flex -mx-1">
        <CountButton value={7} onClick={() => setCount(count + "7")} />
        <CountButton value={8} onClick={() => setCount(count + "8")} />
        <CountButton value={9} onClick={() => setCount(count + "9")} />
      </div>
      <div className="flex -mx-1">
        <CountButton value={0} col={2} onClick={() => setCount(count + "0")} />
        <CountButton value={"."} col={2} onClick={() => setCount(count + ".")} />
      </div>
      <div className="flex mt-4 -mx-2">
        <div className="px-2 flex-1">
          <Ripple className="w-full justify-center rounded bg-gray-100" onClick={() => onClose()}>
            <span className="p-3 px-6 text-gray-600 font-medium">{i18n.t("button.cancel")}</span>
          </Ripple>
        </div>
        <div className="px-2 flex-1">
          <Ripple
            className="w-full justify-center rounded bg-primary bg-opacity-10"
            onClick={() => {
              saveItem(0);
              onClose();
            }}
          >
            <span className="p-3 px-6 text-primary font-medium">{i18n.t("button.remove")}</span>
          </Ripple>
        </div>
      </div>
    </Modal>
  );
};
export default observer(ProductsPage);
