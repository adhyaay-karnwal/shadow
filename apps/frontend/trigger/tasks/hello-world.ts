import { task } from "@trigger.dev/sdk";

export const helloWorld = task({
  id: "hello-world",
  run: async () => {
    console.log("Hello, world!");
    return { message: "Hello, world!", timestamp: new Date().toISOString() };
  },
});