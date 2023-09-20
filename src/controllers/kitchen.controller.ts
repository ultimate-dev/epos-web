import { configure, makeAutoObservable } from "mobx";

configure({ enforceActions: "never" });

class KitchenController {
  constructor() {
    makeAutoObservable(this);
  }
}

export default KitchenController;
