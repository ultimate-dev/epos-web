import { useEffect, useState, useRef } from "react";
import moment from "moment";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Observer } from "mobx-react-lite";
// Hooks
import useOutsideClick from "hooks/useOutsideClick";
// Components
import Ripple from "./Ripple";
// i18n
import i18n from "i18n";
// Patterns
import { UserPattern } from "patterns/user.pattern";
// Hooks
import useMomentTime from "hooks/useMomentTime";
// Store
import IStore from "store/instant.store";
import MStore from "store/main.store";

const Navbar = () => {
  let [date]: any = useMomentTime(() => new Date());

  return (
    <div className="fixed left-0 top-0 w-full bg-white h-16 border-b border-opacity-5 border-black z-20 shadow pl-16">
      <div className="w-full h-full flex justify-between items-center px-3">
        <div className="flex items-center">
          <div className="text-3xl font-bold text-gray-600 -mb-1">
            {moment(date).format("HH:mm")}
          </div>
          <div className="flex flex-col items-start pl-2 ml-2 border-l border-black border-opacity-5">
            <div className="text-xl font-bold -mt-1 -mb-2 uppercase text-gray-400">
              {moment(date).format("dddd")}
            </div>
            <div className="text-sm text-primary font-medium -mb-1">
              {moment(date).format("DD MMM YYYY")}
            </div>
          </div>
        </div>
        <Observer
          render={() => (
            <div className="flex flex-1 items-center px-5">
              <NavButton
                name={i18n.t("routes.tables").toLocaleUpperCase(MStore.locale)}
                to="/tables"
              />
              <NavButton
                name={i18n.t("routes.products").toLocaleUpperCase(MStore.locale)}
                to="/products"
              />
              <NavButton
                name={i18n.t("routes.kitchen").toLocaleUpperCase(MStore.locale)}
                to="/kitchen"
              />
              <NavButton name={i18n.t("routes.case").toLocaleUpperCase(MStore.locale)} to="/case" />
              <NavButton
                name={i18n.t("routes.orders").toLocaleUpperCase(MStore.locale)}
                to="/orders"
              />
              <NavButtonSrc
                to="/app/yemeksepeti"
                src={require("assets/images/yemeksepeti-logo.png")}
                color="yemeksepeti"
              />
              <NavButtonSrc
                to="/app/getir-yemek"
                src={require("assets/images/getir-logo.png")}
                color="getir"
              />
              <NavButtonSrc
                to="/app/trendyol-yemek"
                src={require("assets/images/trendyol-logo.png")}
                color="trendyol"
              />
            </div>
          )}
        />
        <div className="flex items-center justify-end">
          {IStore.user && <Profile {...IStore.user} />}
        </div>
      </div>
    </div>
  );
};

class NavButtonProps {
  name: string;
  to: string;
}
const NavButton = ({ name = "", to = "/" }: NavButtonProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        "h-10 px-5 rounded mx-1 flex items-center" +
        (isActive ? " bg-primary text-white" : " bg-body text-gray-500")
      }
    >
      <span className="block text-sm font-medium uppercase -mb-0.5">{name}</span>
    </NavLink>
  );
};
class NavButtonSrcProps {
  src: string;
  color: string;
  to: string;
}
const NavButtonSrc = ({ src = "", to = "/", color = "primary" }: NavButtonSrcProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        "h-10 p-3 bg-" + color + " rounded mx-1" + (isActive ? " opacity-100" : " opacity-70")
      }
    >
      <img draggable={false} src={src} className="w-auto h-full object-contain" />
    </NavLink>
  );
};
class ProfileProps extends UserPattern {}
const Profile = ({ name, surname, letters, email, role }: ProfileProps) => {
  let location = useLocation();
  let menuRef: any = useRef();
  let [open, setOpen]: any = useState(null);
  useOutsideClick(menuRef, () => setOpen(open == null ? null : false));
  useEffect(() => {
    setOpen(null);
  }, [location.pathname]);
  return (
    <div>
      <Ripple
        className="flex items-center cursor-pointer rounded py-1 px-2"
        onClick={() => setOpen(true)}
      >
        <div className="flex flex-col justify-center items-end pr-3">
          <div className="font-semibold -mb-1">{name + " " + surname}</div>

          <div className="flex items-center font-medium text-primary opacity-60 text-xs">
            {i18n.t("userRole." + role)}
          </div>
        </div>
        <div className="w-10 h-10 flex items-center justify-center bg-primary rounded">
          <span className="-mb-0.5 text-white font-semibold">{letters}</span>
        </div>
      </Ripple>
      {open !== null && (
        <div
          ref={menuRef}
          className={
            "absolute right-0 top-full mt-2 bg-white rounded shadow w-80 p-2 animate__animated animate__faster" +
            (open ? " animate__fadeInRight" : " animate__fadeOutRight")
          }
        >
          <div className="flex items-center mb-3">
            <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
              <span className="text-lg font-semibold text-gray-500 -mb-0.5">ST</span>
            </div>
            <div className="ml-3">
              <div className="flex items-center font-medium text-primary opacity-60 text-xs -mb-1">
                {i18n.t("userRole." + role)}
              </div>
              <div className="text-gray-600 text-lg font-medium -mb-1">{name + " " + surname}</div>
              <div className="text-gray-400">{email}</div>
            </div>
          </div>
          <div className="w-full flex flex-col mb-1">
            <Link
              to="/settings"
              className="px-3 pt-2 w-100 text-gray-500 border-b border-black border-opacity-5 cursor-pointer  flex items-center"
            >
              <i className="ri-settings-fill mr-1" />
              <span>{i18n.t("routes.settings")}</span>
            </Link>
          </div>
          <div className="w-full flex flex-col mt-2">
            <Link
              to="/auth/login"
              className="p-2 w-100 bg-primary rounded text-center text-white font-medium"
            >
              {i18n.t("auth.logOut")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
export default Navbar;
