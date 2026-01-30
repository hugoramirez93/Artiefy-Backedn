import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const validUsername = "admin";
  const validPassword = "1234";

  if (email === validUsername && password == validPassword) {
    return NextResponse.json({ message: "Login successful" }, { status: 200 });
  } else {
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 },
    );
  }
}