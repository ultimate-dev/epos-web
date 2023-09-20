// Layouts
import AuthLayout from "layouts/auth.layout";
import DefaultLayout from "layouts/default.layout";
// Pages
import ErrorPage from "pages/error.page";
import LoginPage from "pages/auth/login.page";
import HomePage from "pages/home.page";
import TablesPage from "pages/tables.page";
import ProductsPage from "pages/products.page";
import PaymentPage from "pages/payment.page";
import KitchenPage from "pages/kitchen.page";
import CasePage from "pages/case.page";
import OrdersPage from "pages/orders.page";
import SettingsPage from "pages/settings.page";
import YemeksepetiPage from "pages/apps/yemeksepeti.page";
import GetirYemekPage from "pages/apps/getir.page";
import TrendyolYemekPage from "pages/apps/trendyol.page";

const routes: {
  path: string;
  element: any;
  props?: any;
  outlets?: { path: string; element: any; props?: any }[];
}[] = [
  {
    path: "/auth",
    element: AuthLayout,
    outlets: [
      {
        path: "/login",
        element: LoginPage,
      },
    ],
  },
  {
    path: "",
    element: DefaultLayout,
    outlets: [
      {
        path: "/",
        element: HomePage,
        props: {
          navbarVisible: false,
          sidebarVisible: false,
        },
      },
      {
        path: "/tables",
        element: TablesPage,
        props: {
          navbarVisible: true,
          sidebarVisible: true,
        },
      },
      {
        path: "/products/:tableId/:orderId",
        element: ProductsPage,
        props: {
          navbarVisible: true,
          sidebarVisible: true,
        },
      },
      {
        path: "/products/:tableId",
        element: PaymentPage,
        props: {
          navbarVisible: true,
          sidebarVisible: true,
        },
      },
      {
        path: "/products",
        element: ProductsPage,
        props: {
          navbarVisible: true,
          sidebarVisible: true,
        },
      },
      {
        path: "/kitchen",
        element: KitchenPage,
        props: {
          navbarVisible: true,
          sidebarVisible: true,
        },
      },
      {
        path: "/case",
        element: CasePage,
        props: {
          navbarVisible: true,
          sidebarVisible: true,
        },
      },
      {
        path: "/orders",
        element: OrdersPage,
        props: {
          navbarVisible: true,
          sidebarVisible: true,
        },
      },
      {
        path: "/settings",
        element: SettingsPage,
        props: {
          navbarVisible: true,
          sidebarVisible: true,
        },
      },

      {
        path: "/app/yemeksepeti",
        element: YemeksepetiPage,
        props: {
          navbarVisible: true,
          sidebarVisible: true,
        },
      },
      {
        path: "/app/getir-yemek",
        element: GetirYemekPage,
        props: {
          navbarVisible: true,
          sidebarVisible: true,
        },
      },
      {
        path: "/app/trendyol-yemek",
        element: TrendyolYemekPage,
        props: {
          navbarVisible: true,
          sidebarVisible: true,
        },
      },
    ],
  },
  {
    path: "/*",
    element: ErrorPage,
    props: { code: 404 },
  },
  {
    path: "/502",
    element: ErrorPage,
    props: { code: 502 },
  },
];

export default routes;
