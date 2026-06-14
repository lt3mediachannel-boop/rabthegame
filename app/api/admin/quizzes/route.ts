import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export async function GET() {
  const quizzes = await prisma.quiz.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          answers: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  return NextResponse.json(quizzes);
}

export async function POST(req: NextRequest) {
  try {
    const { title, slug } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Titolo quiz obbligatorio" },
        { status: 400 }
      );
    }

    const cleanSlug = slug ? slugify(slug) : slugify(title);

    const quiz = await prisma.quiz.create({
      data: {
        title,
        slug: cleanSlug,
        active: true,
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    return NextResponse.json(
      { error: "Errore creazione quiz. Slug già esistente?" },
      { status: 500 }
    );
  }
}