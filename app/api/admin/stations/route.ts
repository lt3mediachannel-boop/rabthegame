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
  const stations = await prisma.station.findMany({
    orderBy: {
      id: "asc",
    },
  });

  return NextResponse.json(stations);
}

export async function POST(req: NextRequest) {
  try {
    const { name, points, slug } = await req.json();

    if (!name || points === undefined || points === null || !slug) {
      return NextResponse.json(
        { error: "Name, slug and points are required" },
        { status: 400 }
      );
    }

    const cleanSlug = slugify(slug);

    if (!cleanSlug) {
      return NextResponse.json(
        { error: "Invalid slug" },
        { status: 400 }
      );
    }

    const existing = await prisma.station.findUnique({
      where: { slug: cleanSlug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }

    const cleanPoints = Number(points);

    if (Number.isNaN(cleanPoints) || cleanPoints < 0) {
      return NextResponse.json(
        { error: "Points must be a valid number" },
        { status: 400 }
      );
    }

    const station = await prisma.station.create({
      data: {
        name: String(name).trim(),
        slug: cleanSlug,
        points: cleanPoints,
        active: true,
      },
    });

    return NextResponse.json(station);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Station creation error" },
      { status: 500 }
    );
  }
}