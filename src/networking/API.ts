class API {
  rawValue: string;

  constructor(str: string) {
    this.rawValue = str;
  }

  value(...args: any[]) {
    let val = this.rawValue;
    let match,
      i = 0;
    do {
      match = /(\$\d+)/gu.exec(val);
      if (match && args[i]) val = val.replace(match[0], args[i++]);
    } while (match);
    return val;
  }
}

const apis = {
  AUTH_LOGIN: new API("/auth/login"),
  AUTH_VERIFY: new API("/auth/verify"),
  CATEGORIES: new API("/api/category"),
  TABLES: new API("/api/table"),
  ORDERS: new API("/api/order"),
  ORDER_POSTS: new API("/api/order/post"),
  ORDER_COMPLETED: new API("/api/order/completed"),
  ORDER_TRANSFER: new API("/api/order/transfer"),
  ORDER_APPROVE: new API("/api/order/approve"),
  ORDER_READY: new API("/api/order/ready"),
  PAYMENT: new API("/api/payment/$1"),
  PAYMENT_POSTS: new API("/api/payment/post"),
  CASE: new API("/api/case"),
  CASE_EXPENSES: new API("/api/case/expense"),
  CASE_EXPENSE_TYPES: new API("/api/case/expense/type"),
  PRODUCTS: new API("/api/product"),
  RESTAURANT: new API("/api/restaurant"),
};

export default apis;
