import { observer } from "mobx-react-lite";
// Components
import Ripple from "components/Ripple";
// i18n
import i18n, { translations } from "i18n";
// Store
import MStore from "store/main.store";

const OrderStatusSelections = [
  { label: i18n.t("orderStatusSelection.inLine"), value: "inLine" },
  { label: i18n.t("orderStatusSelection.multiple"), value: "multiple" },
];

const BellSounds = [
  { label: "Temple Bell", value: "temple_bell" },
  { label: "Bell Ring", value: "bell_ring" },
];

const SettingsPage = () => {
  return (
    <div className="p-2 w-full h-full flex justify-center items-center">
      <div className="bg-white w-[440px] p-5 rounded shadow">
        <div className="my-2 bg-yellow px-4 py-2 rounded bg-opacity-10 text-yellow">
          {i18n.t("settings.message")}
        </div>
        <div className="my-2">
          <label className="text-gray-600">{i18n.t("settings.orderStatusSelection")}</label>
          <select
            className="rounded border border-black border-opacity-5 w-full p-2"
            defaultValue={MStore.settings.orderStatusSelection}
            onChange={(e) =>
              MStore.setSettings({ ...MStore.settings, orderStatusSelection: e.target.value })
            }
          >
            {OrderStatusSelections.map(({ label, value }, index) => (
              <option key={index} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="my-2">
          <label className="text-gray-600">{i18n.t("settings.ringTone")}</label>
          <select
            className="rounded border border-black border-opacity-5 w-full p-2"
            defaultValue={MStore.settings.bell}
            onChange={(e) => MStore.setSettings({ ...MStore.settings, bell: e.target.value })}
          >
            {BellSounds.map(({ label, value }, index) => (
              <option key={index} value={value}>
                {label}
              </option>
            ))}
          </select>
          <input
            type="range"
            max={1}
            step={0.1}
            min={0}
            className="w-full"
            value={MStore.settings.bellVolume}
            onChange={(e) =>
              MStore.setSettings({
                ...MStore.settings,
                bellVolume: parseFloat(e.target.value),
              })
            }
          />
        </div>
        <div className="my-2">
          <label className="text-gray-600">{i18n.t("settings.ringAgain")}</label>
          <select
            className="rounded border border-black border-opacity-5 w-full p-2"
            value={MStore.settings.bellAgain}
            onChange={(e) =>
              MStore.setSettings({ ...MStore.settings, bellAgain: parseInt(e.target.value) })
            }
          >
            {Array(5)
              .fill(null)
              .map((k, index) => (
                <option key={index} value={index + 1}>
                  {index + 1 + " " + i18n.t("settings.again")}
                </option>
              ))}
          </select>
        </div>
        <div className="my-2">
          <label className="text-gray-600">{i18n.t("settings.language")}</label>
          <div className="flex items-center flex-wrap justify-center">
            {Object.keys(translations).map((key, index) => (
              <div className="m-1">
                <Ripple
                  className={
                    "rounded p-1" + (MStore.locale == key ? " bg-primary" : " bg-gray-200")
                  }
                  onClick={() => MStore.setLocale(key)}
                >
                  <img
                    draggable={false}
                    key={index}
                    src={require("assets/images/flags/" + key + ".png")}
                    className="w-10 cursor-pointer shadow"
                  />
                </Ripple>
              </div>
            ))}
          </div>
        </div>
        <div className="my-2">
          <div className="flex items-center flex-wrap justify-center">
            <Ripple
              className="bg-primary rounded justify-center"
              onClick={() => window.location.reload()}
            >
              <span className="text-white p-2 font-medium">{i18n.t("button.saveAndRefresh")}</span>
            </Ripple>
          </div>
        </div>
      </div>
    </div>
  );
};
export default observer(SettingsPage);
