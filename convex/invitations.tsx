import { addDays } from "date-fns";

import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { Resend } from "resend";
import LTWelcome from "./emails/LTWelcome";
import LTUserInvitation from "./emails/LTUserInvitation";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

// === Owner Invitations ===
export const sendOwnerInvitation = mutation({
  args: {
    owner: v.object({ email: v.string(), name: v.string() }),
    orgName: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.scheduler.runAfter(
      0,
      internal.invitations.sendOwnerInvitationAction,
      {
        owner: args.owner,
        orgName: args.orgName,
      }
    );
  },
});

export const sendOwnerInvitationAction = internalAction({
  args: {
    owner: v.object({ email: v.string(), name: v.string() }),
    orgName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.runMutation(internal.users.createUser, {
      email: args.owner.email,
      name: args.owner.name,
    });
    const orgId = await ctx.runMutation(
      internal.organizations.createOrganization,
      {
        name: args.orgName,
      }
    );
    // put the newly created user in the members table with the newly created org
    await ctx.runMutation(internal.members.createMember, {
      orgId,
      userId,
      role: "owner",
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

// === User Invitations ===
export const sendUserInvitation = mutation({
  args: {
    email: v.string(),
    organizationId: v.id("organizations"),
    role: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.scheduler.runAfter(
      0,
      internal.invitations.sendUserInvitationAction,
      {
        email: args.email,
        organizationId: args.organizationId,
        role: args.role,
        expiresAt: args.expiresAt,
      }
    );
  },
});

export const resendUserInvitation = mutation({
  args: {
    email: v.string(),
    organizationId: v.id("organizations"),
    role: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.invitations.deleteExistingInvitation, {
      email: args.email,
      organizationId: args.organizationId,
    });

    await ctx.scheduler.runAfter(
      0,
      internal.invitations.sendUserInvitationAction,
      {
        email: args.email,
        organizationId: args.organizationId,
        role: args.role,
        expiresAt: args.expiresAt,
      }
    );
  },
});

export const acceptInvitation = mutation({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args) => {
    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) {
      throw new Error("Invitation not found");
    }

    await ctx.db.patch(args.invitationId, {
      status: "accepted",
      expiresAt: Date.now(),
    });

    const userId = await ctx.runMutation(internal.users.createUser, {
      email: invitation.email,
    });

    await ctx.runMutation(internal.members.createMember, {
      orgId: invitation.organizationId,
      userId,
      role: invitation.role,
    });
  },
});

export const deleteInvitation = mutation({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.invitationId);
  },
});

export const sendUserInvitationAction = internalAction({
  args: {
    email: v.string(),
    organizationId: v.id("organizations"),
    role: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.invitations.createInvitation, {
      email: args.email,
      organizationId: args.organizationId,
      role: args.role,
      expiresAt: args.expiresAt,
    });

    const organization = await ctx.runQuery(
      internal.organizations.getOrganizationById,
      {
        organizationId: args.organizationId,
      }
    );

    // Get the owner of the organization
    const member = await ctx.runQuery(
      internal.members.getMemberByOrgIdAndRole,
      {
        orgId: args.organizationId,
        role: "owner",
      }
    );
    const owner = await ctx.runQuery(internal.users.getUserById, {
      userId: member.userId,
    });

    await resend.emails.send({
      from: "Live Timeless <no-reply@livetimeless.veroventures.com>",
      to: [args.email],
      subject: "Welcome to Live Timeless",
      react: (
        <LTUserInvitation
          role={args.role}
          org={organization.name}
          owner={owner.name || "Owner"}
        />
      ),
    });

    return "success";
  },
});

export const getInvitation = internalQuery({
  args: {
    email: v.string(),
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("invitations")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", args.organizationId)
      )
      .filter((q) => q.eq(q.field("email"), args.email))
      .unique();
  },
});

export const createInvitation = internalMutation({
  args: {
    email: v.string(),
    organizationId: v.id("organizations"),
    role: v.string(),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    const thirtyDaysFromNow = addDays(new Date(), 30).getTime();

    return await ctx.db.insert("invitations", {
      email: args.email,
      organizationId: args.organizationId,
      role: args.role,
      status: "pending",
      expiresAt: thirtyDaysFromNow,
    });
  },
});

export const deleteExistingInvitation = internalMutation({
  args: {
    email: v.string(),
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const existingInvitation = await ctx.runQuery(
      internal.invitations.getInvitation,
      {
        email: args.email,
        organizationId: args.organizationId,
      }
    );

    if (existingInvitation) {
      await ctx.db.delete(existingInvitation._id);
    }
  },
});
