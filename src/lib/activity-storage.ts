import AsyncStorage from '@react-native-async-storage/async-storage';

export type Activity = {
  id: number;
  time: string;
  label: string;
  tint: string;
};

export type ActivityData = {
  activities: Activity[];
  completionsByDate: Record<string, number[]>;
  dailyGoal: number;
};

const STORAGE_KEY = 'activity232.activity-data.v1';
export const DEFAULT_DAILY_GOAL = 3;
export const MAX_DAILY_GOAL = 99;

export const DEFAULT_ACTIVITIES: Activity[] = [
  { id: 1, time: '09:30', label: 'Workout', tint: '#8b5cf6' },
  { id: 2, time: '12:10', label: 'Focus block', tint: '#38bdf8' },
  { id: 3, time: '18:45', label: 'Walk', tint: '#34d399' },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isActivity(value: unknown): value is Activity {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    Number.isInteger(value.id) &&
    value.id > 0 &&
    typeof value.time === 'string' &&
    /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value.time) &&
    typeof value.label === 'string' &&
    value.label.trim().length > 0 &&
    typeof value.tint === 'string' &&
    /^#[\da-fA-F]{6}$/.test(value.tint)
  );
}

function parseActivityData(value: unknown): ActivityData {
  if (
    !isRecord(value) ||
    !Array.isArray(value.activities) ||
    !isRecord(value.completionsByDate) ||
    (value.dailyGoal !== undefined &&
      (typeof value.dailyGoal !== 'number' ||
        !Number.isInteger(value.dailyGoal) ||
        value.dailyGoal < 1 ||
        value.dailyGoal > MAX_DAILY_GOAL)) ||
    !value.activities.every(isActivity)
  ) {
    throw new Error('Saved activity data has an invalid format.');
  }

  const activities = value.activities;
  const activityIds = activities.map((activity) => activity.id);
  if (new Set(activityIds).size !== activityIds.length) {
    throw new Error('Saved activity data contains duplicate activity IDs.');
  }

  const completionsByDate: Record<string, number[]> = {};
  for (const [date, completions] of Object.entries(value.completionsByDate)) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Array.isArray(completions) ||
      !completions.every((id) => typeof id === 'number' && Number.isInteger(id) && id > 0)
    ) {
      throw new Error('Saved completion history has an invalid format.');
    }
    completionsByDate[date] = [...new Set(completions)];
  }

  return {
    activities,
    completionsByDate,
    dailyGoal: value.dailyGoal ?? DEFAULT_DAILY_GOAL,
  };
}

export async function loadActivityData(): Promise<ActivityData> {
  const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
  if (storedValue === null) {
    return {
      activities: DEFAULT_ACTIVITIES.map((activity) => ({ ...activity })),
      completionsByDate: {},
      dailyGoal: DEFAULT_DAILY_GOAL,
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(storedValue);
  } catch (error) {
    throw new Error('Saved activity data could not be read as JSON.', { cause: error });
  }

  return parseActivityData(parsed);
}

export async function saveActivityData(data: ActivityData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
