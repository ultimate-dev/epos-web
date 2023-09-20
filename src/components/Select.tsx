import ReactSelect from "react-select";
// i18n
import i18n from "i18n";

class SelectProps {
  options: any[];
  onChange?: (e: any) => void;
  value?: number | string;
  defaultValue?: number | string;
}
const Select = ({ options = [], onChange = () => null, value, defaultValue }: SelectProps) => {
  return (
    <ReactSelect
      placeholder={i18n.t(`NOCHOICE`)}
      defaultValue={defaultValue}
      onChange={onChange}
      options={[{ label: i18n.t(`NOCHOICE`), value: 0 }, ...options]}
      styles={{
        control: (styles) => ({
          ...styles,
          minWidth: 200,
          border: "1px solid rgba(0, 0, 0, 0.10)",
        }),
      }}
    />
  );
};
export default Select;
