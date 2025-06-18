import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { supabase } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: number }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("vocab_id", id)
    .eq("user_id", session?.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }

  if (data.length !== 0) {
    return NextResponse.json({ isFavorite: true }, { status: 200 });
  } else {
    return NextResponse.json({ isFavorite: false }, { status: 200 });
  }
}
