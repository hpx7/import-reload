## IMPORT-RELOAD

Module reloading for Node.js

`import-reload` is a NPM module that lets you live-reload modules when they are modified without requiring server restart.

## INSTALL

```shell
$ npm install import-reload
```

## USAGE

### Example

```ts
// foo.ts
export const foo = { bar: 1 };
```

```ts
// main.ts
import { reload } from "import-reload";

const foo = await reload(
  () => import("./foo"),
  Foo => Foo.foo
);

console.log(foo.bar); // outputs 1
```

Then modify foo.ts:

```ts
// foo.ts
export const foo = { bar: 2 };
```

Back in main:

```ts
console.log(foo.bar); // outputs 2
```

## API

```ts
reload<U, T extends object>(importFn: () => Promise<U>, extractFn: (module: U) => T): Promise<T>;
```

`importFn` should use the dynamic import function, e.g. `() => import("./module)`.

`extractFn` takes in the module returned by the import and returns the object to be used by the program.
