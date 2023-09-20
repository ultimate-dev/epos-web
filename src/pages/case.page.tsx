import { observer } from "mobx-react-lite";
// Components
import CheckBox from "components/CheckBox";
import Ripple from "components/Ripple";
// i18n
import i18n from "i18n";
import CaseController from "controllers/case.controller";
import IStore from "store/instant.store";
import { useEffect, useState } from "react";
import { ExpenseTypePattern, PaymentPattern, PaymentType } from "patterns/payment.pattern";
import Modal from "components/Modal";
import Select from "components/Select";
import { PaymentTypeStatus } from "constants/statuses";
import { every } from "lodash";
import toast from "react-hot-toast";

const CasePage = () => {
  let [caseC] = useState(new CaseController());
  let [modal, setModal]: any = useState(false);

  const getCase = async () => {
    await caseC.getCase();
    await caseC.getExpenseTypes();
  };

  useEffect(() => {
    getCase();
  }, []);

  IStore.socket?.on("order.update", async () => {
    getCase();
  });

  return (
    <div className="relative h-full w-full">
      <div className="flex-1 h-full">
        <div className="w-full h-14 bg-white border-b border-black border-opacity-5 p-2 shadow flex justify-between items-center">
          <div className="flex items-center">
            <CheckBox color="yemeksepeti" className="mx-2" label="Yemeksepeti" checked={false} />
            <CheckBox color="getir" className="mx-2" label="Getir" checked={false} />
            <CheckBox color="trendyol" className="mx-2" label="Trendyol" checked={false} />
          </div>

          <div className="flex items-center">
            <Ripple
              className="flex items-center bg-primary h-10 px-4 rounded"
              onClick={() => setModal({ name: "expense" })}
            >
              <i className="text-white mr-1 ri-add-circle-fill"></i>
              <div className="text-white font-medium -mb-0.5">{i18n.t("button.addExpense")}</div>
            </Ripple>
            {/*
            <div className="px-2">
              <Ripple className="flex items-center bg-primary h-10 px-4 rounded">
                <i className="text-white mr-1 ri-chat-history-fill"></i>
                <div className="text-white font-medium -mb-0.5">
                  {i18n.t("button.tableHistory")}
                </div>
              </Ripple>
            </div>
            <div className="px-2">
              <Ripple className="flex items-center bg-primary h-10 px-4 rounded">
                <i className="text-white mr-1 ri-bill-fill"></i>
                <div className="text-white font-medium -mb-0.5">{i18n.t("button.zReport")}</div>
              </Ripple>
            </div>
              */}
          </div>
        </div>
        <div className="h-full pb-16 flex flex-col p-2">
          <div className="flex-1 flex">
            <div className="h-full flex-1 p-2">
              <WidgetLine
                totalPrice={caseC.case?.completedTotal.price}
                lines={[
                  [
                    {
                      value: Number(caseC.case?.createdTotal.price).toFixed(2) + " TL",
                      label: i18n.t("case.pendingOrderAmmount"),
                    },
                    {
                      value: caseC.case?.createdTotal.count + " " + i18n.t("case.count"),
                      label: i18n.t("case.pendingOrder"),
                    },
                  ],
                  [
                    {
                      value: Number(caseC.case?.completedTotal.price).toFixed(2) + " TL",
                      label: i18n.t("case.completedOrderAmmount"),
                    },
                    {
                      value: caseC.case?.completedTotal.count + " " + i18n.t("case.count"),
                      label: i18n.t("case.completedOrder"),
                    },
                  ],
                  [
                    {
                      value: Number(caseC.case?.cancelledAndReturnedTotal.price).toFixed(2) + " TL",
                      label: i18n.t("case.canceledReturnedOrderAmmount"),
                    },
                    {
                      value: caseC.case?.cancelledAndReturnedTotal.count + " " + i18n.t("case.count"),
                      label: i18n.t("case.canceledReturnedOrder"),
                    },
                  ],
                  [
                    {
                      value: Number(caseC.case?.cashTotal.price).toFixed(2) + " TL",
                      label: i18n.t("case.cashAmmount"),
                    },
                    {
                      value: Number(caseC.case?.creditTotal.price).toFixed(2) + " TL",
                      label: i18n.t("case.creditAmmount"),
                    },
                    {
                      value: Number(caseC.case?.discountTotal.price).toFixed(2) + " TL",
                      label: i18n.t("case.discountAmmount"),
                    },
                  ],
                  [
                    {
                      value:
                        caseC.case?.completedTotal.count +
                        caseC.case?.createdTotal.count +
                        caseC.case?.cancelledAndReturnedTotal.count +
                        (" " + i18n.t("case.count")),
                      label: i18n.t("case.totalOrder"),
                    },
                  ],
                ]}
              />
            </div>
            <div className="h-full flex-1 flex flex-col p-2">
              <div className="flex-1">
                <WidgetBox
                  title={i18n.t("case.expense")}
                  totalPrice={caseC.case?.expenseTotal.price}
                  lines={[
                    [
                      {
                        value: Number(caseC.case?.cashExpenseTotal.price).toFixed(2) + " TL",
                        label: i18n.t("case.cashExpense"),
                      },
                      {
                        value: Number(caseC.case?.creditExpenseTotal.price).toFixed(2) + " TL",
                        label: i18n.t("case.creditExpense"),
                      },
                    ],
                  ]}
                />
              </div>
              <div className="flex-1 mt-4">
                <WidgetBox
                  title={i18n.t("case.dailyGain")}
                  totalPrice={caseC.case?.completedTotal.price + caseC.case?.expenseTotal.price}
                  lines={[
                    [
                      {
                        value:
                          Number(
                            caseC.case?.cashTotal.price + caseC.case?.cashExpenseTotal.price
                          ).toFixed(2) + " TL",
                        label: i18n.t("case.cashGain"),
                      },
                      {
                        value:
                          Number(
                            caseC.case?.creditTotal.price + caseC.case?.creditExpenseTotal.price
                          ).toFixed(2) + " TL",
                        label: i18n.t("case.creditGain"),
                      },
                    ],
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="w-full p-2">
            <WidgetApps />
          </div>
        </div>
      </div>
      {modal.name == "expense" && (
        <ExpenseModal
          expenseTypes={caseC.expenseTypes}
          onSave={(expense) => {
            caseC.createExpense(expense);
            caseC.getCase();
          }}
          onClose={() => setModal(false)}
        />
      )}
    </div>
  );
};
const WidgetLine = ({
  totalPrice,
  lines,
}: {
  totalPrice: number;
  lines: { value: string | number; label: string }[][];
}) => {
  const Line = ({
    color,
    line,
  }: {
    color: string;
    line: { value: string | number; label: string }[];
  }) => {
    return (
      <div className={`w-full flex items-center border-t border-black border-opacity-5 p-2`}>
        {line.map((item, index) => (
          <div
            className={`flex-1 text-${color} ${
              index !== 0 ? "border-l" : ""
            } border-black border-opacity-5`}
          >
            <span className="text-2xl font-bold">{item.value}</span>
            <div className="text-gray-400 -mt-1 text-xs font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="bg-white w-full h-full rounded p-4 flex flex-col text-center">
      <div className="font-medium bg-primary bg-opacity-10 text-primary rounded p-0.5 mb-5">
        {i18n.t("case.caseTotal")}
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="w-full">
          <div className="flex-1 text-primary">
            <span className="text-6xl font-bold">{Number(totalPrice).toFixed(2) + " TL"}</span>
          </div>
        </div>
        <div className="flex-1 flex flex-wrap justify-center items-center w-full">
          {lines.map((line) => (
            <Line color="gray-500" line={line} />
          ))}
        </div>
      </div>
    </div>
  );
};
const WidgetBox = ({
  title,
  totalPrice,
  lines,
}: {
  title: string;
  totalPrice: number;
  lines: { value: string | number; label: string }[][];
}) => {
  const Box = ({
    color,
    line,
  }: {
    color: string;
    line: { value: string | number; label: string }[];
  }) => {
    return (
      <div className={`w-full flex items-center border-t border-black border-opacity-5 p-2`}>
        {line.map((item, index) => (
          <div
            className={`flex-1 text-${color} ${
              index !== 0 ? "border-l" : ""
            } border-black border-opacity-5`}
          >
            <span className="text-2xl font-bold">{item.value}</span>
            <div className="text-gray-400 -mt-1 text-xs font-medium">{item.label}</div>
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="bg-white w-full h-full rounded p-4 flex flex-col text-center">
      <div className="font-medium bg-gray-500 bg-opacity-10 text-gray-500 rounded p-0.5 mb-5">
        {title}
      </div>
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="w-full">
          <div className="flex-1 text-gray-500">
            <span className="text-6xl font-bold">{Number(totalPrice).toFixed(2) + " TL"}</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center w-full">
          {lines.map((line) => (
            <Box color="gray-500" line={line} />
          ))}
        </div>
      </div>
    </div>
  );
};
const WidgetApps = () => {
  const WApp = ({
    title,
    color,
    totalPrice,
    pendingOrder,
    totalOrder,
  }: {
    title: string;
    color: string;
    totalPrice: number;
    pendingOrder: number;
    totalOrder: number;
  }) => {
    return (
      <div className="flex-1 p-4 text-center">
        <div className={`-mb-1 font-medium bg-${color} bg-opacity-10 text-${color} rounded p-0.5`}>
          {title}
        </div>
        <div className="flex items-center mt-3">
          <div className={`flex-1 text-${color} border-r border-${color} border-opacity-10`}>
            <span className="text-3xl font-bold">{Number(totalPrice).toFixed(2) + " TL"}</span>
          </div>
          <div className={`flex-1 text-${color} border-r border-${color} border-opacity-10`}>
            <span className="text-xl font-bold">
              {Number(pendingOrder) + " " + i18n.t("case.count")}
            </span>
            <div className="text-gray-400 -mt-1 text-xs font-medium">Bekleyen Sipariş</div>
          </div>
          <div className={`flex-1 text-${color}`}>
            <span className="text-xl font-bold">
              {Number(totalOrder) + " " + i18n.t("case.count")}
            </span>
            <div className="text-gray-400 -mt-1 text-xs font-medium">Tamamlanan Sipariş</div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="w-full bg-white rounded shadow flex">
      <WApp
        title="Yemeksepeti"
        color="yemeksepeti"
        totalPrice={0}
        pendingOrder={0}
        totalOrder={0}
      />
      <WApp title="Getir" color="getir" totalPrice={0} pendingOrder={0} totalOrder={0} />
      <WApp
        title="Trendyol Yemek"
        color="trendyol"
        totalPrice={0}
        pendingOrder={0}
        totalOrder={0}
      />
    </div>
  );
};

class ExpenseModalProps {
  expenseTypes: ExpenseTypePattern[];
  onSave: (expense: PaymentPattern) => void;
  onClose: () => void;
}
const ExpenseModal = ({
  expenseTypes = [],
  onSave = () => {},
  onClose = () => {},
}: ExpenseModalProps) => {
  let [expense, setExpense]: any = useState({
    expenseTypeId: null,
    totalPrice: 0,
    type: null,
    description: null,
  });
  return (
    <Modal
      buttons={[
        {
          text: i18n.t("button.save"),
          color: "primary",
          textColor: "white",
          block: true,
          onClick: () => {
            if (every([expense.expenseTypeId, expense.totalPrice, expense.type])) {
              onSave(expense);
              onClose();
            } else {
              toast.error(i18n.t("case.control.fieldRequired"));
            }
          },
        },
        {
          text: i18n.t("button.cancel"),
          color: "gray-100",
          textColor: "gray-600",
          onClick: () => {
            onClose();
          },
        },
      ]}
      onClose={onClose}
    >
      <div>
        <div className="w-full mb-4  font-medium">
          <div className="flex font-medium items-center mb-2">
            <span className="-mb-1">
              <span>{i18n.t("case.expenseForm.expenseType")}</span>
              <span className="text-red text-xs ml-1">({i18n.t("form.required")})</span>
            </span>
          </div>
          <Select
            options={expenseTypes.map(({ name, id }) => ({ label: name, value: id }))}
            onChange={(e) => {
              setExpense({ ...expense, expenseTypeId: e.value });
            }}
          />
        </div>

        <div className="w-full mb-4  font-medium">
          <div className="flex font-medium items-center mb-2">
            <span className="-mb-1">
              <span>{i18n.t("case.expenseForm.paymentType")}</span>
              <span className="text-red text-xs ml-1">({i18n.t("form.required")})</span>
            </span>
          </div>
          <Select
            options={[PaymentTypeStatus.CASH, PaymentTypeStatus.CREDIT].map((type) => ({
              label: i18n.t("paymentType." + type),
              value: type,
            }))}
            onChange={(e) => {
              setExpense({ ...expense, type: e.value });
            }}
          />
        </div>

        <div className="w-full mb-4">
          <div className="flex font-medium items-center mb-2">
            <span className="-mb-1">
              <span>{i18n.t("case.expenseForm.price")}(TL)</span>
              <span className="text-red text-xs ml-1">({i18n.t("form.required")})</span>
            </span>
          </div>
          <input
            type="number"
            placeholder="00.00 TL"
            className="border rounded w-full h-10 outline-none px-3 font-medium"
            onChange={(e) => {
              setExpense({ ...expense, totalPrice: e.target.value });
            }}
          />
        </div>

        <div className="w-full mb-4">
          <div className="flex font-medium items-center mb-2">
            <span className="-mb-1">
              <span>{i18n.t("case.expenseForm.description")}</span>
            </span>
          </div>
          <textarea
            className="border rounded w-full h-20 outline-none px-3 py-2 font-medium"
            onChange={(e) => {
              setExpense({ ...expense, description: e.target.value });
            }}
          />
        </div>
      </div>
    </Modal>
  );
};
export default observer(CasePage);
