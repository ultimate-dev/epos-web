import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
// Moment
import moment from "moment";
import "moment/locale/tr";
import "moment/locale/de";
import "moment/locale/da";
import "moment/locale/es";
import "moment/locale/fr";
import "moment/locale/ar";
import "moment/locale/fa";
import "moment/locale/en-gb";
// Components
import Loading, { LineLoader } from "components/Loading";
import Alert from "components/Alert";
// i18n
import i18n from "i18n";
// Hooks
import useNetworkConnection from "hooks/useNetworkConnection";
// Store
import IStore from "store/instant.store";
import MStore from "store/main.store";
// routes
import routes from "constants/routes";
// Services
import { socket } from "services/socket.service";

function App() {
  let handle = useFullScreenHandle();

  IStore.setSocket(socket);

  useEffect(() => {
    if (MStore.locale) {
      i18n.locale = MStore.locale;
      moment.locale(MStore.locale);
      document.documentElement.lang = MStore.locale;
    }
  }, [MStore.locale]);

  useEffect(() => {
    IStore.setFullScreen(handle);
  }, []);

  let { isOnline } = useNetworkConnection();
  useEffect(() => {
    if (!isOnline)
      IStore.showAlert({ text: i18n.t("alert.noInternetConnection"), color: "yellow" });
    else IStore.hideAlert();
  }, [isOnline]);

  return (
    <FullScreen handle={handle} className="relative">
      <Loading />
      <LineLoader />
      <Alert />
      <Toaster />
      <ToastContainer position="bottom-right" style={{ marginBottom: 40 }} />
      <div className="fixed w-screen h-screen bg-body text-default overflow-hidden">
        <Router>
          <Routes>
            {routes.map((route, index: number) => (
              <Route key={index} path={route.path} element={<route.element {...route.props} />}>
                {route.outlets &&
                  route.outlets.map((outlet, index: number) => (
                    <Route
                      key={index}
                      path={route.path + outlet.path}
                      element={<outlet.element {...outlet.props} />}
                    />
                  ))}
              </Route>
            ))}
          </Routes>
        </Router>
      </div>
    </FullScreen>
  );
}

export default App;
