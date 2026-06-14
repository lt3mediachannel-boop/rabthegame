import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;
    const body = await req.json();

    const {
      text,
      points,
      answers,
      correctIndex,
    } = body;

    if (!text || !answers || answers.length < 2) {
      return NextResponse.json(
        { error: "Domanda e almeno 2 risposte obbligatorie" },
        { status: 400 }
      );
    }

    const lastQuestion = await prisma.quizQuestion.findFirst({
      where: {
        quizId: Number(quizId),
      },
      orderBy: {
        order: "desc",
      },
    });

    const question = await prisma.quizQuestion.create({
      data: {
        quizId: Number(quizId),
        text,
        points: Number(points || 1),
        order: lastQuestion ? lastQuestion.order + 1 : 1,
        answers: {
          create: answers.map((answerText: string, index: number) => ({
            text: answerText,
            order: index + 1,
            isCorrect: index === Number(correctIndex),
          })),
        },
      },
      include: {
        answers: true,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Errore creazione domanda" },
      { status: 500 }
    );
  }
}