import { configure, makeAutoObservable } from "mobx";
import axios, { APIS } from "networking";
import { ExpenseTypePattern, PaymentPattern } from "patterns/payment.pattern";
import IStore from "store/instant.store";

configure({ enforceActions: "never" });

class PayType {
  price: number;
  count: number;
}
const INITIAL_TOTAL = { price: 0, count: 0 };
class CaseController {
  case: {
    cashTotal: PayType;
    creditTotal: PayType;
    createdTotal: PayType;
    discountTotal: PayType;
    completedTotal: PayType;
    cancelledAndReturnedTotal: PayType;
    expenseTotal: PayType;
    cashExpenseTotal: PayType;
    creditExpenseTotal: PayType;
  } = {
    cashTotal: INITIAL_TOTAL,
    creditTotal: INITIAL_TOTAL,
    createdTotal: INITIAL_TOTAL,
    discountTotal: INITIAL_TOTAL,
    completedTotal: INITIAL_TOTAL,
    cancelledAndReturnedTotal: INITIAL_TOTAL,
    expenseTotal: INITIAL_TOTAL,
    cashExpenseTotal: INITIAL_TOTAL,
    creditExpenseTotal: INITIAL_TOTAL,
  };

  expenseTypes: ExpenseTypePattern[] = [];
  constructor() {
    makeAutoObservable(this);
  }
  getCase = async () => {
    try {
      let { data } = await axios.get(APIS.CASE.rawValue);
      if (!data.error) {
        this.case = data.case;
      }
    } catch (err) {}
    return [];
  };
  getExpenseTypes = async () => {
    try {
      let { data } = await axios.get(APIS.CASE_EXPENSE_TYPES.rawValue);
      if (!data.error) this.expenseTypes = data.expenseTypes;
    } catch (err) {}
    return [];
  };
  createExpense = async (expense: PaymentPattern) => {
    try {
      IStore.showLoader();
      await axios.put(APIS.CASE_EXPENSES.rawValue, { ...expense });
      IStore.hideLoader();
    } catch (err) {}
  };
}

export default CaseController;
