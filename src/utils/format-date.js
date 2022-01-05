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

export function formatTime(time) {
  const tm = time.substring(0, 19);
  const tz = Number(time.substr(19, 3));
  const offset = tz > 0 ? `+{tz}` : tz;

  console.log(tz);
  const dt = format(new Date(tm), "MMMM d, yyyy, h:mm:ss a");

  return `${dt} GMT${offset}`;
}
