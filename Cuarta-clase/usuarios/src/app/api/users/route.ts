export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();

    const users = await User.find({})
      .select("_id email name createdAt updatedAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Could not fetch users", detail: err?.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, name, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "email and password are required" },
        { status: 400 }
      );
    }

    const created = await User.create({ email, name, password });

    return NextResponse.json(
      { id: created._id, email: created.email, name: created.name, createdAt: created.createdAt },
      { status: 201 }
    );
  } catch (err: any) {
    // Duplicado por unique email
    if (err?.code === 11000) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Could not create user", detail: err?.message },
      { status: 500 }
    );
  }
}
