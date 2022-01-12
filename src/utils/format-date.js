import { format } from "date-fns";

export function formatDate(timestamp) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(timestamp));
}

export function formatDateTime(timestamp) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  }).format(new Date(timestamp));
}

export function formatTime(timestamp) {
  console.log(timestamp);
  const launchTime = timestamp.substring(0, 19);
  const launchTimezone = Number(timestamp.substring(19, 22));
  const offset = launchTimezone > 0 ? `+{launchTimezone}` : launchTimezone;

  const launchDate = format(new Date(launchTime), "MMMM d, yyyy, h:mm:ss a");

  return `${launchDate} GMT${offset}`;
}
