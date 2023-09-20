import moment from "moment";
import _ from "lodash";
// Coponents
import Ripple from "./Ripple";
// i18n
import i18n from "i18n";
import CheckBox from "./CheckBox";
// Patterns
import { OrderPattern, OrderProductPattern } from "patterns/order.pattern";
// Hooks
import useMomentTime from "hooks/useMomentTime";
import { calcTotalModifierSelect } from "services/order.service";
// Constants
import { OrderStatusColor } from "constants/colors";
import { toJS } from "mobx";
import { PaymentPattern } from "patterns/payment.pattern";

export class OrderProps extends OrderPattern {
  tableName?: string;
  minimize?: boolean;
  kitchen?: boolean;
  onClick?: () => void;
  approveOrder?: () => void;
  readyOrderProduct?: (orderProduct: OrderProductPattern) => void;
  payments?: PaymentPattern[];
}
const Order = ({
  groupId,
  tableName,
  note,
  status = "CREATED",
  minimize,
  kitchen,
  orderProducts,
  totalPrice,
  orderDate,
  onClick = () => {},
  approveOrder = () => {},
  readyOrderProduct = () => {},
  payments = [],
}: OrderProps) => {
  let color = OrderStatusColor[status];

  let [momentOrderDateFromNow]: any = useMomentTime(() => moment(orderDate).fromNow());
  return (
    <Ripple onClick={onClick}>
      <div className="flex flex-col w-full">
        <div className={"flex items-center justify-start bg-" + color + " text-white w-full p-2"}>
          {tableName && <span className="flex-1 -mb-1 font-semibold">#{tableName}</span>}
          <div className="rounded py-1 px-2 bg-white">
            <span className={"block -mb-0.5 font-medium text-xs text-" + color + ""}>
              {i18n.t(`orderStatus.${status}`)}
            </span>
          </div>
        </div>
        <div className="flex-1 flex flex-col px-4 py-2">
          {orderProducts &&
            orderProducts.map((orderProduct, index: number) => (
              <div key={index} className="flex w-full">
                {kitchen && (
                  <div className="w-[32px] mr-2 text-center">
                    <CheckBox
                      checked={orderProduct.status == "APPROVED"}
                      color={color}
                      onChange={() => readyOrderProduct(orderProduct)}
                    />
                  </div>
                )}
                <div className="flex flex-col w-full" key={index}>
                  <div className="flex items-center text-xs font-medium mt-1">
                    <div className="flex-1">{orderProduct.product.name}</div>
                    <div className="w-[80px] text-center">
                      <span className="block -mb-0.5 text-gray-400">
                        {orderProduct.count +
                          " " +
                          i18n.t(`quantityType.${orderProduct.product.quantityType}`)}
                      </span>
                    </div>
                    {!kitchen && (
                      <div className="w-[60px] text-end">
                        {orderProduct.product.originalPrice == orderProduct.product.sellingPrice ? (
                          <span className={"block -mb-0.5 text-" + color + ""}>
                            {Number(orderProduct.product.sellingPrice).toFixed(2)} TL
                          </span>
                        ) : (
                          <>
                            <span
                              className={
                                "block -mb-0.5 text-" + color + " text-xs line-through opacity-50"
                              }
                            >
                              {Number(orderProduct.product.originalPrice).toFixed(2)} TL
                            </span>
                            <span className={"block -mb-0.5 text-" + color + ""}>
                              {Number(orderProduct.product.sellingPrice).toFixed(2)} TL
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {orderProduct.product.modifierGroups.map((modifierGroup, index: number) => {
                    let _modifierSelections = orderProduct.modifierSelections.filter(
                      (select) => select.modifierGroupId == modifierGroup.id
                    );
                    return (
                      <div key={index} className="flex items-center my-0.5 text-xs">
                        <i className="block ri-add-fill text-gray-400 mr-1"></i>
                        <div className="flex flex-col w-full">
                          <span
                            className={
                              "w-full flex justify-between items-center text-" + color + " mb-0.5"
                            }
                          >
                            <span className="-mb-1">{modifierGroup.name}</span>
                            <span className="text-gray-400 -mb-1">
                              {!kitchen
                                ? calcTotalModifierSelect(_modifierSelections, [modifierGroup]) +
                                  " TL"
                                : null}
                            </span>
                          </span>
                          <span className="text-gray-400">
                            <span className="block -mb-1">
                              {_modifierSelections.length > 0
                                ? _modifierSelections
                                    .map((select) => {
                                      let f = modifierGroup.modifierProducts.find(
                                        (selectProduct) =>
                                          selectProduct.id == select.modifierProductId
                                      );
                                      if (f)
                                        return (
                                          f?.name +
                                          (!kitchen && f?.price > 0
                                            ? "(" + Number(f?.price).toFixed(2) + " TL)"
                                            : "")
                                        );
                                      return null;
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
            ))}
          <div className="w-full flex items-end justify-between mt-1">
            <div className="flex items-center text-xs font-medium text-gray-600 capitalize">
              <i className="ri-time-line"></i>
              <span className="-mb-0.5 ml-1">{momentOrderDateFromNow}</span>
            </div>
            <div className={"font-medium text-" + color + " -mb-1"}>
              {Number(totalPrice).toFixed(2)} TL
            </div>
          </div>
        </div>
        {(!minimize || kitchen) && note && (
          <div className="p-2">
            <div
              className={"p-2 rounded bg-" + color + " bg-opacity-10 text-sm text-" + color + ""}
            >
              {note}
            </div>
          </div>
        )}
        {!minimize && (
          <>
            <div className="flex items-center justify-between px-1 pb-2">
              <div className="flex flex-wrap -my-1">
                {payments.map((payment) => (
                  <Type>
                    <i className="ri-bank-card-fill mr-1" />
                    <span className="text-xs font-medium -mb-0.5">
                      {i18n.t("paymentType." + payment.type)}
                    </span>
                  </Type>
                ))}
              </div>
              <div className="flex">
                <Button>
                  <i className="ri-download-2-fill" />
                </Button>
                <Button>
                  <i className="ri-printer-fill" />
                </Button>
              </div>
            </div>
            <div className="w-full border-t text-center text-gray-400 text-xs px-2 p-1">
              {groupId}
            </div>
          </>
        )}
        {kitchen && status == "CREATED" && (
          <div className="p-2 pt-0">
            <Ripple
              className={"bg-" + color + " rounded flex items-center justify-center py-2"}
              onClick={approveOrder}
            >
              <span className="text-white font-medium">{i18n.t("kitchen.approve")}</span>
            </Ripple>
          </div>
        )}

        {kitchen && status == "PREPARING" && (
          <div className="p-2 pt-0">
            <Ripple
              className={"bg-" + color + " rounded flex items-center justify-center py-2"}
              onClick={approveOrder}
            >
              <span className="text-white font-medium">{i18n.t("kitchen.ready")}</span>
            </Ripple>
          </div>
        )}
      </div>
    </Ripple>
  );
};
class ButtonProps {
  children?: string | JSX.Element | JSX.Element[];
}
const Button = ({ children }: ButtonProps) => {
  return (
    <div className="px-1">
      <Ripple className="bg-gray-200 text-gray-500 rounded py-1 px-3">
        <div className="flex items-center">{children}</div>
      </Ripple>
    </div>
  );
};

class TypeProps {
  children?: string | JSX.Element | JSX.Element[];
}
const Type = ({ children }: TypeProps) => {
  return (
    <div className="p-1">
      <div className="bg-gray-200 text-gray-500 rounded py-1 px-3">
        <div className="flex items-center">{children}</div>
      </div>
    </div>
  );
};
export default Order;
