import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const stations = await prisma.station.findMany({
    orderBy: { points: "desc" },
  });

  return NextResponse.json(stations);
}