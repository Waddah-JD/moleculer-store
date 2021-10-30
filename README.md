![Moleculer logo](http://moleculer.services/images/banner.png)

# moleculer-store [![NPM version](https://img.shields.io/npm/v/moleculer-store.svg)](https://www.npmjs.com/package/moleculer-store)

Moleculer Key-Value store, with a built-in memory adapter

## Install

```bash
$ npm install moleculer-store --save
```

## A usage example

```js
"use strict";

const { serviceMixin, Adapters } = require("moleculer-store");
const { MemoryAdapter } = Adapters;

const broker = new ServiceBroker();

broker.createService({
  name: "numbers",
  mixins: [serviceMixin],
  adapter: new MemoryAdapter(),
});

broker
  .start()
  .then(async () => {
    const currectCount = await broker.call("numbers.get", { key: "currentCount" });
  })
  .catch((err) => console.log("err", err));
```

## Documentation

| Action |     REST     | parameters |      returns       | description                                                                                                        |
| :----: | :----------: | :--------: | :----------------: | ------------------------------------------------------------------------------------------------------------------ |
|  get   |  GET /:key   |    key     | value \| undefined | finds a value by key, returns undefined if no matching key is found                                                |
|  set   |  POST /:key  | key, value |       value        | sets and returns a value for existing and non-existing keys                                                        |
| update |  PUT /:key   | key, value |     key, value     | sets and returns a value for ONLY existing keys, throws an error if key doesn't exist                              |
| delete | DELETE /:key |    key     |      boolean       | deletes a single entry; returns a true if delete was successful (there is a matching key), otherwise retruns false |
| exists |              |    key     |      boolean       | checks if a key exists in a map                                                                                    |
|  keys  |              |            |       key []       | returns a list of found keys                                                                                       |
| values |              |            |      value []      | returns a list of found values                                                                                     |
| clear  |   DELETE /   |            |        void        | clears a map                                                                                                       |

## License

The project is available under the [MIT license](https://tldrlegal.com/license/mit-license).
