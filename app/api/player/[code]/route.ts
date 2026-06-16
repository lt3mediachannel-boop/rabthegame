import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const participant = await prisma.participant.findFirst({
    where: {
      OR: [
        { badgeId: code },
        { qrToken: code },
      ],
    },
    include: {
      stationScores: {
        include: {
          station: true,
        },
      },
      quizAttempts: {
        include: {
          quiz: true,
        },
      },
    },
  });

  if (!participant) {
    return NextResponse.json(
      { error: "Participant not found" },
      { status: 404 }
    );
  }

  const stations = await prisma.station.findMany({
    orderBy: {
      points: "desc",
    },
  });

  const completedStationIds = participant.stationScores.map(
    (s) => s.stationId
  );

  return NextResponse.json({
    badgeId: participant.badgeId,
    qrToken: participant.qrToken,
    totalPoints: participant.totalPoints,
    stations: stations.map((station) => ({
      id: station.id,
      name: station.name,
      slug: station.slug,
      points: station.points,
      completed: completedStationIds.includes(station.id),
    })),
    quizzes: participant.quizAttempts.map((attempt) => ({
      quizTitle: attempt.quiz.title,
      score: attempt.score,
      completed: attempt.completed,
    })),
  });
}