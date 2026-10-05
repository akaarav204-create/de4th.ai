export function getStoredUser() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
}

export function getDisplayName() {
  const user = getStoredUser();
  return user.display_name || user.username || "User";
}

export function getDemoReply(message) {
  const text = (message || "").toLowerCase().trim();

  if (!text) {
    return "I’m listening. Ask me anything about your day, tasks, or app features.";
  }

  if (text.includes("hello") || text.includes("hi")) {
    return "Hello! I’m Jarvis. I can help you chat, manage reminders, and keep your social features organized.";
  }

  if (text.includes("time")) {
    return `The current time is ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.`;
  }

  if (text.includes("weather")) {
    return "The weather is looking clear and comfortable for the day ahead.";
  }

  if (text.includes("reminder")) {
    return "I can help you create reminders and keep your routine on track.";
  }

  if (text.includes("friend") || text.includes("group")) {
    return "Your friends and group spaces are ready to explore from the dashboard.";
  }

  return "I’m here and ready to help. Try asking about reminders, friends, groups, or your workspace.";
}
