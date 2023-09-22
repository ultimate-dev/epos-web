import { useEffect, useState } from "react";
import { ImpulseSpinner } from "react-spinners-kit";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
// Configs
import { APP_NAME } from "constants/configs";
// Components
import Ripple from "components/Ripple";
import Checkbox from "components/CheckBox";
// i18n
import i18n from "i18n";
// Store
import IStore from "store/instant.store";
// Controllers
import AuthController from "controllers/auth.controller";

const LoginPage = () => {
  let navigate = useNavigate();
  let [c] = useState(new AuthController(navigate));

  useEffect(() => {
    document.addEventListener("keydown", c.enterDown);
    return () => {
      document.removeEventListener("keydown", c.enterDown);
    };
  }, [c.login]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-1/2 h-full flex flex-col text-white items-center justify-center bg-primary relative shadow">
        <div
          className="w-full h-full absolute left-0 top-0"
          style={{
            backgroundImage: "url(" + require("assets/images/back-black.png") + ")",
            backgroundSize: "500px",
            opacity: 0.2,
            backgroundPosition: "center",
          }}
        />
        <div className="flex items-center z-10">
          <img
            src={require("assets/images/logo-light.png")}
            className="w-32"
            draggable={false}
          />
          <div className="-mb-5 ml-3" style={{ textShadow: "0 0 10px rgba(0,0,0,0.08)" }}>
            <div className="font-bold text-6xl">{APP_NAME}</div>
           {/* <div className="font-semibold text-2xl">{OWNER_NAME}</div>*/}
          </div>
        </div>
      </div>

      <div className="w-1/2 h-full flex items-center justify-center">
        <div className="flex flex-col w-96">
          <div className="w-full mb-4">
            <label className="block font-semibold text-gray-600 p-1">
              {i18n.t("auth.email")}
            </label>
            <input
              type="email"
              name="email"
              className={
                "w-full text-gray-500 outline-none font-medium h-12 rounded px-5 shadow" +
                (c.controlRememberMe() ? " bg-blue-400 bg-opacity-20" : " bg-white")
              }
              value={c.login.email}
              onChange={(e) => c.setLogin({ ...c.login, email: e.target.value })}
            />
          </div>
          <div className="w-full mb-6">
            <label className="block font-semibold text-gray-600 p-1">
              {i18n.t("auth.password")}
            </label>
            <input
              type="password"
              name="password"
              className={
                "w-full text-gray-500 outline-none font-medium h-12 rounded px-5 shadow" +
                (c.controlRememberMe() ? " bg-blue-400 bg-opacity-20" : " bg-white")
              }
              value={c.login.password}
              onChange={(e) => c.setLogin({ ...c.login, password: e.target.value })}
            />
          </div>

          <div className="w-full flex items-center mb-6">
            <Checkbox
              bgColor="white"
              helperClassName="shadow"
              labelClassName="text-gray-600 font-semibold"
              label={i18n.t("auth.rememberMe")}
              checked={c.login.rememberme}
              onChange={() => c.setLogin({ ...c.login, rememberme: !c.login.rememberme })}
            />
          </div>

          <div className="w-full">
            <button
              className={
                "w-full bg-primary text-white rounded font-medium shadow" +
                ((!c.login.password || !c.login.email) && " opacity-80")
              }
            >
              <Ripple
                className="flex items-center justify-center h-14 rounded"
                onClick={() => c.onLogin(c.login)}
                disabled={!c.login.password || !c.login.email}
              >
                {IStore.loading ? (
                  <ImpulseSpinner backColor="#fff" frontColor="#fff" />
                ) : (
                  <span className="-mb-0.5">{i18n.t("auth.login")}</span>
                )}
              </Ripple>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default observer(LoginPage);
