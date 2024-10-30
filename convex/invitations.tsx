import { addDays } from "date-fns";

import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { Resend } from "resend";
import LTWelcome from "./emails/LTWelcome";
import LTUserInvitation from "./emails/LTUserInvitation";
import { getAuthUserId } from "@convex-dev/auth/server";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

// === Owner Invitations ===
export const sendOwnerInvitation = mutation({
  args: {
    owner: v.object({ email: v.string(), name: v.string() }),
    orgName: v.string(),
  },
  handler: async (ctx, args) => {
    const orgId = await ctx.runMutation(
      internal.organizations.createOrganization,
      {
        name: args.orgName,
      }
    );

    const userId = await ctx.runMutation(internal.users.createUser, {
      email: args.owner.email,
      name: args.owner.name,
      organizationId: orgId,
      role: "owner",
    });

    await ctx.runMutation(internal.users.createAuthAccount, {
      email: args.owner.email,
      provider: "resend-otp",
      userId,
    });

    await ctx.scheduler.runAfter(
      0,
      internal.invitations.sendOwnerInvitationEmailAction,
      {
        owner: args.owner,
        orgName: args.orgName,
      }
    );

    return "success";
  },
});

export const sendOwnerInvitationEmailAction = internalAction({
  args: {
    owner: v.object({ email: v.string(), name: v.string() }),
    orgName: v.string(),
  },
  handler: async (_ctx, args) => {
    await resend.emails.send({
      from: "Live Timeless <no-reply@livetimeless.veroventures.com>",
      to: [args.owner.email],
      subject: "Welcome to Live Timeless",
      react: <LTWelcome email={args.owner.email} name={args.owner.name} />,
    });
  },
});

// === User Invitations ===
export const listInvitations = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (!(user.role === "owner") && !(user.role === "admin")) {
      throw new Error("Not the owner or admin of the organization");
    }

    const invitations = await ctx.db
      .query("invitations")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", user.organizationId)
      )
      .collect();

    const updatedInvitations = await Promise.all(
      invitations.map(async (invitation) => {
        if (invitation.status === "pending") {
          return invitation;
        }

        const user = await ctx.db
          .query("users")
          .withIndex("email", (q) => q.eq("email", invitation.email))
          .unique();

        if (!user) {
          throw new Error("Users not found");
        }

        return {
          ...invitation,
          role: user.role,
          userId: user._id,
        };
      })
    );

    return updatedInvitations;
  },
});

export const sendUserInvitation = mutation({
  args: {
    emails: v.array(v.string()),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!(user.role === "owner") && !(user.role === "admin")) {
      throw new Error("Not the owner or admin of the organization");
    }

    const owner = await ctx.runQuery(internal.users.getUserByOrgIdAndRole, {
      organizationId: user.organizationId,
      role: "owner",
    });

    await Promise.all(
      args.emails.map(async (email) => {
        const invitationId = await ctx.runMutation(
          internal.invitations.createInvitation,
          {
            email,
            organizationId: user.organizationId,
            role: args.role,
          }
        );

        const organization = await ctx.runQuery(
          internal.organizations.getOrganizationById,
          {
            organizationId: user.organizationId,
          }
        );
        await ctx.scheduler.runAfter(
          0,
          internal.invitations.sendUserInvitationEmailAction,
          {
            invitationId,
            email,
            organizationName: organization.name,
            ownerName: owner.name || "Owner",
            role: args.role,
          }
        );
      })
    );
  },
});

export const resendUserInvitation = mutation({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, { invitationId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === "user") {
      throw new Error("Not the owner or admin of the organization");
    }

    const thirtyDaysFromNow = addDays(new Date(), 30).getTime();

    await ctx.db.patch(invitationId, {
      expiresAt: thirtyDaysFromNow,
    });

    const invitation = await ctx.db.get(invitationId);

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    const owner = await ctx.runQuery(internal.users.getUserByOrgIdAndRole, {
      organizationId: user.organizationId,
      role: "owner",
    });

    const organization = await ctx.db.get(user.organizationId);

    if (!organization) {
      throw new Error("Organization not found");
    }

    await ctx.scheduler.runAfter(
      0,
      internal.invitations.sendUserInvitationEmailAction,
      {
        invitationId,
        email: invitation.email,
        role: invitation.role,
        ownerName: owner.name || "Owner",
        organizationName: organization.name,
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
    const user = await ctx.runQuery(internal.users.getUserByEmail, {
      email: invitation.email,
    });

    if (user) {
      return;
    }

    await ctx.db.patch(args.invitationId, {
      status: "accepted",
      expiresAt: Date.now(),
    });

    const userId = await ctx.runMutation(internal.users.createUser, {
      email: invitation.email,
      organizationId: invitation.organizationId,
      role: invitation.role,
    });

    await ctx.runMutation(internal.users.createAuthAccount, {
      email: invitation.email,
      provider: "resend-otp",
      userId,
    });
  },
});

export const deleteInvitation = mutation({
  args: {
    invitationId: v.id("invitations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!(user.role === "owner") && !(user.role === "admin")) {
      throw new Error("Not the owner or admin of the organization");
    }

    await ctx.db.delete(args.invitationId);
  },
});

export const sendUserInvitationEmailAction = internalAction({
  args: {
    email: v.string(),
    invitationId: v.id("invitations"),
    ownerName: v.string(),
    role: v.string(),
    organizationName: v.string(),
  },
  handler: async (_ctx, args) => {
    await resend.emails.send({
      from: "Live Timeless <no-reply@livetimeless.veroventures.com>",
      to: [args.email],
      subject: "Welcome to Live Timeless",
      react: (
        <LTUserInvitation
          role={args.role}
          org={args.organizationName}
          owner={args.ownerName}
          invitationId={args.invitationId}
        />
      ),
    });
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
