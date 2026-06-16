import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Participant code missing" },
      { status: 400 }
    );
  }

  const participant = await prisma.participant.findFirst({
    where: {
      OR: [
        { badgeId: code },
        { qrToken: code },
      ],
    },
  });

  if (!participant) {
    return NextResponse.json(
      { error: "Participant not found" },
      { status: 404 }
    );
  }

  const quiz = await prisma.quiz.findUnique({
    where: { slug },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          answers: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              text: true,
              order: true,
            },
          },
        },
      },
    },
  });

  if (!quiz || !quiz.active) {
    return NextResponse.json(
      { error: "Quiz non trovato o non attivo" },
      { status: 404 }
    );
  }

  const existingAttempt = await prisma.quizAttempt.findUnique({
    where: {
      participantId_quizId: {
        participantId: participant.id,
        quizId: quiz.id,
      },
    },
  });

  if (existingAttempt?.completed) {
    return NextResponse.json({
      blocked: true,
      message: "You have already completed this quiz.",
      score: existingAttempt.score,
    });
  }

  return NextResponse.json({
    blocked: false,
    participant: {
      badgeId: participant.badgeId,
      qrToken: participant.qrToken,
    },
    quiz: {
      id: quiz.id,
      title: quiz.title,
      slug: quiz.slug,
      questions: quiz.questions,
    },
  });
}