import { configure, makeAutoObservable } from "mobx";
import axios, { APIS } from "networking";
import { PaymentPattern } from "patterns/payment.pattern";
import IStore from "store/instant.store";

configure({ enforceActions: "never" });

class PaymentController {
  postPayments: PaymentPattern[];
  pays: {
    type: PaymentPattern["type"];
    paymentItems: { orderProductId?: number; price: number }[];
    totalPrice: number;
  }[] = [];
  payTemps: { orderProductId?: number; price: number }[] = [];
  constructor() {
    makeAutoObservable(this);
  }
  setPostPayments = (postPayments: PaymentPattern[]) => (this.postPayments = postPayments);
  setPays = (
    pays: {
      type: PaymentPattern["type"];
      paymentItems: { orderProductId?: number; price: number }[];
      totalPrice: number;
    }[]
  ) => (this.pays = pays);
  setPayTemps = (payTemps: { orderProductId?: number; price: number }[]) =>
    (this.payTemps = payTemps);

  getPostPayments = async (dateRange?: { startDate: Date; endDate: Date }) => {
    let { data } = await axios.get(APIS.PAYMENT_POSTS.rawValue, { params: dateRange });
    return <PaymentPattern[]>data.payments;
  };
  closePayment = async (
    id: number,
    pays: {
      type: PaymentPattern["type"];
      paymentItems: { orderProductId?: number; price: number }[];
      totalPrice: number;
    }[],
    callback: (err: boolean) => void
  ) => {
    try {
      IStore.showLoader();
      let { data } = await axios.post(APIS.PAYMENT.value(id), { pays });
      IStore.hideLoader();
      if (!data.error) {
        callback(false);
      } else callback(true);
    } catch (err) {
      callback(true);
    }
  };
  printBill = async () => {
    try {
      IStore.showLoader();

      IStore.hideLoader();
    } catch (err) {}
  };
}

export default PaymentController;
