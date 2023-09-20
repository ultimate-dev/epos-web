// Store
import { observer } from "mobx-react-lite";
import IStore from "store/instant.store";

class AreaRepportProps {
  icon: string;
  head?: string;
  body?: any;
}
const AreaRepport = ({ icon, head, body }: AreaRepportProps) => {
  if (!IStore.loading)
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 py-20 px-10">
        <div className="flex flex-col justify-center items-center w-full rounded p-5 animate__animated animate__fadeIn">
          <i className={"ri-" + icon + "-fill text-gray-300 text-7xl mb-1"} />
          {head && <div className="font-medium text-center text-gray-400">{head}</div>}
          {body && body}
        </div>
      </div>
    );
  else return null;
};
export default observer(AreaRepport);
