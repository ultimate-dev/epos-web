import Ripple from "components/Ripple";
import { APP_NAME, OWNER_NAME } from "constants/configs";
import useMomentTime from "hooks/useMomentTime";
import i18n from "i18n";
import moment from "moment";
import { useNavigate } from "react-router";
import MStore from "store/main.store";

const HomePage = () => {
  let navigate = useNavigate();
  let [date]: any = useMomentTime(() => new Date());

  const navs = [
    {
      title: i18n.t("routes.tables"),
      icon: require("assets/icons/tables.png"),
      to: "/tables",
    },
    {
      title: i18n.t("routes.products"),
      icon: require("assets/icons/products.png"),
      to: "/products",
    },
    {
      title: i18n.t("routes.kitchen"),
      icon: require("assets/icons/kitchen.png"),
      to: "/kitchen",
    },
    {
      title: i18n.t("routes.case"),
      icon: require("assets/icons/case.png"),
      to: "/case",
    },
    {
      title: i18n.t("routes.orders"),
      icon: require("assets/icons/orders.png"),
      to: "/orders",
    },
    {
      title: i18n.t("routes.settings"),
      icon: require("assets/icons/settings.png"),
      to: "/settings",
    },
  ];

  return (
    <div className="fixed left-0 top-0 z-50 w-full h-full flex items-center justify-center  bg-primary">
      <div
        className="w-full h-full absolute left-0 top-0"
        style={{
          backgroundImage: "url(" + require("assets/images/back-black.png") + ")",
          backgroundSize: "500px",
          opacity: 0.2,
          backgroundPosition: "center",
        }}
      />
      <div className="w-1/3 h-full flex flex-col justify-center items-center text-white z-10">
        <div>
          <div className="font-medium text-lg">{moment(date).format("DD MMM YYYY")}</div>
          <div className="font-bold text-8xl">{moment(date).format("HH:mm")}</div>
        </div>
      </div>
      <div className="w-2/3 h-full flex flex-col justify-center items-center z-10  text-white">
        <div className="flex my-3">
          {navs.slice(0, 3).map((nav, index) => (
            <div key={index} className="w-48 h-48 p-6">
              <Ripple
                className="w-full h-full bg-black bg-opacity-20 rounded flex items-center justify-center p-8"
                onClick={() => navigate(nav.to)}
              >
                <img draggable={false} src={nav.icon} className="w-full h-full" />
              </Ripple>
              <div className="w-full font-medium mt-2 text-center">
                {String(nav.title).toLocaleUpperCase(MStore.locale)}
              </div>
            </div>
          ))}
        </div>
        <div className="flex my-3">
          {navs.slice(3, 6).map((nav, index) => (
            <div key={index} className="w-48 h-48 p-6">
              <Ripple
                className="w-full h-full bg-black bg-opacity-20 rounded flex items-center justify-center p-8"
                onClick={() => navigate(nav.to)}
              >
                <img draggable={false} src={nav.icon} className="w-full h-full" />
              </Ripple>
              <div className="w-full font-medium mt-2 text-center">
                {String(nav.title).toLocaleUpperCase(MStore.locale)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
