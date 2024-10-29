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
    await ctx.scheduler.runAfter(
      0,
      internal.invitations.sendOwnerInvitationAction,
      {
        owner: args.owner,
        orgName: args.orgName,
      }
    );
    return "success";
  },
});

export const sendOwnerInvitationAction = internalAction({
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

    const updatedInvitations = invitations.map(async (invitation) => {
      if (invitation.status !== "pending") {
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
          name: user.name || "",
        };
      }
      return invitation;
    });

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
      args.emails.map((email) =>
        ctx.scheduler.runAfter(
          0,
          internal.invitations.sendUserInvitationAction,
          {
            email,
            organizationId: user.organizationId,
            ownerName: owner.name || "Owner",
            role: args.role,
          }
        )
      )
    );
  },
});

export const resendUserInvitation = mutation({
  args: {
    email: v.string(),
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

    await ctx.runMutation(internal.invitations.deleteExistingInvitation, {
      email: args.email,
      organizationId: user.organizationId,
    });

    await ctx.scheduler.runAfter(
      0,
      internal.invitations.sendUserInvitationAction,
      {
        email: args.email,
        organizationId: user.organizationId,
        ownerName: owner.name || "Owner",
        role: args.role,
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

    await ctx.runMutation(internal.users.createUser, {
      email: invitation.email,
      organizationId: invitation.organizationId,
      role: invitation.role,
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

export const sendUserInvitationAction = internalAction({
  args: {
    email: v.string(),
    organizationId: v.id("organizations"),
    ownerName: v.string(),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const invitationId = await ctx.runMutation(
      internal.invitations.createInvitation,
      {
        email: args.email,
        organizationId: args.organizationId,
        role: args.role,
      }
    );

    const organization = await ctx.runQuery(
      internal.organizations.getOrganizationById,
      {
        organizationId: args.organizationId,
      }
    );

    await resend.emails.send({
      from: "Live Timeless <no-reply@livetimeless.veroventures.com>",
      to: [args.email],
      subject: "Welcome to Live Timeless",
      react: (
        <LTUserInvitation
          role={args.role}
          org={organization.name}
          owner={args.ownerName}
          invitationId={invitationId}
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
