import { Link, useNavigate } from "react-router-dom";
import { observer, Observer } from "mobx-react-lite";
import { MetroSpinner } from "react-spinners-kit";

// Components
import Ripple from "./Ripple";
// Store
import IStore from "store/instant.store";

const Sidebar = ({ playBell }: { playBell: () => void }) => {
  let navigate = useNavigate();

  return (
    <div className="fixed left-0 top-0 w-16 h-full bg-primary border-r border-opacity-5 border-black z-30 shadow">
      <div
        className="absolute left-0 top-0 w-full h-full opacity-30 z-10"
        style={{
          backgroundImage: "url(" + require("assets/images/back-black.png") + ")",
          backgroundPosition: "center center",
          backgroundSize: 300,
        }}
      />
      <div className="relative w-full h-full flex flex-col justify-between z-20 pb-2">
        <div className="w-full flex flex-col items-center">
          <SideLogo />
          <SideButton icon="arrow-go-back" onClick={() => navigate(-1)} />
          <SideButton icon="refresh" onClick={() => window.location.reload()} />
          <SideButton icon="notification-3" onClick={() => playBell()} />
        </div>
        <Observer
          render={() => (
            <div className="w-full flex flex-col items-center">
              {document.fullscreenElement != null ? (
                <SideButton
                  icon="fullscreen-exit"
                  onClick={() => {
                    IStore.fullScreen.exit();
                  }}
                />
              ) : (
                <SideButton
                  icon="fullscreen"
                  onClick={() => {
                    IStore.fullScreen.enter();
                  }}
                />
              )}
              <SideButton icon="contrast-2" fill={false} />
            </div>
          )}
        />
      </div>
    </div>
  );
};

const SideLogo = () => {
  return (
    <Link to="/" className="p-2 w-full mb-1">
      <img
        draggable={false}
        src={require("assets/images/logo-light.png")}
        className="w-full h-full"
      />
    </Link>
  );
};
class SideButtonProps {
  icon?: string | JSX.Element;
  onClick?: () => void;
  fill?: boolean;
}
const SideButton = ({ onClick, icon, fill }: SideButtonProps) => {
  return (
    <Ripple
      onClick={onClick}
      className="w-12 h-12 rounded flex items-center justify-center p-2 my-1 bg-black bg-opacity-20"
    >
      {typeof icon == "string" ? (
        <i className={"ri-" + icon + "-" + (fill ? "fill" : "line") + " text-white text-2xl"} />
      ) : (
        icon
      )}
    </Ripple>
  );
};
export default observer(Sidebar);
