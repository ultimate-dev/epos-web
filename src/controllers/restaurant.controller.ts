import { configure, makeAutoObservable } from "mobx";
// Networking
import axios, { APIS } from "networking";
// Pattenrs
import { RestaurantPattern } from "patterns/restaurant.pattern";

configure({ enforceActions: "never" });

class RestaurantController {
  constructor() {
    makeAutoObservable(this);
  }
  getRestaurant = async () => {
    try {
      let { data } = await axios.get(APIS.RESTAURANT.rawValue);
      if (!data.error) return <RestaurantPattern>data.restaurant;
    } catch (err) {}
    return null;
  };
}

export default RestaurantController;
