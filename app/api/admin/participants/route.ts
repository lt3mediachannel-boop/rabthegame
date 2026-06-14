import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function generateToken() {
  return "P-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function GET() {
  const participants = await prisma.participant.findMany({
    orderBy: { badgeId: "asc" },
  });

  return NextResponse.json(participants);
}

export async function POST(req: NextRequest) {
  const { badgeId } = await req.json();

  if (!badgeId) {
    return NextResponse.json({ error: "badgeId mancante" }, { status: 400 });
  }

  const participant = await prisma.participant.create({
    data: {
      badgeId,
      qrToken: generateToken(),
    },
  });

  return NextResponse.json(participant);
}