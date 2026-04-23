import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Bounty from "@/models/Bounty";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = (await params).id;
    
    const bounty = await Bounty.findByIdAndDelete(id);
    
    if (!bounty) {
      return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Bounty removed successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
