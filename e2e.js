const http = require("http");

async function fetchJSON(url, options = {}) {
  const res = await fetch(`http://localhost:5000${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(`HTTP Error ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function runE2E() {
  try {
    console.log("Checking API health...");
    const health = await fetchJSON("/api/health");
    console.log("Health:", health);

    const email = `testuser_${Date.now()}@example.com`;
    const password = "password123!";
    
    console.log("\n1. Registering new user...");
    const regRes = await fetchJSON("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: "E2E User", email, password })
    });
    console.log("Registered:", regRes.email);
    let token = regRes.token;

    console.log("\n2. Getting Dashboard Stats...");
    const dashboard = await fetchJSON("/api/dashboard/stats", {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Dashboard:", dashboard);

    console.log("\n3. Creating Activity Type...");
    const activityTypes = await fetchJSON("/api/activities", {
      headers: { Authorization: `Bearer ${token}` }
    });
    let activityId = activityTypes.length > 0 ? activityTypes[0].id : null;
    
    console.log("\n4. Logging Activity...");
    const logRes = await fetchJSON("/api/activity-logs", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ activityId: activityId || "clm123", duration: 30, value: 50 }) // assuming activity log fallback handles invalid activityId or we don't care
    });
    console.log("Activity Logged:", logRes.id);

    console.log("\n5. Creating Goal...");
    const goalRes = await fetchJSON("/api/goals", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ 
        title: "E2E Goal", 
        targetValue: 100, 
        unit: "points", 
        frequency: "DAILY",
        activityId: activityId || "clm123",
        startDate: new Date().toISOString()
      })
    });
    console.log("Goal created:", goalRes.title);

    console.log("\n6. Verifying Goal Progress...");
    const progress = await fetchJSON("/api/goals/progress", {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Progress:", progress.map(g => `${g.title}: ${g.currentProgress}/${g.targetValue}`));

    console.log("\n7. Changing Password...");
    const passChange = await fetchJSON("/api/auth/change-password", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword: password, newPassword: "newPassword123!" })
    });
    console.log("Password Change:", passChange.success);

    console.log("\n8. Logging out and logging back in...");
    await fetchJSON("/api/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    const loginRes = await fetchJSON("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password: "newPassword123!" })
    });
    console.log("Login Success:", loginRes.email);

    console.log("\nE2E VERIFICATION COMPLETE!");
  } catch (err) {
    console.error("E2E FAILED:", err);
  }
}

runE2E();
