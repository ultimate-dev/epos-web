import Ripple from "./Ripple";
// Pattenrs
import { CategoryPattern } from "patterns/category.pattern";

class CategoryProps extends CategoryPattern {
  badge: number;
  active?: boolean;
  onClick?: () => void;
}
const Category = ({ name, badge, active, onClick }: CategoryProps) => {
  return (
    <div className="ml-2 h-full whitespace-nowrap">
      <Ripple
        className={
          "flex items-center px-4 rounded cursor-pointer" +
          (active ? " bg-primary text-white" : " bg-primary bg-opacity-10 text-primary")
        }
        onClick={onClick}
      >
        <>
          <span className="font-medium">{name}</span>
          {badge > 0 && (
            <div
              className={
                "flex items-center justify-center ml-2 rounded px-2 py-1 -mr-1" +
                (active ? " bg-white text-primary" : " bg-primary text-white")
              }
            >
              <span className="-mb-0.5 text-xs font-medium">{badge}</span>
            </div>
          )}
        </>
      </Ripple>
    </div>
  );
};
export default Category;
