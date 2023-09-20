import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate, useParams } from "react-router";
// Components
import AreaRepport from "components/AreaRepport";
import { Loader } from "components/Loading";
import Order from "components/Order";
import PayFooter from "components/PayFooter";
import TableHead from "components/TableHead";
import Calculator from "components/Calculator";
import Tabs from "components/Tabs";
import Ripple from "components/Ripple";
import ProductItem from "components/ProductItem";
// Patterns
import { PaymentPattern } from "patterns/payment.pattern";
import { OrderPattern, OrderProductPattern } from "patterns/order.pattern";
// Store
import IStore from "store/instant.store";
// Services
import { filterOrderPayment } from "services/payment.service";
import { generateTableName } from "services/table.service";
import { calcTotalPrice, filterOrderStatus } from "services/order.service";
import { match } from "services/_.service";
// Controllers
import OrderController from "controllers/order.controller";
import PaymentController from "controllers/payment.controller";
// i18n
import i18n from "i18n";

const PaymentPage = () => {
  let navigate = useNavigate();
  let { tableId }: any = useParams();
  let { categories, tables, products } = IStore;
  let orders = IStore.orders
    .filter((order) => order.tableId == tableId)
    .map((order) => ({
      ...order,
      orderProducts: match(order.orderProducts, products, {
        name: "productId",
        path: "product",
      }),
    }));

  let paymentOrders = filterOrderStatus(orders, [
    "READY",
    "PREPARING",
    "PAID",
    "ONTHEWAY",
    "CREATED",
    "COMPLATED",
  ]);

  let [paymentC] = useState(new PaymentController());
  let [orderC] = useState(new OrderController());

  let [activeTab, setActiveTab] = useState([0, 0]);

  let [openFooter, setOpenFooter]: any = useState(null);
  const showFooter = () => {
    setOpenFooter(true);
    setTimeout(() => {
      setOpenFooter(false);
    }, 1000);
  };

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-0 top-0 h-full w-[400px] bg-white border-r border-black border-opacity-5 shadow z-20">
        <div className="relative pt-14 pb-16 flex flex-col w-full h-full overflow-auto">
          <Loader />
          <TableHead
            tableName={generateTableName(tableId, tables, categories)}
            tab="bill"
            onClickOne={(tab) => navigate(`/products/${tableId}/new`)}
            onClickTwo={(tab) => navigate(`/products/${tableId}`)}
          />

          <div className="flex-1 flex flex-col overflow-auto">
            {orders.length ? (
              orders.map((order, index: number) => (
                <div key={index} className="w-full border-b border-opacity-5 border-black">
                  <Order
                    tableName={generateTableName(order.tableId, tables, categories)}
                    {...order}
                    minimize
                    orderProducts={order.orderProducts}
                    onClick={() => navigate("/products/" + order.tableId + "/" + order.id)}
                  />
                </div>
              ))
            ) : (
              <AreaRepport head={i18n.t("repport.notActiveOrderFound")} icon="error-warning" />
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1 h-full pl-[400px] pb-16">
        <div className="flex w-full h-full p-2 overflow-hidden">
          <div className="w-1/2 p-2 h-full">
            <Tabs
              activeTab={activeTab[0]}
              onChange={(tab) => {
                setActiveTab([tab, activeTab[1]]);
              }}
              tabs={[
                {
                  name: "Ödenecekler",
                  content: (
                    <BillTab
                      label="Ödenecek Tutar"
                      orders={filterOrderPayment(paymentOrders, (orderProduct) =>
                        paymentC.pays.every(
                          (pay) =>
                            pay.paymentItems.findIndex(
                              (item) => item.orderProductId == orderProduct.id
                            ) == -1
                        )
                      ).map((order) => ({
                        ...order,
                        orderProducts: order.orderProducts.map((orderProduct) => ({
                          ...orderProduct,
                          paymentItemId:
                            paymentC.payTemps.findIndex(
                              (temp) => temp.orderProductId == orderProduct.id
                            ) > -1
                              ? 1
                              : undefined,
                        })),
                      }))}
                      onItemClick={(orderProduct) => {
                        setActiveTab([activeTab[0], 1]);
                        paymentC.setPayTemps([
                          ...paymentC.payTemps,
                          {
                            price: calcTotalPrice([orderProduct]),
                            orderProductId: orderProduct.id,
                          },
                        ]);
                      }}
                    />
                  ),
                },
                {
                  name: "Ödenenler",
                  content: (
                    <BillTab
                      label="Ödenen Tutar"
                      orders={filterOrderPayment(paymentOrders, (orderProduct) =>
                        paymentC.pays.some(
                          (pay) =>
                            pay.paymentItems.findIndex(
                              (item) => item.orderProductId == orderProduct.id
                            ) > -1
                        )
                      ).map((order) => ({
                        ...order,
                        orderProducts: order.orderProducts.map((orderProduct) => ({
                          ...orderProduct,
                          paymentItemId: 1,
                        })),
                      }))}
                    />
                  ),
                },
              ]}
            />
          </div>
          <div className="w-1/2 p-2 h-full">
            <Tabs
              activeTab={activeTab[1]}
              onChange={(tab) => {
                setActiveTab([activeTab[0], tab]);
                paymentC.setPayTemps([]);
              }}
              tabs={[
                {
                  name: "Hesap",
                  content: (
                    <CalculatorTab
                      value={String(paymentC.payTemps[0]?.price || 0)}
                      onChange={(value) => paymentC.setPayTemps([{ price: parseInt(value) }])}
                    />
                  ),
                },
                {
                  name: "Hesap Defteri",
                  content: (
                    <BillTab
                      label="Toplam Tutar"
                      orders={filterOrderPayment(
                        paymentOrders,
                        (orderProduct) =>
                          paymentC.payTemps.findIndex(
                            (temp) => temp.orderProductId == orderProduct.id
                          ) > -1
                      )}
                      onItemClick={(orderProduct) => {
                        let index = paymentC.payTemps.findIndex(
                          (temp) => temp.orderProductId == orderProduct.id
                        );
                        setActiveTab([0, activeTab[1]]);
                        paymentC.setPayTemps([
                          ...paymentC.payTemps.slice(0, index),
                          ...paymentC.payTemps.slice(index + 1),
                        ]);
                      }}
                    />
                  ),
                },
              ]}
            />
          </div>
        </div>
        <div className="w-full px-1">
          <PayButtons
            tab={activeTab[1]}
            disabled={
              paymentC.payTemps.reduce((sum, { price }: any) => parseInt(price) + sum, 0) == 0
            }
            onPay={(type) => {
              paymentC.setPays([
                ...paymentC.pays,
                {
                  type,
                  paymentItems: paymentC.payTemps,
                  totalPrice: paymentC.payTemps.reduce((sum, { price }) => sum + price, 0),
                },
              ]);
              paymentC.setPayTemps([]);
              showFooter();
            }}
          />
        </div>
      </div>
      <PayFooter
        open={openFooter}
        setOpen={setOpenFooter}
        orders={paymentOrders}
        pays={paymentC.pays}
        onPayItem={(index) => {
          paymentC.setPays([...paymentC.pays.slice(0, index), ...paymentC.pays.slice(index + 1)]);
        }}
        onClosePayment={() =>
          paymentC.closePayment(
            tableId,
            paymentC.pays,
            (error) =>
              !error &&
              orderC.onCompleted(tableId, (err) => {
                !err && navigate("/tables");
              })
          )
        }
        onPrintBill={() => paymentC.printBill()}
      />
    </div>
  );
};

class PayButtonsProps {
  tab: number;
  disabled: boolean;
  onPay: (type: PaymentPattern["type"]) => void;
}
const PayButtons = ({ tab, disabled, onPay = () => {} }: PayButtonsProps) => {
  return (
    <div className="flex pb-6">
      <div className="flex-1 p-2">
        <PayButton
          disabled={disabled}
          color="green"
          textColor="white"
          onClick={() => onPay("CASH")}
        >
          Nakit
        </PayButton>
      </div>
      <div className="flex-1 p-2">
        <PayButton
          disabled={disabled}
          color="green-700"
          textColor="white"
          onClick={() => onPay("CREDIT")}
        >
          Kredi Kartı
        </PayButton>
      </div>
      {tab == 0 ? (
        <>
          <div className="flex-1 p-2">
            <PayButton
              disabled={disabled}
              color="blue"
              textColor="white"
              onClick={() => onPay("CHANGE")}
            >
              Para Üstü
            </PayButton>
          </div>
          <div className="flex-1 p-2">
            <PayButton
              disabled={disabled}
              color="yellow"
              textColor="white"
              onClick={() => onPay("DISCOUNT")}
            >
              İndirim
            </PayButton>
          </div>
        </>
      ) : (
        <>
          <div className="flex-1 p-2">
            <PayButton
              disabled={disabled}
              color="red"
              textColor="white"
              onClick={() => onPay("CANCELLED")}
            >
              İptal
            </PayButton>
          </div>
          <div className="flex-1 p-2">
            <PayButton
              disabled={disabled}
              color="red-600"
              textColor="white"
              onClick={() => onPay("RETURNED")}
            >
              İade
            </PayButton>
          </div>
        </>
      )}
    </div>
  );
};

class CalculatorTabProps {
  value: string;
  onChange: (value: any) => void;
}
const CalculatorTab = ({ value, onChange }: CalculatorTabProps) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-end items-end overflow-hidden pb-10">
      <Loader />
      <Calculator value={value} onChange={onChange} />
    </div>
  );
};

class BillTabProps {
  orders: OrderPattern[];
  label: string;
  onItemClick?: (orderProduct: OrderProductPattern) => void;
}
const BillTab = ({ orders, label = "", onItemClick = () => {} }: BillTabProps) => {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden pb-10">
      <div className="relative flex flex-col bg-white rounded shadow p-3 mt-2 flex-1 overflow-hidden">
        <Loader />
        <div className="flex-1 overflow-auto">
          {orders && orders.length ? (
            orders.map((item, index) => (
              <div className="flex my-3" key={index}>
                <div className="rounded w-4 bg-gray-100"></div>
                <div className="flex-1 border-r border-t border-opacity-5 border-black">
                  {item.orderProducts.map((orderProduct, index) => {
                    return (
                      <ProductItem
                        onClick={() => onItemClick(orderProduct)}
                        key={index}
                        {...orderProduct}
                      />
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <AreaRepport icon="error-warning" head="Ürün Bulunamadı" />
          )}
        </div>
        <div className="pl-3 pr-6 font-semibold flex justify-between items-center border-t border-dashed border-opacity-5 border-black pt-3">
          <div className="flex items-center">
            <i className="ri-arrow-right-s-fill mr-2 text-xl" />
            <span>{label}</span>
          </div>
          <div>
            {Number(
              orders.reduce((sum, { orderProducts }) => calcTotalPrice(orderProducts) + sum, 0)
            ).toFixed(2) + " TL"}
          </div>
        </div>
      </div>
    </div>
  );
};

class PayButtonProps {
  disabled?: boolean;
  color?: string;
  textColor?: string;
  children?: string;
  onClick?: () => void;
}
const PayButton = ({
  disabled = false,
  children,
  color,
  textColor,
  onClick = () => null,
}: PayButtonProps) => {
  return (
    <div className={"w-full p-1 " + (disabled ? " opacity-40" : "")}>
      <button
        className={"w-full rounded overflow-hidden shadow bg-" + color + " text-" + textColor}
      >
        <Ripple disabled={disabled} onClick={() => !disabled && onClick()}>
          <div className="p-5 text-lg font-semibold text-center w-full -mb-0.5">
            <span>{children}</span>
          </div>
        </Ripple>
      </button>
    </div>
  );
};
export default observer(PaymentPage);
