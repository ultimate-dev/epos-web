export const match = (
  array: any[],
  matchArray: any[],
  configs: { name: string; path?: string }
) => {
  try {
    let { name = "id", path } = configs;
    let arr: any = [];
    array.forEach((item) => {
      let matchItem = matchArray.find((matchItem) => item[name] == matchItem.id);
      if (matchItem) {
        if (path) item[path] = matchItem;
        else
          item = {
            ...matchItem,
            ...item,
          };
        arr.push(item);
      }
    });
    return <any[]>arr;
  } catch (err) {}
  return [];
};
