import { makeAutoObservable, configure } from "mobx";
import { Socket } from "socket.io-client";
// Patterns
import { UserPattern } from "patterns/user.pattern";
import { CategoryPattern } from "patterns/category.pattern";
import { OrderPattern } from "patterns/order.pattern";
import { ProductPattern } from "patterns/product.pattern";
import { RestaurantPattern } from "patterns/restaurant.pattern";
import { TablePattern } from "patterns/table.pattern";

configure({ enforceActions: "never" });
class InstantStoreC {
  sync: boolean | null = null;
  loading: boolean = false;
  loader: number | boolean = false;
  fullScreen: any = null;
  alert: { text: string; color: string } | null;
  user: UserPattern | null = null;
  socket: Socket | null = null;

  restaurant: RestaurantPattern | null = null;
  products: ProductPattern[] = [];
  tables: TablePattern[] = [];
  categories: CategoryPattern[] = [];
  orders: OrderPattern[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Loading
  showLoading = () => (this.loading = true);
  hideLoading = () => (this.loading = false);
  showLoader = (int?: number) => (this.loader = int ? int : true);
  hideLoader = () => (this.loader = false);
  // App
  setFullScreen = (handle: any) => (this.fullScreen = handle);
  showAlert = (alert: { text: string; color: string }, duration?: number) => {
    this.alert = alert;
    if (duration) setTimeout(this.hideAlert, duration);
  };
  hideAlert = () => (this.alert = null);
  // User
  setUser = (user: UserPattern) => (this.user = user);
  clearUser = () => (this.user = null);
  // Socket
  setSocket = (socket: Socket) => (this.socket = socket);
}

const IStore = new InstantStoreC();

export default IStore;
