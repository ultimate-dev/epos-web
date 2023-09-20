import AreaRepport from "components/AreaRepport";
import i18n from "i18n";

const GetirPage = () => {
  return (
    <div className="relative h-full w-full">
      <AreaRepport icon="code-s-slash" head={i18n.t("repport.verySoon")} />
    </div>
  );
};
export default GetirPage;
