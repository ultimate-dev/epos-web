import Ripple from "./Ripple";

class ModalProps {
  children: JSX.Element | JSX.Element[] | null;
  onClose: () => void;
  buttons: {
    color: string;
    textColor: string;
    text: string;
    block?: boolean;
    onClick: () => void;
  }[];
}
const Modal = ({ children = null, onClose = () => null, buttons = [] }: ModalProps) => {
  return (
    <div className="fixed left-0 top-0 w-full h-full z-50 flex items-center justify-center">
      <div
        onClick={onClose}
        className="absolute lef-0 top-0 bg-black bg-opacity-40 w-full h-full cursor-pointer animate__animated animate__fadeIn animate__faster"
      ></div>
      <div className="relative z-10 bg-white p-10 shadow rounded w-[500px] animate__animated animate__fadeInUp animate__faster">
        <div className="absolute right-2 top-2">
          <Ripple
            className="rounded w-8 h-8 flex items-center justify-center"
            onClick={onClose}
          >
            <i className="ri-close-fill text-2xl text-gray-600" />
          </Ripple>
        </div>
        {children}
        <div className="flex mt-4 -mx-2">
          {buttons.map((button, index: number) => (
            <div key={index} className={"px-2" + (button.block ? " flex-1" : "")}>
              <Ripple
                className={"w-full justify-center rounded bg-" + button.color}
                onClick={button.onClick}
              >
                <span className={"p-3 px-8 font-medium text-" + button.textColor}>
                  {button.text}
                </span>
              </Ripple>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Modal;
