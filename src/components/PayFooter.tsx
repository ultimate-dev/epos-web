import i18n from "i18n";
import { OrderPattern } from "patterns/order.pattern";
import { PaymentPattern } from "patterns/payment.pattern";
import { forwardRef } from "react";
import { toast } from "react-toastify";
import { calcTotalPrice } from "services/order.service";
import Ripple from "./Ripple";

class PayFooterProps {
  orders: OrderPattern[];
  pays: {
    type: PaymentPattern["type"];
    paymentItems: { orderProductId?: number; price: number }[];
    totalPrice: number;
  }[];
  open: boolean | null;
  setOpen: (open: boolean) => void;
  onPayItem: (index: number) => void;
  onClosePayment: () => void;
  onPrintBill: () => void;
}
const PayFooter = forwardRef(
  (
    {
      orders = [],
      pays = [],
      setOpen,
      open,
      onPayItem = () => {},
      onClosePayment = () => {},
      onPrintBill = () => {},
    }: PayFooterProps,
    ref: any
  ) => {
    let totalPrice = orders.reduce(
      (sum, { orderProducts }) => sum + calcTotalPrice(orderProducts),
      0
    );
    let paiPrice = pays.reduce(
      (sum, { type, totalPrice }) => sum + totalPrice * (type == "CHANGE" ? -1 : 1),
      0
    );
    let remmainingPrice = (totalPrice - paiPrice) * -1;

    const controlPay = (remmainingPrice: number, cb: () => void) => {
      if (remmainingPrice == 0) {
        cb();
      } else if (remmainingPrice > 0) {
        toast.error("Para Üstü: " + Number(remmainingPrice).toFixed(2) + " TL");
      } else if (remmainingPrice < 0) {
        toast.error("Kalan Tutar: " + Number(remmainingPrice).toFixed(2) + " TL");
      }
    };

    return (
      <>
        <div
          ref={ref}
          id="bill-footer-container"
          className="shadow absolute w-full left-0 bottom-16 pl-[400px] z-10 transition-all duration-300 ease-in-out"
          style={{
            marginBottom: !open
              ? -1 * (document?.getElementById("bill-footer-container")?.clientHeight || 9999)
              : 0,
          }}
          onMouseOut={() => setOpen(false)}
          onMouseOver={() => setOpen(true)}
        >
          <div className="bg-white">
            <div className="bg-gray-300 h-6 -mt-6 w-full border-b border-black border-opacity-5">
              <Ripple
                className="flex flex-col items-center justify-center"
                onClick={() => setOpen(!open)}
              >
                <div>
                  <div className="w-12 h-0.5 bg-black rounded bg-opacity-20 mb-1" />
                  <div className="w-12 h-0.5 bg-black rounded bg-opacity-20" />
                </div>
              </Ripple>
            </div>
            <div className="p-2 w-full h-full overflow-auto">
              <div className="font-semibold bg-primary text-white rounded flex justify-between items-center py-1 px-3">
                <div className="flex items-center">
                  <i className="ri-add-fill mr-2 text-xl"></i>
                  <span className="-mb-0.5">Toplam Tutar</span>
                </div>
                <div>{Number(totalPrice).toFixed(2) + " TL"}</div>
              </div>
              {pays &&
                pays.map((pay, index) => (
                  <Ripple
                    className="font-medium text-gray-600 rounded flex justify-between items-center py-1 px-3"
                    onClick={() => onPayItem(index)}
                  >
                    <div className="flex items-center">
                      {pay.type == "CHANGE" ? (
                        <i className="ri-arrow-left-line mr-2 text-xl"></i>
                      ) : (
                        <i className="ri-arrow-right-line mr-2 text-xl"></i>
                      )}
                      <span className="-mb-0.5">{i18n.t("paymentType." + pay.type)}</span>
                    </div>
                    <div>
                      {Number(pay.totalPrice * (pay.type == "CHANGE" ? 1 : -1)).toFixed(2) + " TL"}
                    </div>
                  </Ripple>
                ))}
              <div className="font-semibold text-primary rounded flex justify-between items-center py-1 px-3">
                <div className="flex items-center">
                  <i className="ri-subtract-fill mr-2 text-xl"></i>
                  <span className="-mb-0.5">Kalan Tutar</span>
                </div>
                <div>{Number(remmainingPrice).toFixed(2) + " TL"}</div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="shadow absolute left-0 bottom-0 bg-primary w-full flex h-16 p-2 z-30"
          onMouseOut={() => setOpen(false)}
          onMouseOver={() => setOpen(true)}
        >
          <div className="flex-1 flex flex-col justify-center items-center border-r border-black border-opacity-10">
            <div className="text-white font-semibold text-2xl">
              {Number(totalPrice).toFixed(2) + " TL"}
            </div>
            <div className="text-sm -mt-1 -mb-1 font-medium">Toplam Tutar</div>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center border-r border-black border-opacity-10">
            <div className="text-white font-semibold text-2xl">
              {Number(paiPrice).toFixed(2) + " TL"}
            </div>
            <div className="text-sm -mt-1 -mb-1 font-medium">Ödenen Tutar</div>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center border-r border-black border-opacity-10">
            <div className="text-white font-semibold text-2xl">
              {Number(remmainingPrice).toFixed(2) + " TL"}
            </div>
            <div className="text-sm -mt-1 -mb-1 font-medium">Kalan Tutar</div>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div className="h-full mx-2">
              <Ripple
                disabled={pays.length == 0 || orders.length == 0}
                className={
                  "flex bg-black bg-opacity-20 rounded items-center justify-center" +
                  (pays.length == 0 || orders.length == 0 ? " opacity-60" : "")
                }
                onClick={() => controlPay(remmainingPrice, onPrintBill)}
              >
                <div className="text-white font-semibold px-5">Adisyon</div>
              </Ripple>
            </div>
            <div className="h-full flex-1 mx-2">
              <Ripple
                disabled={pays.length == 0 || orders.length == 0}
                className={
                  "flex bg-white rounded items-center justify-center" +
                  (pays.length == 0 || orders.length == 0 ? " opacity-60" : "")
                }
                onClick={() => controlPay(remmainingPrice, onClosePayment)}
              >
                <div className="text-primary font-semibold">Hesabı Kapat</div>
              </Ripple>
            </div>
          </div>
        </div>
      </>
    );
  }
);
export default PayFooter;
