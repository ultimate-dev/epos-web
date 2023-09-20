import { useEffect, useState } from "react";
import Ripple from "./Ripple";

export class CalculatorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const Calculator = ({ value = "0", onChange = () => null }: CalculatorProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-end -mx-1">
        <div className="flex-1 p-1 text-right h-full">
          <div className="flex items-end h-full border-b w-full border-gray-200">
            <input
              type="text"
              className="bg-transparent outline-none text-right font-semibold text-gray-600 w-full text-4xl"
              value={Number(value)}
              onChange={(e) => onChange(e.target.value)}
            />
            <div className="ml-2 text-gray-400 font-semibold text-2xl">TL</div>
          </div>
        </div>
        <CalcButton
          value="Sil"
          className="text-red-400"
          onClick={() => onChange(value.slice(0, value.length - 1))}
          span={1}
        />
      </div>
      <div className="flex -mx-1">
        <CalcButton value="1" onClick={() => onChange(value + "1")} span={1} />
        <CalcButton value="2" onClick={() => onChange(value + "2")} span={1} />
        <CalcButton value="3" onClick={() => onChange(value + "3")} span={1} />
        <CalcButton
          value="1/2"
          className="text-gray-400"
          onClick={() => onChange(String(Number(value) / 2))}
          span={1}
        />
        <CalcButton
          value="1/3"
          className="text-gray-400"
          onClick={() => onChange(String(Number(value) / 3))}
          span={1}
        />
      </div>
      <div className="flex -mx-1">
        <CalcButton value="4" onClick={() => onChange(value + "4")} span={1} />
        <CalcButton value="5" onClick={() => onChange(value + "5")} span={1} />
        <CalcButton value="6" onClick={() => onChange(value + "6")} span={1} />
        <CalcButton
          value="1/4"
          className="text-gray-400"
          onClick={() => onChange(String(Number(value) / 4))}
          span={1}
        />
        <CalcButton
          value="1/6"
          className="text-gray-400"
          onClick={() => onChange(String(Number(value) / 6))}
          span={1}
        />
      </div>
      <div className="flex -mx-1">
        <CalcButton value="7" onClick={() => onChange(value + "7")} span={1} />
        <CalcButton value="8" onClick={() => onChange(value + "8")} span={1} />
        <CalcButton value="9" onClick={() => onChange(value + "9")} span={1} />
        <CalcButton
          value="1/10"
          className="text-gray-400"
          onClick={() => onChange(String(Number(value) / 8))}
          span={1}
        />
        <CalcButton
          value="1/8"
          className="text-gray-400"
          onClick={() => onChange(String(Number(value) / 10))}
          span={1}
        />
      </div>
      <div className="flex -mx-1">
        <CalcButton
          value="0"
          className="text-gray-400"
          onClick={() => onChange(value + "0")}
          span={4}
        />
        <CalcButton
          value="."
          className="text-gray-400"
          onClick={() => onChange(value + ".")}
          span={1}
        />
      </div>
    </div>
  );
};
export default Calculator;

class CalcButtonProps {
  value?: string;
  className?: string;
  onClick?: () => void;
  span: number;
}
const CalcButton = ({ value, className, onClick = () => null, span }: CalcButtonProps) => {
  return (
    <div className={"w-" + span + "/5 p-1 text-gray-600"}>
      <Ripple
        className={"flex items-center justify-center bg-white rounded shadow " + className}
        onClick={onClick}
      >
        <span className="text-xl font-semibold -mb-0.5 p-5">{value}</span>
      </Ripple>
    </div>
  );
};
