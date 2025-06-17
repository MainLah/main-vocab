import { supabase } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("favorites")
    .select("vocab_id")
    .eq("user_id", session.user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { vocab_id } = await req.json();
  const { data, error } = await supabase
    .from("favorites")
    .insert([{ user_id: session.user.id, vocab_id }]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  return NextResponse.json({ success: true, data });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { vocab_id } = await req.json();
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", session.user.id)
    .eq("vocab_id", vocab_id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  return NextResponse.json({ success: true });
}
