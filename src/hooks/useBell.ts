import useSound from "use-sound";
// Store
import MStore from "store/main.store";

const useBell = () => {
  let sound = require("assets/audios/bells/temple_bell.mp3");
  try {
    sound = require("assets/audios/bells/" + MStore.settings.bell + ".mp3");
  } catch (err) {}

  let [play, { stop, duration, }] = useSound(sound, {
    volume: MStore.settings.bellVolume,
  });

  return { play, stop, duration };
};
export default useBell;
