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
