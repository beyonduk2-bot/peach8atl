type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

function devTrack(eventName: string, payload?: AnalyticsPayload) {
  if (process.env.NODE_ENV === "development") {
    console.info(`[analytics placeholder] ${eventName}`, payload ?? {});
  }
}

export function trackPlanGenerated(payload: AnalyticsPayload) {
  devTrack("plan_generated", payload);
}

export function trackMapsClicked(payload: AnalyticsPayload) {
  devTrack("maps_clicked", payload);
}

export function trackCalendarAdded(payload: AnalyticsPayload) {
  devTrack("calendar_added", payload);
}

export function trackShareClicked(payload: AnalyticsPayload) {
  devTrack("share_clicked", payload);
}
