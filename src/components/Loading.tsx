import { ImpulseSpinner } from "react-spinners-kit";
import LoadingBar from "react-top-loading-bar";
// Store
import IStore from "store/instant.store";
import { observer } from "mobx-react-lite";

const Loading = observer(() => {
  if (IStore.loading)
    return (
      <div className="flex items-center justify-center fixed w-full h-full bg-black bg-opacity-40 z-50">
        <div className="flex flex-col items-center z-10 -mt-10">
          <img
            src={require("assets/images/logo-light.png")}
            className="w-32 mb-5"
            draggable={false}
          />
          <div className="-ml-2">
            <ImpulseSpinner backColor="#fff" frontColor="#fff" size={55} />
          </div>
        </div>
      </div>
    );
  else return null;
});

const Loader = observer(({ areaId }: { areaId?: number }) => {
  if (IStore.loader == true || IStore.loader == areaId)
    return (
      <div className="absolute top-0 left-0 bg-black bg-opacity-20 w-full h-full flex items-center justify-center z-30">
        <ImpulseSpinner backColor="#fff" frontColor="#fff" />
      </div>
    );
  else return null;
});

const LineLoader = observer(() => {
  return (
    <LoadingBar
      color="#f11946"
      progress={IStore.sync == null ? 0 : IStore.sync == true ? 100 : 0}
    />
  );
});

export { Loader, LineLoader };
export default Loading;
