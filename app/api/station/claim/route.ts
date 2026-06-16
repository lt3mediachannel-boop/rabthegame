import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { badgeId, qrToken, stationSlug } = await req.json();

    if (!stationSlug || (!badgeId && !qrToken)) {
      return NextResponse.json(
        { error: "Dati mancanti" },
        { status: 400 }
      );
    }

    const participant = await prisma.participant.findFirst({
      where: {
        OR: [
          badgeId ? { badgeId } : undefined,
          qrToken ? { qrToken } : undefined,
        ].filter(Boolean) as any,
      },
    });

    if (!participant) {
      return NextResponse.json(
        { error: "Participant not found" },
        { status: 404 }
      );
    }

    const station = await prisma.station.findUnique({
      where: { slug: stationSlug },
    });

    if (!station || !station.active) {
      return NextResponse.json(
        { error: "Stazione non valida o non attiva" },
        { status: 404 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const score = await tx.stationScore.create({
        data: {
          participantId: participant.id,
          stationId: station.id,
          points: station.points,
        },
      });

      const updatedParticipant = await tx.participant.update({
        where: { id: participant.id },
        data: {
          totalPoints: {
            increment: station.points,
          },
        },
      });

      return {
        score,
        updatedParticipant,
      };
    });

    return NextResponse.json({
      status: "ok",
      badgeId: participant.badgeId,
      pointsAdded: result.score.points,
      totalPoints: result.updatedParticipant.totalPoints,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Points already been assigned" },
      { status: 409 }
    );
  }
}