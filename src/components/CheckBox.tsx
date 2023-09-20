import Ripple from "./Ripple";

class CheckboxProps {
  className?: string;
  labelClassName?: string;
  helperClassName?: string;
  color?: string;
  bgColor?: string;
  label?: string | null;
  checked: boolean;
  onChange?: (checked: boolean) => void;
}
const CheckBox = ({
  className,
  labelClassName,
  helperClassName,
  color = "primary",
  bgColor = "gray-100",
  checked = false,
  label = null,
  onChange = () => null,
}: CheckboxProps) => {
  return (
    <div className={"inline-flex w-full items-center " + className}>
      <div className="w-8 h-8">
        <Ripple
          className={"w-full h-full rounded " + helperClassName}
          onClick={() => onChange(!checked)}
        >
          <div
            className={
              "relative w-full h-full" + (checked ? " bg-" + color : " bg-" + bgColor)
            }
          >
            {checked ? (
              <i className="absolute left-1/2 top-1/2 -ml-[12px] -mt-[16px] ri-check-fill text-white -mb-0.5 text-2xl" />
            ) : (
              <i className="absolute left-1/2 top-1/2 -ml-[12px] -mt-[16px] ri-check-fill text-gray-300 -mb-0.5 text-2xl" />
            )}
          </div>
        </Ripple>
      </div>
      {label && (
        <div
          onClick={() => onChange(!checked)}
          className={"ml-2 cursor-pointer -mb-0.5 text-gray-400 font-medium " + labelClassName}
        >
          {label}
        </div>
      )}
    </div>
  );
};
export default CheckBox;
