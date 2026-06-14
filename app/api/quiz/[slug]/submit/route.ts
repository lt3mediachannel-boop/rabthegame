import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { code, answers } = await req.json();

    if (!code || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Dati mancanti" },
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
        { error: "Partecipante non trovato" },
        { status: 404 }
      );
    }

    const quiz = await prisma.quiz.findUnique({
      where: { slug },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!quiz || !quiz.active) {
      return NextResponse.json(
        { error: "Quiz non trovato" },
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
      return NextResponse.json(
        { error: "Hai già completato questo quiz." },
        { status: 409 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const attempt = await tx.quizAttempt.create({
        data: {
          participantId: participant.id,
          quizId: quiz.id,
          completed: false,
        },
      });

      let totalScore = 0;

      for (const item of answers) {
        const question = quiz.questions.find(
          (q) => q.id === Number(item.questionId)
        );

        if (!question) continue;

        const selectedAnswer = question.answers.find(
          (a) => a.id === Number(item.answerId)
        );

        if (!selectedAnswer) continue;

        const isCorrect = selectedAnswer.isCorrect;
        const points = isCorrect ? question.points : 0;

        totalScore += points;

        await tx.quizResponse.create({
          data: {
            attemptId: attempt.id,
            questionId: question.id,
            answerId: selectedAnswer.id,
            isCorrect,
            points,
          },
        });
      }

      const completedAttempt = await tx.quizAttempt.update({
        where: { id: attempt.id },
        data: {
          score: totalScore,
          completed: true,
          completedAt: new Date(),
        },
      });

      const updatedParticipant = await tx.participant.update({
        where: { id: participant.id },
        data: {
          totalPoints: {
            increment: totalScore,
          },
        },
      });

      return {
        attempt: completedAttempt,
        participant: updatedParticipant,
      };
    });

    return NextResponse.json({
      status: "ok",
      score: result.attempt.score,
      totalPoints: result.participant.totalPoints,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Errore invio quiz" },
      { status: 500 }
    );
  }
}