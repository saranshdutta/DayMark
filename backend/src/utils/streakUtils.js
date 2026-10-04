// Shared streak calculation utility
const prisma = require("./prisma");

async function calculateStreak(userId) {
  const logs = await prisma.activityLog.findMany({
    where: { userId },
    orderBy: { loggedAt: "desc" },
    select: { loggedAt: true },
  });

  if (logs.length === 0) return { current: 0, longest: 0 };

  const uniqueDays = [
    ...new Set(logs.map((l) => new Date(l.loggedAt).toISOString().split("T")[0])),
  ]
    .sort()
    .reverse();

  let current = 0;
  let longest = 0;
  let streak = 1;

  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (uniqueDays[0] === today || uniqueDays[0] === yesterday) {
    current = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const prevDay = new Date(uniqueDays[i - 1]);
      const curDay = new Date(uniqueDays[i]);
      const diff = Math.round((prevDay - curDay) / 86400000);
      if (diff === 1) {
        current++;
      } else {
        break;
      }
    }
  }

  for (let i = 1; i < uniqueDays.length; i++) {
    const prevDay = new Date(uniqueDays[i - 1]);
    const curDay = new Date(uniqueDays[i]);
    const diff = Math.round((prevDay - curDay) / 86400000);
    if (diff === 1) {
      streak++;
      if (streak > longest) longest = streak;
    } else {
      streak = 1;
    }
  }

  if (longest === 0 && uniqueDays.length > 0) longest = current || 1;

  return { current, longest };
}

module.exports = { calculateStreak };
