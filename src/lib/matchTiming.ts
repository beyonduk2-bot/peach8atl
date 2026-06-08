import { getMatchStart } from "@/data/matches";
import type { Match } from "@/types";

export type KickoffJudgmentTone = "safe" | "tight" | "late" | "unknown";

export type KickoffJudgment = {
  tone: KickoffJudgmentTone;
  message: string;
  bufferMinutes?: number;
};

export function minutesUntilKickoff(match: Match, now = new Date()) {
  return Math.floor((getMatchStart(match).getTime() - now.getTime()) / 60_000);
}

export function isWithinKickoffWindow(match: Match, now = new Date()) {
  const minutes = minutesUntilKickoff(match, now);
  return minutes <= 180 && minutes >= -30;
}

export function judgeKickoffArrival({
  match,
  travelMinutes,
  hasLiveTiming,
  now = new Date()
}: {
  match: Match;
  travelMinutes?: number;
  hasLiveTiming: boolean;
  now?: Date;
}): KickoffJudgment {
  if (!hasLiveTiming || typeof travelMinutes !== "number") {
    return {
      tone: "unknown",
      message: "Check the route before you head out."
    };
  }

  const bufferMinutes = minutesUntilKickoff(match, now) - travelMinutes;

  if (bufferMinutes > 15) {
    return {
      tone: "safe",
      message: `You're good — arrives about ${bufferMinutes} min before kickoff`,
      bufferMinutes
    };
  }

  if (bufferMinutes >= 5) {
    return {
      tone: "tight",
      message: "It's tight — head out now",
      bufferMinutes
    };
  }

  return {
    tone: "late",
    message: "This may miss kickoff. Check official entry info.",
    bufferMinutes
  };
}
