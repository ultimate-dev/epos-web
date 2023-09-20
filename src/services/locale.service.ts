// Store
import MStore from "store/main.store";

export const tranlateTolocalization = (
  arr: { translations: { code: string; area: string; translate: string }[] }[]
) => {
  try {
    return <any[]>arr.map((item) => {
      item.translations &&
        item.translations
          .filter((translate) => translate.translate && translate.code == MStore.locale)
          .map((translate) => {
            // @ts-ignore
            item[translate.area] = translate.translate;
          });
      return { ...item };
    });
  } catch (err) {}
  return arr;
};
