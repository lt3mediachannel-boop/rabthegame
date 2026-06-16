import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const station = await prisma.station.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      points: true,
      active: true,
    },
  });

  if (!station || !station.active) {
    return NextResponse.json(
      { error: "Station not found or inactive" },
      { status: 404 }
    );
  }

  return NextResponse.json(station);
}