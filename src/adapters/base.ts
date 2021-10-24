/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

class BaseAdapter {
  init(service) {
    throw new Error("'init' method must be overriden by adapter");
  }

  connect() {
    throw new Error("'connect' method must be overriden by adapter");
  }

  disconnect() {
    throw new Error("'disconnect' method must be overriden by adapter");
  }

  get(key) {
    throw new Error("'get' method must be overriden by adapter");
  }

  set(key, value) {
    throw new Error("'get' method must be overriden by adapter");
  }
}

export default BaseAdapter;
