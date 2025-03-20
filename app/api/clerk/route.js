import { Webhook } from "svix";
import { NextResponse } from "next/server";
import dataBaseConnection from "@/config/databaseConnection";
import User from "@/models/userModel";
import { headers } from "next/headers";

export async function POST(req) {
  try {
    await dataBaseConnection(); // Ensure DB is connected

    // Check for Signing Secret in Environment Variables
    const signingSecret = process.env.SIGNING_SECRET;
    if (!signingSecret) {
      console.error("❌ SIGNING_SECRET is missing in environment variables.");
      return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }

    // Initialize Webhook
    const wh = new Webhook(signingSecret);

    // Get request headers
    const svixHeaders = {
      "svix-id": req.headers.get("svix-id"),
      "svix-timestamp": req.headers.get("svix-timestamp"),
      "svix-signature": req.headers.get("svix-signature"),
    };

    // Ensure all required headers are present
    if (!svixHeaders["svix-id"] || !svixHeaders["svix-timestamp"] || !svixHeaders["svix-signature"]) {
      console.error("❌ Missing required Svix headers");
      return NextResponse.json({ error: "Invalid webhook request." }, { status: 400 });
    }

    // Parse Request Body
    const payload = await req.json();
    const bodyString = JSON.stringify(payload);

    // Verify Webhook Signature
    let event;
    try {
      event = wh.verify(bodyString, svixHeaders);
    } catch (error) {
      console.error("❌ Webhook verification failed:", error.message);
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
    }

    // Extract User Data
    const { id, email_addresses = [], first_name = "", last_name = "", role = "user" } = event.data;
    const type = event.type;

    if (!id || !type) {
      return NextResponse.json({ message: "Invalid webhook data." }, { status: 400 });
    }

    // Handle Different Webhook Events
    if (type === "user.created") {
      const existingUser = await User.findOne({ clerkId: id });
      if (existingUser) {
        console.log(`ℹ️ User with Clerk ID ${id} already exists.`);
        return NextResponse.json({ message: "User already exists." }, { status: 200 });
      }

      // Create New User
      const newUser = new User({
        clerkId: id,
        email: email_addresses[0]?.email_address || "",
        name: `${first_name} ${last_name}`.trim(),
        role,
      });

      await newUser.save();
      console.log(`✅ New user created: ${newUser.email}`);
      return NextResponse.json({ message: "User created successfully." }, { status: 201 });

    } else if (type === "user.updated") {
      const updatedUser = await User.findOneAndUpdate(
        { clerkId: id },
        {
          email: email_addresses[0]?.email_address || "",
          name: `${first_name} ${last_name}`.trim(),
        },
        { new: true }
      );

      if (!updatedUser) {
        console.warn(`⚠️ User with Clerk ID ${id} not found.`);
        return NextResponse.json({ message: "User not found." }, { status: 404 });
      }

      console.log(`✅ User updated: ${updatedUser.email}`);
      return NextResponse.json({ message: "User updated successfully." }, { status: 200 });

    } else if (type === "user.deleted") {
      const deletedUser = await User.findOneAndDelete({ clerkId: id });

      if (!deletedUser) {
        console.warn(`⚠️ User with Clerk ID ${id} not found for deletion.`);
        return NextResponse.json({ message: "User not found." }, { status: 404 });
      }

      console.log(`✅ User deleted: ${id}`);
      return NextResponse.json({ message: "User deleted successfully." }, { status: 200 });
    }

    console.warn(`⚠️ Unhandled webhook event: ${type}`);
    return NextResponse.json({ message: "Unhandled webhook event." }, { status: 400 });

  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return NextResponse.json({ error: "Webhook verification failed." }, { status: 400 });
  }
}
