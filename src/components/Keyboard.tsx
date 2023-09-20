import { useEffect, useRef, useState } from "react";
import RSKeyboard, { KeyboardReactInterface } from "react-simple-keyboard";

const Keyboard = (props: KeyboardReactInterface["options"]) => {
  let keyboardRef: { current: KeyboardReactInterface["options"] | undefined } = useRef();

  let [layoutName, setLayoutName] = useState("default");
  const onKeyPress = (buttonStr: string) => {
    if (buttonStr === "{shift}" || buttonStr === "{lock}") handleShift();
  };
  const handleShift = () => {
    setLayoutName(layoutName === "default" ? "shift" : "default");
  };

  useEffect(() => {
    if (keyboardRef && keyboardRef.current) keyboardRef.current.setInput(props.value);
  }, [props.value]);

  return (
    <RSKeyboard
      keyboardRef={(ref) => (keyboardRef.current = ref)}
      {...props}
      onKeyPress={onKeyPress}
      layoutName={layoutName}
    />
  );
};
export default Keyboard;
