"use node";

import { Configuration, Environments } from "tremendous";
import { action } from "./_generated/server";
import { ProductsApi } from "tremendous";

// when you are testing your code with the sandbox environment:
const configuration = new Configuration({
  basePath: Environments.testflight,
  accessToken: process.env.TREMENDOUS_API_KEY,
});

const client = new ProductsApi(configuration);

export const getRewardsAction = action({
  handler: async () => {
    const limit = 5;
    const offset = 0;
    const { data } = await client.listProducts("CA", "CAD", {
      params: {
        limit,
        offset,
      },
    });
    return data.products;
  },
});
