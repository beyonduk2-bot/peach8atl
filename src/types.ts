export type StartingType = "near-rail" | "driving-in";
export type DestinationType = "stadium" | "fan-festival";

export type MatchTeam = {
  name: string;
  flagEmoji: string;
};

export type Station = {
  id: string;
  name: string;
  line: string[];
  hasDailyParking: boolean;
  hasLongTermParking: boolean;
  parkingNote: string;
  latitude: number;
  longitude: number;
  mapsQuery: string;
  directionGroup: "north" | "south" | "east" | "west" | "central";
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type GeocodeResult = Coordinates & {
  label: string;
};

export type GeocodeResponse = {
  isFallback: boolean;
  sourceName: string;
  query: string;
  result?: GeocodeResult;
  errorMessage?: string;
};

export type Match = {
  id: string;
  date: string;
  kickoffTime: string;
  displayName: string;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  round: string;
  gatesOpenTime?: string;
  gatesOpenOffsetMinutes?: number;
  planningNote: string;
  stadiumAreaLabel: string;
  recommendedArrivalBufferMinutes: number;
};

export type RouteStep = {
  kind: "start" | "drive" | "station" | "rail" | "transfer" | "arrive";
  title: string;
  body: string;
  label?: string;
};

export type GeneratedPlan = {
  match: Match;
  startingType: StartingType;
  destination: DestinationType;
  destinationLabel: string;
  areaInput: string;
  recommendedStation: Station;
  backupStation?: Station;
  routeSteps: RouteStep[];
  leaveByTime: string;
  targetStationArrivalTime: string;
  railLine: string;
  railDirection: string;
  transferNote?: string;
  exitStationSuggestion: string;
  parkingNote?: string;
  originNote?: string;
  googleDriveUrl: string;
  googleTransitUrl: string;
  calendarEventUrl: string;
  shareText: string;
};

export type RailArrival = {
  destination: string;
  direction: string;
  eventTime: string;
  isRealtime: boolean;
  line: string;
  nextArrival: string;
  station: string;
  waitingSeconds: number;
  waitingTime: string;
  delay: string;
  latitude: number;
  longitude: number;
};

export type RailArrivalsResponse = {
  isMock: boolean;
  arrivals: RailArrival[];
  errorMessage?: string;
};

export type WeatherForecast = {
  startTime: string;
  temperature: number;
  temperatureHigh?: number;
  temperatureLow?: number;
  temperatureUnit: string;
  shortForecast: string;
  windSpeed: string;
  precipitationChance?: number;
};

export type WeatherResponse = {
  isFallback: boolean;
  isMatchWindow: boolean;
  locationLabel: string;
  sourceName: string;
  updatedAt: string;
  forecast?: WeatherForecast;
  errorMessage?: string;
};
