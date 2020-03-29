import * as fs from "fs";

export async function reload<U, T extends object>(importFn: () => Promise<U>, extractFn: (module: U) => T): Promise<T> {
  const oldKeys = new Set(Object.keys(require.cache));
  const module = await importFn();
  const newKeys = Object.keys(require.cache);
  const filesToWatch = newKeys.filter(x => !oldKeys.has(x));

  let extracted = extractFn(module);
  filesToWatch.forEach(file => {
    fs.watch(file, async () => {
      delete require.cache[file];
      try {
        extracted = extractFn(await importFn());
        console.log("Reloaded module " + file);
      } catch (err) {
        console.error("Error reloading module " + file + "\n" + err);
      }
    });
  });

  return new Proxy(extracted, {
    get: (_target: any, prop: PropertyKey) => Reflect.get(extracted, prop)
  });
}
