const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const activities = [
    { name: "Walking", category: "PHYSICAL", unit: "steps", icon: "footprints" },
    { name: "Exercise", category: "PHYSICAL", unit: "minutes", icon: "dumbbell" },
    { name: "Running", category: "PHYSICAL", unit: "minutes", icon: "activity" },
    
    { name: "Study", category: "ACADEMIC", unit: "minutes", icon: "book-open" },
    { name: "Reading", category: "ACADEMIC", unit: "pages", icon: "book" },
    
    { name: "Water", category: "LIFESTYLE", unit: "L", icon: "droplets" },
    { name: "Sleep", category: "LIFESTYLE", unit: "hours", icon: "moon" },
    { name: "Break", category: "LIFESTYLE", unit: "minutes", icon: "coffee" },
    { name: "Meditation", category: "LIFESTYLE", unit: "minutes", icon: "smile" }
  ];

  for (const act of activities) {
    const exists = await prisma.activity.findFirst({ where: { name: act.name } });
    if (!exists) {
      await prisma.activity.create({
        data: act
      });
      console.log(`Created activity: ${act.name}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
