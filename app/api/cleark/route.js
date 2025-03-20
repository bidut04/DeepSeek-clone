import { Webhook } from "svix";
import { NextResponse } from "next/server";
import dataBaseConnection from "@/config/databaseConnection";
import User from "@/models/userModel";
import { headers } from "next/headers";

export async function POST(req) {
  try {
    await dataBaseConnection(); // Ensure DB is connected

    // Initialize Webhook instance
    const wh = new Webhook(process.env.SIGNING_SECRET);

    // Get request headers
    const headerPayload = headers();
    const svixHeaders = {
      "svix-id": headerPayload.get("svix-id"),
      "svix-timestamp": headerPayload.get("svix-timestamp"),
      "svix-signature": headerPayload.get("svix-signature"),
    };

    // Parse request body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Verify webhook signature
    const { data, type } = wh.verify(body, svixHeaders);

    if (!data || !type) {
      return NextResponse.json({ message: "Invalid webhook data." }, { status: 400 });
    }

    // Handle different webhook events
    if (type === "user.created") {
      const { id, email_addresses, first_name, last_name, role } = data;

      // Check if user already exists
      const existingUser = await User.findOne({ clerkId: id });
      if (existingUser) {
        return NextResponse.json({ message: "User already exists." }, { status: 200 });
      }

      // Create new user in DB
      const newUser = new User({
        clerkId: id,
        email: email_addresses?.[0]?.email_address || "",
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        role: role || "user",
      });

      await newUser.save();
      return NextResponse.json({ message: "User created successfully." }, { status: 201 });

    } else if (type === "user.updated") {
      const { id, email_addresses, first_name, last_name } = data;

      // Find and update user
      const updatedUser = await User.findOneAndUpdate(
        { clerkId: id },
        {
          email: email_addresses?.[0]?.email_address || "",
          name: `${first_name || ""} ${last_name || ""}`.trim(),
        },
        { new: true }
      );

      if (!updatedUser) {
        return NextResponse.json({ message: "User not found." }, { status: 404 });
      }

      return NextResponse.json({ message: "User updated successfully." }, { status: 200 });

    } else if (type === "user.deleted") {
      const { id } = data;

      // Delete user from database
      const deletedUser = await User.findOneAndDelete({ clerkId: id });

      if (!deletedUser) {
        return NextResponse.json({ message: "User not found." }, { status: 404 });
      }

      return NextResponse.json({ message: "User deleted successfully." }, { status: 200 });
    }

    return NextResponse.json({ message: "Unhandled webhook event." }, { status: 400 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook verification failed." }, { status: 400 });
  }
}

