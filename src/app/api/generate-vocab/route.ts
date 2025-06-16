import { supabase } from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { count } = await supabase
    .from("vocab")
    .select("*", { count: "exact", head: true });

  if (!count || count === 0) {
    return NextResponse.json(
      { message: "No vocabulary found" },
      { status: 403 }
    );
  }

  const randomOffset = Math.floor(Math.random() * count);

  const { data, error } = await supabase
    .from("vocab")
    .select("*")
    .range(randomOffset, randomOffset);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 403 });
  }

  return NextResponse.json(data, { status: 200 });
}
