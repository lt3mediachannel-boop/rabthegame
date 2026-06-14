import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  await prisma.station.createMany({
    data: [
      {
        slug: "station-5",
        name: "Postazione Gold",
        points: 5
      },
      {
        slug: "station-3",
        name: "Postazione Silver",
        points: 3
      },
      {
        slug: "station-1",
        name: "Postazione Bronze",
        points: 1
      }
    ]
  });

  await prisma.participant.createMany({
    data: [
      {
        badgeId: "001",
        qrToken: "P-8F3K29"
      },
      {
        badgeId: "002",
        qrToken: "P-A2K5D9"
      },
      {
        badgeId: "003",
        qrToken: "P-X7M4KL"
      }
    ]
  });

}

main();