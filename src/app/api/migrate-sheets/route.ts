import { NextResponse } from "next/server";
import { migrateFromSheets } from "@/lib/migrate-sheets";

export async function GET() {
  try {
    const result = await migrateFromSheets();
    if (result.success) {
      return NextResponse.json({ message: "Migration successful", count: result.count });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
