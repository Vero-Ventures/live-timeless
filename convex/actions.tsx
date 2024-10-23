import { v } from "convex/values";
import { action, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { Resend } from "resend";
import LTWelcome from "./emails/LTWelcome";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const sendOwnerInvitation = action({
  args: {
    owner: v.object({ email: v.string(), name: v.string() }),
    orgName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.runMutation(internal.actions.createUser, {
      email: args.owner.email,
      name: args.owner.name,
    });
    const orgId = await ctx.runMutation(internal.actions.createOrganization, {
      name: args.orgName,
    });
    // put the newly created user in the members table with the newly created org
    await ctx.runMutation(internal.actions.createMember, {
      orgId,
      userId,
    });

    await resend.emails.send({
      from: "Live Timeless <no-reply@livetimeless.veroventures.com>",
      to: [args.owner.email],
      subject: "Welcome to Live Timeless",
      react: <LTWelcome email={args.owner.email} name={args.owner.name} />,
    });
    // optionally return a value
    return "success";
  },
});

export const createUser = internalMutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
    });
  },
});

export const createOrganization = internalMutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("organizations", {
      name: args.name,
      slug: getSlug(args.name),
    });
  },
});

export const createMember = internalMutation({
  args: {
    orgId: v.id("organizations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("members", {
      organizationId: args.orgId,
      userId: args.userId,
      role: "owner",
    });
  },
});

function getSlug(name: string) {
  return name.toLowerCase().split(" ").join("-");
}
