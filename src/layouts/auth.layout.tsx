// Pages
import { useEffect } from "react";
import { Outlet } from "react-router";
// Store
import IStore from "store/instant.store";
import MStore from "store/main.store";

const AuthLayout = () => {
  useEffect(() => {
    MStore.clearToken();
    IStore.clearUser();
    IStore.socket?.disconnect();
    IStore.hideAlert()
  }, []);

  return (
    <div className="flex w-full h-full">
      <Outlet />
    </div>
  );
};
export default AuthLayout;
