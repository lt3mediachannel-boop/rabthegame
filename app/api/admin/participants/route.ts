import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normalizeBadgeId(value: string | number) {
  return String(Number(value)).padStart(3, "0");
}

function generateTokenPart() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateQrToken(badgeId: string) {
  return `P-${badgeId}-${generateTokenPart()}`;
}

async function getNextBadgeId() {
  const participants = await prisma.participant.findMany({
    select: { badgeId: true },
  });

  const maxNumber = participants.reduce((max, p) => {
    const num = Number(p.badgeId);
    return Number.isNaN(num) ? max : Math.max(max, num);
  }, 0);

  return String(maxNumber + 1).padStart(3, "0");
}

export async function GET() {
  const participants = await prisma.participant.findMany({
    orderBy: { badgeId: "asc" },
  });

  return NextResponse.json(participants);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const badgeId = body.badgeId
      ? normalizeBadgeId(body.badgeId)
      : await getNextBadgeId();

    const existing = await prisma.participant.findUnique({
      where: { badgeId },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Participant ${badgeId} already exists` },
        { status: 409 }
      );
    }

    let qrToken = generateQrToken(badgeId);

    let existingToken = await prisma.participant.findUnique({
      where: { qrToken },
    });

    while (existingToken) {
      qrToken = generateQrToken(badgeId);

      existingToken = await prisma.participant.findUnique({
        where: { qrToken },
      });
    }

    const participant = await prisma.participant.create({
      data: {
        badgeId,
        qrToken,
        totalPoints: 0,
      },
    });

    return NextResponse.json(participant);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Participant creation error" },
      { status: 500 }
    );
  }
}