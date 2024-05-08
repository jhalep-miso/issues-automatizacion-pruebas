export const screenshot = () => {
  return (target: any, propertyKey: string, descriptor: any) => {
    const fn = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const result = await fn.apply(this, args);
      await this.takeScreenshot(propertyKey);
      return result;
    };
  };
};

export function SkipScreenshot() {
  return function (target: any, propertyKey: string, descriptor: any) {
    const fn = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const result = await fn.apply(this, args);
      return result;
    };
    descriptor.value.ignoreScreenshot = true;
  };
}

export function ScreenshotAfterEachStep() {
  return function (constructor: Function) {
    for (let key of Reflect.ownKeys(constructor.prototype)) {
      if (key === "constructor") continue;
      let descriptor = Object.getOwnPropertyDescriptor(
        constructor.prototype,
        key
      ) as any;
      if (descriptor && typeof descriptor.value === "function") {
        const fn = descriptor.value;
        if (descriptor.value.ignoreScreenshot) continue;
        descriptor.value = async function (...args: any[]) {
          const result = await fn.apply(this, args);
          await this.takeScreenshot(key as string);
          return result;
        };
        Object.defineProperty(constructor.prototype, key, descriptor);
      }
    }
  };
}
