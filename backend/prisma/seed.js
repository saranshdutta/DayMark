const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// Helper: date N days ago
function daysAgo(n, hour = 10, min = 0) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, min, 0, 0);
  return d;
}

async function main() {
  console.log('🌱 Seeding DayMark database...');

  // ── Activity Definitions ──────────────────────────────────
  const activityDefs = [
    { name: 'Walking', category: 'PHYSICAL', unit: 'steps', icon: 'footprints' },
    { name: 'Exercise', category: 'PHYSICAL', unit: 'minutes', icon: 'dumbbell' },
    { name: 'Running', category: 'PHYSICAL', unit: 'minutes', icon: 'activity' },
    { name: 'Yoga', category: 'PHYSICAL', unit: 'minutes', icon: 'leaf' },
    { name: 'Sports', category: 'PHYSICAL', unit: 'minutes', icon: 'trophy' },
    { name: 'Study', category: 'ACADEMIC', unit: 'minutes', icon: 'book-open' },
    { name: 'Reading', category: 'ACADEMIC', unit: 'pages', icon: 'book' },
    { name: 'Assignment', category: 'ACADEMIC', unit: 'minutes', icon: 'pen-line' },
    { name: 'Coding', category: 'ACADEMIC', unit: 'minutes', icon: 'code' },
    { name: 'Revision', category: 'ACADEMIC', unit: 'minutes', icon: 'refresh-cw' },
    { name: 'Water', category: 'LIFESTYLE', unit: 'L', icon: 'droplets' },
    { name: 'Sleep', category: 'LIFESTYLE', unit: 'hours', icon: 'moon' },
    { name: 'Break', category: 'LIFESTYLE', unit: 'minutes', icon: 'coffee' },
    { name: 'Meditation', category: 'LIFESTYLE', unit: 'minutes', icon: 'smile' },
    { name: 'Outdoor Time', category: 'LIFESTYLE', unit: 'minutes', icon: 'sun' },
    { name: 'Friends', category: 'SOCIAL', unit: 'hours', icon: 'users' },
    { name: 'Family', category: 'SOCIAL', unit: 'hours', icon: 'home' },
    { name: 'Club Activity', category: 'SOCIAL', unit: 'hours', icon: 'star' },
  ];

  const activityMap = {};
  for (const def of activityDefs) {
    const existing = await prisma.activity.findFirst({ where: { name: def.name } });
    if (!existing) {
      const created = await prisma.activity.create({ data: def });
      activityMap[def.name] = created;
      console.log(`  ✓ Activity: ${def.name}`);
    } else {
      activityMap[def.name] = existing;
    }
  }

  // ── Demo User ─────────────────────────────────────────────
  const demoEmail = 'demo@daymark.app';
  let demoUser = await prisma.user.findUnique({ where: { email: demoEmail } });

  if (!demoUser) {
    const hashedPw = await bcrypt.hash('Demo1234!', 10);
    demoUser = await prisma.user.create({
      data: {
        name: 'Ritu Sharma',
        email: demoEmail,
        password: hashedPw,
      },
    });
    console.log(`  ✓ Demo user: ${demoEmail}`);
  }

  // Also create Alex Student user
  const alexEmail = 'alex@student.edu';
  let alexUser = await prisma.user.findUnique({ where: { email: alexEmail } });
  if (!alexUser) {
    const alexPw = await bcrypt.hash('password123', 10);
    alexUser = await prisma.user.create({
      data: {
        name: 'Alex Morgan',
        email: alexEmail,
        password: alexPw,
      },
    });
    console.log(`  ✓ Demo user: ${alexEmail}`);
  }

  // ── User Preferences ──────────────────────────────────────
  await prisma.userPreference.upsert({
    where: { userId: demoUser.id },
    create: {
      userId: demoUser.id,
      academicYear: '3rd Year',
      department: 'Computer Science',
      dailySleepTarget: 7.5,
      dailyStudyTarget: 180,
      dailyExerciseTarget: 40,
      dailyWaterTarget: 2.5,
      preferredCategories: JSON.stringify(['ACADEMIC', 'PHYSICAL', 'LIFESTYLE']),
      onboardingCompleted: true,
    },
    update: {},
  });
  console.log('  ✓ User preferences set');

  // ── Activity Logs (30 days) ────────────────────────────────
  const studyId = activityMap['Study'].id;
  const exerciseId = activityMap['Exercise'].id;
  const walkingId = activityMap['Walking'].id;
  const readingId = activityMap['Reading'].id;
  const meditationId = activityMap['Meditation'].id;
  const codingId = activityMap['Coding'].id;

  const existingLogs = await prisma.activityLog.count({ where: { userId: demoUser.id } });
  if (existingLogs === 0) {
    const logData = [];
    for (let i = 30; i >= 0; i--) {
      // Study every day
      logData.push({
        userId: demoUser.id,
        activityId: studyId,
        duration: 90 + Math.floor(Math.random() * 60),
        value: null,
        note: i % 5 === 0 ? 'Productive session' : null,
        loggedAt: daysAgo(i, 9, 0),
      });

      // Exercise ~4 times per week
      if (i % 2 === 0) {
        logData.push({
          userId: demoUser.id,
          activityId: exerciseId,
          duration: 30 + Math.floor(Math.random() * 30),
          value: null,
          loggedAt: daysAgo(i, 7, 30),
        });
      }

      // Walking most days
      if (i % 3 !== 0) {
        logData.push({
          userId: demoUser.id,
          activityId: walkingId,
          duration: null,
          value: 5000 + Math.floor(Math.random() * 5000),
          loggedAt: daysAgo(i, 18, 0),
        });
      }

      // Reading a few times per week
      if (i % 4 === 0) {
        logData.push({
          userId: demoUser.id,
          activityId: readingId,
          duration: 30,
          value: 20 + Math.floor(Math.random() * 20),
          loggedAt: daysAgo(i, 20, 0),
        });
      }

      // Coding on weekdays roughly
      if (i % 7 !== 0 && i % 7 !== 6) {
        logData.push({
          userId: demoUser.id,
          activityId: codingId,
          duration: 60 + Math.floor(Math.random() * 90),
          value: null,
          loggedAt: daysAgo(i, 14, 0),
        });
      }

      // Meditation some days
      if (i % 3 === 0) {
        logData.push({
          userId: demoUser.id,
          activityId: meditationId,
          duration: 15,
          value: null,
          loggedAt: daysAgo(i, 8, 0),
        });
      }
    }

    await prisma.activityLog.createMany({ data: logData });
    console.log(`  ✓ ${logData.length} activity logs created`);
  }

  // ── Goals ─────────────────────────────────────────────────
  const existingGoals = await prisma.goal.count({ where: { userId: demoUser.id } });
  if (existingGoals === 0) {
    await prisma.goal.createMany({
      data: [
        {
          userId: demoUser.id,
          activityId: studyId,
          title: 'Study 20 hours this week',
          targetValue: 1200,
          unit: 'minutes',
          frequency: 'WEEKLY',
          startDate: daysAgo(7),
          status: 'ACTIVE',
        },
        {
          userId: demoUser.id,
          activityId: exerciseId,
          title: 'Exercise 4 times this week',
          targetValue: 160,
          unit: 'minutes',
          frequency: 'WEEKLY',
          startDate: daysAgo(7),
          status: 'ACTIVE',
        },
        {
          userId: demoUser.id,
          activityId: null,
          title: 'Maintain daily streak',
          targetValue: 30,
          unit: 'days',
          frequency: 'MONTHLY',
          startDate: daysAgo(30),
          status: 'ACTIVE',
        },
        {
          userId: demoUser.id,
          activityId: readingId,
          title: 'Read 100 pages this month',
          targetValue: 100,
          unit: 'pages',
          frequency: 'MONTHLY',
          startDate: daysAgo(30),
          status: 'ACTIVE',
        },
        {
          userId: demoUser.id,
          activityId: walkingId,
          title: 'Walk 8,000 steps daily',
          targetValue: 8000,
          unit: 'steps',
          frequency: 'DAILY',
          startDate: daysAgo(14),
          status: 'ACTIVE',
        },
      ],
    });
    console.log('  ✓ Goals created');
  }

  // ── Mood Check-ins ────────────────────────────────────────
  const MOODS = ['VERY_LOW', 'LOW', 'OKAY', 'GOOD', 'GREAT'];
  const ENERGIES = ['LOW', 'MEDIUM', 'HIGH'];
  const STRESSES = ['LOW', 'MEDIUM', 'HIGH'];

  const existingMood = await prisma.moodCheckIn.count({ where: { userId: demoUser.id } });
  if (existingMood === 0) {
    const moodData = [];
    for (let i = 30; i >= 0; i--) {
      // Check in most days
      if (i % 5 !== 0) {
        moodData.push({
          userId: demoUser.id,
          mood: MOODS[Math.floor(Math.random() * MOODS.length)],
          energy: ENERGIES[Math.floor(Math.random() * ENERGIES.length)],
          stress: STRESSES[Math.floor(Math.random() * STRESSES.length)],
          note: i % 7 === 0 ? 'Felt great today, productive study session!' : null,
          checkedAt: daysAgo(i, 21, 0),
        });
      }
    }
    await prisma.moodCheckIn.createMany({ data: moodData });
    console.log(`  ✓ ${moodData.length} mood check-ins created`);
  }

  // ── Sleep Records ─────────────────────────────────────────
  const existingSleep = await prisma.sleepRecord.count({ where: { userId: demoUser.id } });
  if (existingSleep === 0) {
    const QUALITIES = ['POOR', 'FAIR', 'GOOD', 'EXCELLENT'];
    const sleepData = [];
    for (let i = 30; i >= 1; i--) {
      const bedHour = 22 + Math.floor(Math.random() * 2); // 10 PM or 11 PM
      const wakeHour = 6 + Math.floor(Math.random() * 2); // 6 AM or 7 AM
      const bed = new Date(daysAgo(i, bedHour, 0));
      const wake = new Date(daysAgo(i - 1, wakeHour, 30));
      const duration = (wake - bed) / (1000 * 60 * 60);

      sleepData.push({
        userId: demoUser.id,
        bedtime: bed,
        wakeTime: wake,
        duration: parseFloat(duration.toFixed(2)),
        quality: QUALITIES[Math.floor(Math.random() * QUALITIES.length)],
        sleepDate: wake,
      });
    }
    await prisma.sleepRecord.createMany({ data: sleepData });
    console.log(`  ✓ ${sleepData.length} sleep records created`);
  }

  // ── Hydration Logs ────────────────────────────────────────
  const existingHydration = await prisma.hydrationLog.count({ where: { userId: demoUser.id } });
  if (existingHydration === 0) {
    const hydrationData = [];
    for (let i = 14; i >= 0; i--) {
      const logsPerDay = 3 + Math.floor(Math.random() * 3);
      for (let j = 0; j < logsPerDay; j++) {
        const amounts = [0.25, 0.25, 0.5, 0.5, 0.5, 0.75];
        hydrationData.push({
          userId: demoUser.id,
          amount: amounts[Math.floor(Math.random() * amounts.length)],
          loggedAt: daysAgo(i, 8 + j * 3, 0),
        });
      }
    }
    await prisma.hydrationLog.createMany({ data: hydrationData });
    console.log(`  ✓ ${hydrationData.length} hydration logs created`);
  }

  // ── Focus Sessions ────────────────────────────────────────
  const existingFocus = await prisma.focusSession.count({ where: { userId: demoUser.id } });
  if (existingFocus === 0) {
    const focusData = [];
    for (let i = 14; i >= 0; i--) {
      // 2-4 focus sessions per day on weekdays
      const sessionsToday = 2 + Math.floor(Math.random() * 3);
      for (let j = 0; j < sessionsToday; j++) {
        const startHour = 9 + j * 2;
        const start = daysAgo(i, startHour, 0);
        const end = new Date(start.getTime() + 25 * 60 * 1000);
        focusData.push({
          userId: demoUser.id,
          taskName: ['Algorithms homework', 'Project research', 'Exam prep', 'Read textbook', 'Code review'][j % 5],
          duration: 25,
          actualDuration: 25,
          breakDuration: 5,
          status: 'COMPLETED',
          startTime: start,
          endTime: end,
        });
      }
    }
    await prisma.focusSession.createMany({ data: focusData });
    console.log(`  ✓ ${focusData.length} focus sessions created`);
  }

  // ── Notifications ─────────────────────────────────────────
  const existingNotifs = await prisma.notification.count({ where: { userId: demoUser.id } });
  if (existingNotifs === 0) {
    await prisma.notification.createMany({
      data: [
        {
          userId: demoUser.id,
          title: 'Welcome to DayMark! 🎉',
          message: "You've logged your first activity. Keep it up!",
          type: 'INFO',
          isRead: true,
          createdAt: daysAgo(30),
        },
        {
          userId: demoUser.id,
          title: 'Goal reminder',
          message: "Don't forget to log your study hours today!",
          type: 'REMINDER',
          isRead: true,
          createdAt: daysAgo(3),
        },
        {
          userId: demoUser.id,
          title: '7-day streak! 🔥',
          message: "You've logged activities for 7 days in a row. Amazing!",
          type: 'ACHIEVEMENT',
          isRead: false,
          createdAt: daysAgo(1),
        },
        {
          userId: demoUser.id,
          title: 'Hydration reminder',
          message: "You're at 1.2L today. Try to reach your 2.5L target!",
          type: 'REMINDER',
          isRead: false,
          createdAt: new Date(),
        },
      ],
    });
    console.log('  ✓ Notifications created');
  }

  console.log('\n✅ Seeding complete!');
  console.log('\n📋 Demo credentials:');
  console.log('   Email:    demo@daymark.app');
  console.log('   Password: Demo1234!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
