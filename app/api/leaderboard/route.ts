import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const participants = await prisma.participant.findMany({
    orderBy: {
      totalPoints: "desc",
    },
    select: {
      badgeId: true,
      qrToken: true,
      totalPoints: true,
      stationScores: true,
      quizAttempts: true,
    },
  });

  return NextResponse.json(
    participants.map((p, index) => ({
      rank: index + 1,
      badgeId: p.badgeId,
      totalPoints: p.totalPoints,
      stationsDone: p.stationScores.length,
      quizzesDone: p.quizAttempts.filter((q) => q.completed).length,
    }))
  );
}