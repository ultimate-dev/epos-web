import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toJS } from "mobx";
// Components
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";
// i18n
import i18n from "i18n";
// Store
import IStore from "store/instant.store";
import MStore from "store/main.store";
// Hooks
import useBell from "hooks/useBell";
// Controller
import AuthController from "controllers/auth.controller";
import TableController from "controllers/table.controller";
import OrderController from "controllers/order.controller";
import ProductController from "controllers/product.controller";
import RestaurantController from "controllers/restaurant.controller";
import CategoryController from "controllers/category.controller";
import PaymentController from "controllers/payment.controller";

const DefaultLayout = () => {
  let { play, stop, duration } = useBell();

  let navigate = useNavigate();

  let [c] = useState(new AuthController(navigate));
  let [tableC] = useState(new TableController());
  let [orderC] = useState(new OrderController());
  let [productC] = useState(new ProductController());
  let [categoryC] = useState(new CategoryController());
  let [restaurantC] = useState(new RestaurantController());

  const getDatas = async () => {
    IStore.showLoading();
    IStore.restaurant = await restaurantC.getRestaurant();
    IStore.tables = await tableC.getTables();
    IStore.products = await productC.getProducts();
    IStore.categories = await categoryC.getCategories();
    IStore.orders = await orderC.getOrders();
    IStore.hideLoading();
  };

  useEffect(() => {
    c.verifyAuth(MStore.token);
    getDatas();
  }, []);

  useEffect(() => {
    IStore.socket?.on("connect", () => {
      IStore.hideAlert();
    });
    IStore.socket?.on("disconnect", () => {
      IStore.showAlert({ text: i18n.t("alert.noServerConnection"), color: "yellow" });
    });
    IStore.socket?.on("order.update", async () => {
      IStore.orders = await orderC.getOrders();
    });
    IStore.socket?.on("order.bell", () => {
      Array(MStore.settings.bellAgain)
        .fill(null)
        .forEach((k, i) => {
          if (duration)
            setTimeout(() => {
              play();
            }, i * duration);
        });
    });
  }, []);

  if (MStore.token)
    return (
      <>
        <Navbar />
        <Sidebar
          playBell={() => {
            stop();
            play();
          }}
        />
        <div className="w-full h-full pl-16 pt-16">
          <Outlet />
        </div>
      </>
    );
  else return null;
};
export default DefaultLayout;
