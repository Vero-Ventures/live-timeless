"use node";

import { Configuration, Environments } from "tremendous";
import { action } from "./_generated/server";
import { ProductsApi, OrdersApi } from "tremendous";
import { v } from "convex/values";

// when you are testing your code with the sandbox environment:
const configuration = new Configuration({
  basePath: Environments.testflight,
  accessToken: process.env.TREMENDOUS_API_KEY,
});

const client = new ProductsApi(configuration);
const orders = new OrdersApi(configuration);

export const listProductsAction = action({
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

export const getProductAction = action({
  args: { productId: v.string() },
  handler: async (_, { productId }) => {
    const { data } = await client.getProduct(productId);
    return data.product;
  },
});

export const redeemRewardAction = action({
  args: {
    productId: v.string(),
    name: v.string(),
    email: v.string(),
    denomination: v.number(),
  },
  handler: async (_, { productId, name, email, denomination }) => {
    const { data } = await orders.createOrder({
      payment: {
        funding_source_id: "BALANCE",
      },
      reward: {
        value: {
          denomination,
          currency_code: "CAD",
        },
        delivery: {
          method: "EMAIL",
        },
        recipient: {
          name,
          email,
        },
        products: [`${productId}`],
        campaign_id: "YVJ6EQ2I81WV",
      },
    });
    return data.order;
  },
});
