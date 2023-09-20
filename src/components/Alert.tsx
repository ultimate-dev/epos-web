import { observer } from "mobx-react-lite";
// Components
import Ripple from "./Ripple";
// Store
import IStore from "store/instant.store";

const Alert = () => {
  if (IStore.alert)
    return (
      <div className="fixed bottom-0 left-0 w-full z-20 animate__animated animate__fadeInUp">
        <div
          className={
            "w-full flex items-center bg-" + IStore.alert.color + " p-4 text-center shadow"
          }
        >
          <div className="flex-1">{IStore.alert.text}</div>
          <Ripple
            className="p-2 w-8 h-8 flex rounded items-center justify-center"
            onClick={() => IStore.hideAlert()}
          >
            <i className="ri-close-fill text-lg"></i>
          </Ripple>
        </div>
      </div>
    );
  else return null;
};

export default observer(Alert);
