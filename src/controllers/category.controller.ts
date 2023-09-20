import { configure, makeAutoObservable } from "mobx";
// Networking
import axios, { APIS } from "networking";
// Patterns
import { CategoryPattern } from "patterns/category.pattern";
// Services
import { tranlateTolocalization } from "services/locale.service";

configure({ enforceActions: "never" });

class CategoryController {
  constructor() {
    makeAutoObservable(this);
  }
  getCategories = async () => {
    try {
      let { data } = await axios.get(APIS.CATEGORIES.rawValue);
      if (!data.error) return <CategoryPattern[]>tranlateTolocalization(data.categories);
    } catch (err) {}
    return [];
  };
}

export default CategoryController;
