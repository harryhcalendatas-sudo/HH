import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Appearance,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {
  DEFAULT_ACTIVITIES,
  DEFAULT_DAILY_GOAL,
  loadActivityData,
  MAX_DAILY_GOAL,
  saveActivityData,
  type Activity,
} from '../lib/activity-storage';

const activityOptions = [
  { label: 'Workout', tint: '#8b5cf6' },
  { label: 'Focus block', tint: '#38bdf8' },
  { label: 'Walk', tint: '#34d399' },
];

const weekDays = [
  { label: 'M', name: 'Monday' },
  { label: 'T', name: 'Tuesday' },
  { label: 'W', name: 'Wednesday' },
  { label: 'T', name: 'Thursday' },
  { label: 'F', name: 'Friday' },
  { label: 'S', name: 'Saturday' },
  { label: 'S', name: 'Sunday' },
];

function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCurrentWeekDates(today: Date): Date[] {
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return weekDays.map((_, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return date;
  });
}

export default function ActivityScreen() {
  const colorScheme = useColorScheme();
  const [themeOverride, setThemeOverride] = useState<'light' | 'dark' | null>(null);
  const isDark = (themeOverride ?? colorScheme) !== 'light';
  const palette = isDark ? darkPalette : lightPalette;
  const [activities, setActivities] = useState<Activity[]>(DEFAULT_ACTIVITIES);
  const [completionsByDate, setCompletionsByDate] = useState<Record<string, number[]>>({});
  const [dailyGoal, setDailyGoal] = useState(DEFAULT_DAILY_GOAL);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  const [selectedActivity, setSelectedActivity] = useState(activityOptions[0]);
  const [activityTime, setActivityTime] = useState('19:00');
  const [formError, setFormError] = useState('');
  const nextActivityId = useRef(DEFAULT_ACTIVITIES.length + 1);
  const today = new Date();
  const todayKey = getDateKey(today);
  const currentWeekDates = getCurrentWeekDates(today);
  const completedItems = completionsByDate[todayKey] ?? [];
  const upcomingItems = activities
    .filter((item) => !completedItems.includes(item.id))
    .sort((first, second) => first.time.localeCompare(second.time));
  const doneItems = activities
    .filter((item) => completedItems.includes(item.id))
    .sort((first, second) => first.time.localeCompare(second.time));
  const todayIndex = (today.getDay() + 6) % 7;
  const goalProgress = Math.min(doneItems.length / dailyGoal, 1);

  const loadSavedData = useCallback(async () => {
    setStorageError('');
    setIsStorageReady(false);
    try {
      const data = await loadActivityData();
      setActivities(data.activities);
      setCompletionsByDate(data.completionsByDate);
      setDailyGoal(data.dailyGoal);
      nextActivityId.current =
        data.activities.reduce((maxId, activity) => Math.max(maxId, activity.id), 0) + 1;
      setIsStorageReady(true);
    } catch (error) {
      console.error('Failed to load saved activity data.', error);
      setStorageError('Could not load saved activities. Tap to retry.');
    }
  }, []);

  useEffect(() => {
    void loadSavedData();
  }, [loadSavedData]);

  const saveQueue = useRef(Promise.resolve());
  useEffect(() => {
    if (!isStorageReady) {
      return;
    }

    const data = { activities, completionsByDate, dailyGoal };
    saveQueue.current = saveQueue.current
      .then(() => saveActivityData(data))
      .then(() => setStorageError(''))
      .catch((error: unknown) => {
        console.error('Failed to save activity data.', error);
        setStorageError('Could not save your latest changes. Check storage and try again.');
      });
  }, [activities, completionsByDate, dailyGoal, isStorageReady]);

  const changeDailyGoal = (amount: number) => {
    setDailyGoal((currentGoal) =>
      Math.max(1, Math.min(MAX_DAILY_GOAL, currentGoal + amount)),
    );
  };

  const toggleTheme = () => {
    const nextTheme = isDark ? 'light' : 'dark';
    setThemeOverride(nextTheme);
    Appearance.setColorScheme(nextTheme);
  };

  const toggleActivity = (id: number) => {
    setCompletionsByDate((current) => {
      const currentItems = current[todayKey] ?? [];
      const nextItems = currentItems.includes(id)
        ? currentItems.filter((item) => item !== id)
        : [...currentItems, id];
      const updated = { ...current };
      if (nextItems.length === 0) {
        delete updated[todayKey];
      } else {
        updated[todayKey] = nextItems;
      }
      return updated;
    });
  };

  const deleteActivity = () => {
    if (!activityToDelete) {
      return;
    }

    const idToDelete = activityToDelete.id;
    setActivities((current) => current.filter((item) => item.id !== idToDelete));
    setCompletionsByDate((current) => {
      const updated: Record<string, number[]> = {};
      for (const [date, ids] of Object.entries(current)) {
        const remainingIds = ids.filter((id) => id !== idToDelete);
        if (remainingIds.length > 0) {
          updated[date] = remainingIds;
        }
      }
      return updated;
    });
    setActivityToDelete(null);
  };

  const addActivity = () => {
    const normalizedTime = activityTime.trim();
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(normalizedTime)) {
      setFormError('Enter a valid time in 24-hour format, such as 09:30.');
      return;
    }

    const newActivity = {
      id: nextActivityId.current,
      time: normalizedTime,
      label: selectedActivity.label,
      tint: selectedActivity.tint,
    };
    nextActivityId.current += 1;
    setActivities((current) =>
      [...current, newActivity].sort((first, second) => first.time.localeCompare(second.time)),
    );
    setActivityTime('19:00');
    setFormError('');
    setIsAddModalVisible(false);
  };

  const closeAddModal = () => {
    setFormError('');
    setIsAddModalVisible(false);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: palette.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          {!isStorageReady && (
            <Pressable
              accessibilityRole={storageError ? 'button' : undefined}
              disabled={!storageError}
              onPress={() => void loadSavedData()}
              style={[
                styles.storageNotice,
                {
                  backgroundColor: palette.surface,
                  borderColor: storageError ? '#ef4444' : palette.border,
                },
              ]}>
              <ThemedText
                type="small"
                style={[
                  styles.storageNoticeText,
                  { color: storageError ? '#ef4444' : palette.mutedText },
                ]}>
                {storageError || 'Loading saved activities…'}
              </ThemedText>
            </Pressable>
          )}
          {storageError && isStorageReady && (
            <ThemedView
              style={[
                styles.storageNotice,
                { backgroundColor: palette.surface, borderColor: '#ef4444' },
              ]}>
              <ThemedText type="small" style={[styles.storageNoticeText, { color: '#ef4444' }]}>
                {storageError}
              </ThemedText>
            </ThemedView>
          )}
          <ThemedView
            style={[
              styles.headerCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <ThemedView style={styles.headerTopRow}>
              <ThemedText type="small" style={[styles.labelText, { color: palette.eyebrow }]}>
                Today
              </ThemedText>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                onPress={toggleTheme}
                style={({ pressed }) => [
                  styles.modeToggle,
                  {
                    backgroundColor: palette.toggleBackground,
                    borderColor: palette.border,
                    opacity: pressed ? 0.75 : 1,
                  },
                ]}>
                <ThemedText type="small" style={[styles.modeToggleText, { color: palette.text }]}>
                  {isDark ? '☀  Light' : '☾  Dark'}
                </ThemedText>
              </Pressable>
            </ThemedView>

            <ThemedText type="subtitle" style={[styles.title, { color: palette.text }]}>
              Activity
            </ThemedText>

            <ThemedView style={styles.statsRow}>
              <ThemedView
                style={[
                  styles.statCard,
                  { backgroundColor: palette.surfaceInset, borderColor: palette.border },
                ]}>
                <ThemedText type="small" style={[styles.statLabel, { color: palette.mutedText }]}>
                  Streak
                </ThemedText>
                <ThemedText type="title" style={[styles.statValue, { color: palette.text }]}>
                  12d
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.statCardAccent}>
                <ThemedText type="small" style={styles.statLabelAccent}>
                  Focus
                </ThemedText>
                <ThemedText type="title" style={styles.statValueAccent}>
                  4.8h
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedView
            style={[
              styles.goalPanel,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <ThemedView style={styles.goalHeader}>
              <ThemedText type="smallBold" style={[styles.goalTitle, { color: palette.text }]}>
                Daily goal
              </ThemedText>
              <ThemedView style={styles.goalStepper}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Decrease daily goal"
                  disabled={!isStorageReady || dailyGoal <= 1}
                  onPress={() => changeDailyGoal(-1)}
                  style={[
                    styles.goalStepButton,
                    {
                      backgroundColor: palette.toggleBackground,
                      borderColor: palette.border,
                      opacity: !isStorageReady || dailyGoal <= 1 ? 0.45 : 1,
                    },
                  ]}>
                  <ThemedText type="default" style={[styles.goalStepText, { color: palette.text }]}>
                    −
                  </ThemedText>
                </Pressable>
                <ThemedText type="small" style={[styles.goalTarget, { color: palette.eyebrow }]}>
                  {dailyGoal} / day
                </ThemedText>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Increase daily goal"
                  disabled={!isStorageReady || dailyGoal >= MAX_DAILY_GOAL}
                  onPress={() => changeDailyGoal(1)}
                  style={[
                    styles.goalStepButton,
                    {
                      backgroundColor: palette.toggleBackground,
                      borderColor: palette.border,
                      opacity: !isStorageReady || dailyGoal >= MAX_DAILY_GOAL ? 0.45 : 1,
                    },
                  ]}>
                  <ThemedText type="default" style={[styles.goalStepText, { color: palette.text }]}>
                    +
                  </ThemedText>
                </Pressable>
              </ThemedView>
            </ThemedView>
            <ThemedView
              accessibilityRole="progressbar"
              accessibilityLabel="Daily activity goal"
              accessibilityValue={{
                min: 0,
                max: dailyGoal,
                now: Math.min(doneItems.length, dailyGoal),
              }}
              style={[styles.goalTrack, { backgroundColor: palette.row }]}>
              <ThemedView
                style={[
                  styles.goalFill,
                  {
                    width: `${goalProgress * 100}%`,
                    backgroundColor: palette.eyebrow,
                  },
                ]}
              />
            </ThemedView>
            <ThemedText type="small" style={[styles.goalNote, { color: palette.mutedText }]}>
              {goalProgress === 1
                ? `${doneItems.length} completed · Daily goal reached!`
                : `${doneItems.length} of ${dailyGoal} complete · ${
                    dailyGoal - doneItems.length
                  } to go`}
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={[
              styles.weekPanel,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <ThemedView style={styles.weekHeader}>
              <ThemedText type="smallBold" style={[styles.panelTitle, { color: palette.text }]}>
                This week
              </ThemedText>
              <ThemedText type="small" style={[styles.weekCount, { color: palette.eyebrow }]}>
                Today {doneItems.length}/{dailyGoal}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.weekChart}>
              {weekDays.map((day, index) => {
                const isToday = index === todayIndex;
                const dateKey = getDateKey(currentWeekDates[index]);
                const completedCount = (completionsByDate[dateKey] ?? []).filter((id) =>
                  activities.some((activity) => activity.id === id),
                ).length;
                const progress = dailyGoal === 0 ? 0 : Math.min(completedCount / dailyGoal, 1);
                const hasHistory = dateKey in completionsByDate;

                return (
                  <ThemedView
                    key={`${day.name}-${index}`}
                    style={styles.dayColumn}
                    accessibilityLabel={
                      hasHistory
                        ? `${day.name}${isToday ? ', today' : ''}, ${completedCount} of ${dailyGoal} activities complete`
                        : `${day.name}${isToday ? ', today' : ''}, no activity history`
                    }>
                    <ThemedView
                      style={[
                        styles.barTrack,
                        { backgroundColor: palette.row },
                        isToday && { borderColor: palette.eyebrow },
                      ]}>
                      <ThemedView
                        style={[
                          styles.barFill,
                          {
                            height: `${progress * 100}%`,
                            backgroundColor: palette.eyebrow,
                          },
                        ]}
                      />
                    </ThemedView>
                    <ThemedText
                      type="small"
                      style={[
                        styles.dayLabel,
                        { color: isToday ? palette.text : palette.mutedText },
                        isToday && styles.todayLabel,
                      ]}>
                      {day.label}
                    </ThemedText>
                  </ThemedView>
                );
              })}
            </ThemedView>

            <ThemedText type="small" style={[styles.weekNote, { color: palette.mutedText }]}>
              Completed activities are saved by date and shown here.
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={[
              styles.panel,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <ThemedView style={styles.activityPanelHeader}>
              <ThemedText
                type="smallBold"
                style={[styles.panelTitle, styles.activityPanelTitle, { color: palette.text }]}>
                Upcoming
              </ThemedText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add activity"
                disabled={!isStorageReady}
                onPress={() => {
                  setFormError('');
                  setIsAddModalVisible(true);
                }}
                style={({ pressed }) => [
                  styles.addButton,
                  {
                    backgroundColor: palette.eyebrow,
                    opacity: !isStorageReady ? 0.5 : pressed ? 0.75 : 1,
                  },
                ]}>
                <ThemedText type="default" style={styles.addButtonText}>
                  + Add
                </ThemedText>
              </Pressable>
            </ThemedView>

            {upcomingItems.length === 0 ? (
              <ThemedText
                type="small"
                style={[styles.emptyMessage, { color: palette.mutedText }]}>
                {activities.length === 0
                  ? 'No activities yet. Add one to get started.'
                  : 'All activities complete. Nice work!'}
              </ThemedText>
            ) : (
              upcomingItems.map((item) => (
                <ThemedView
                  key={item.id}
                  style={[
                    styles.activityRow,
                    {
                      backgroundColor: palette.row,
                      borderColor: palette.border,
                    },
                  ]}>
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: false }}
                    accessibilityLabel={`Mark ${item.label} complete`}
                    disabled={!isStorageReady}
                    onPress={() => toggleActivity(item.id)}
                    style={({ pressed }) => [
                      styles.activityMain,
                      { opacity: !isStorageReady ? 0.5 : pressed ? 0.72 : 1 },
                    ]}>
                    <ThemedView style={[styles.dot, { backgroundColor: item.tint }]} />
                    <ThemedText
                      type="default"
                      style={[styles.activityTime, { color: palette.mutedText }]}>
                      {item.time}
                    </ThemedText>
                    <ThemedText
                      type="default"
                      style={[styles.activityLabel, { color: palette.text }]}>
                      {item.label}
                    </ThemedText>
                    <ThemedView
                      style={[styles.checkCircle, { borderColor: palette.mutedText }]}
                    />
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${item.label}`}
                    disabled={!isStorageReady}
                    onPress={() => setActivityToDelete(item)}
                    style={({ pressed }) => [
                      styles.deleteButton,
                      { opacity: !isStorageReady ? 0.5 : pressed ? 0.65 : 1 },
                    ]}>
                    <ThemedText
                      type="default"
                      style={[styles.deleteButtonText, { color: palette.danger }]}>
                      ×
                    </ThemedText>
                  </Pressable>
                </ThemedView>
              ))
            )}

            {doneItems.length > 0 && (
              <>
                <ThemedView style={styles.doneHeading}>
                  <ThemedText
                    type="smallBold"
                    style={[styles.doneTitle, { color: palette.text }]}>
                    Done
                  </ThemedText>
                  <ThemedText type="small" style={[styles.doneCount, { color: palette.success }]}>
                    {doneItems.length}
                  </ThemedText>
                </ThemedView>

                {doneItems.map((item) => (
                  <ThemedView
                    key={item.id}
                    style={[
                      styles.activityRow,
                      styles.completedRow,
                      {
                        backgroundColor: palette.row,
                        borderColor: palette.border,
                      },
                    ]}>
                    <Pressable
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: true }}
                      accessibilityLabel={`Mark ${item.label} incomplete`}
                      disabled={!isStorageReady}
                      onPress={() => toggleActivity(item.id)}
                      style={({ pressed }) => [
                        styles.activityMain,
                        { opacity: !isStorageReady ? 0.5 : pressed ? 0.72 : 1 },
                      ]}>
                      <ThemedView style={[styles.dot, { backgroundColor: item.tint }]} />
                      <ThemedText
                        type="default"
                        style={[styles.activityTime, { color: palette.mutedText }]}>
                        {item.time}
                      </ThemedText>
                      <ThemedText
                        type="default"
                        style={[
                          styles.activityLabel,
                          styles.completedLabel,
                          { color: palette.mutedText },
                        ]}>
                        {item.label}
                      </ThemedText>
                      <ThemedText
                        type="smallBold"
                        style={[styles.checkMark, { color: palette.success }]}>
                        ✓
                      </ThemedText>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Delete ${item.label}`}
                      disabled={!isStorageReady}
                      onPress={() => setActivityToDelete(item)}
                      style={({ pressed }) => [
                        styles.deleteButton,
                        { opacity: !isStorageReady ? 0.5 : pressed ? 0.65 : 1 },
                      ]}>
                      <ThemedText
                        type="default"
                        style={[styles.deleteButtonText, { color: palette.danger }]}>
                        ×
                      </ThemedText>
                    </Pressable>
                  </ThemedView>
                ))}
              </>
            )}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeAddModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalBackdrop}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close add activity dialog"
            onPress={closeAddModal}
            style={StyleSheet.absoluteFill}
          />
          <ThemedView
            style={[
              styles.modalCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <ThemedText type="subtitle" style={[styles.modalTitle, { color: palette.text }]}>
              Add activity
            </ThemedText>
            <ThemedText type="small" style={[styles.modalLabel, { color: palette.mutedText }]}>
              Choose an activity
            </ThemedText>
            <ThemedView style={styles.optionRow}>
              {activityOptions.map((option) => {
                const isSelected = selectedActivity.label === option.label;
                return (
                  <Pressable
                    key={option.label}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => setSelectedActivity(option)}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: isSelected ? palette.toggleBackground : palette.row,
                        borderColor: isSelected ? palette.eyebrow : palette.border,
                      },
                    ]}>
                    <ThemedText
                      type="small"
                      style={{ color: isSelected ? palette.eyebrow : palette.text }}>
                      {option.label}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </ThemedView>

            <ThemedText type="small" style={[styles.modalLabel, { color: palette.mutedText }]}>
              Time (24-hour)
            </ThemedText>
            <TextInput
              accessibilityLabel="Activity time in 24-hour format"
              value={activityTime}
              onChangeText={(value) => {
                setActivityTime(value);
                setFormError('');
              }}
              placeholder="19:00"
              placeholderTextColor={palette.mutedText}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
              style={[
                styles.timeInput,
                {
                  backgroundColor: palette.row,
                  borderColor: formError ? '#ef4444' : palette.border,
                  color: palette.text,
                },
              ]}
            />
            {formError ? (
              <ThemedText type="small" style={styles.formError}>
                {formError}
              </ThemedText>
            ) : null}

            <ThemedView style={styles.modalActions}>
              <Pressable
                accessibilityRole="button"
                onPress={closeAddModal}
                style={[styles.modalAction, { borderColor: palette.border }]}>
                <ThemedText type="smallBold" style={{ color: palette.mutedText }}>
                  Cancel
                </ThemedText>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={addActivity}
                style={[styles.modalAction, styles.saveButton]}>
                <ThemedText type="smallBold" style={styles.saveButtonText}>
                  Add activity
                </ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
        </KeyboardAvoidingView>
      </Modal>
      <Modal
        visible={activityToDelete !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setActivityToDelete(null)}>
        <ThemedView style={styles.modalBackdrop}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel deleting activity"
            onPress={() => setActivityToDelete(null)}
            style={StyleSheet.absoluteFill}
          />
          <ThemedView
            style={[
              styles.modalCard,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <ThemedText type="subtitle" style={[styles.modalTitle, { color: palette.text }]}>
              Delete activity?
            </ThemedText>
            <ThemedText type="small" style={[styles.deleteWarning, { color: palette.mutedText }]}>
              {`“${activityToDelete?.label ?? 'This activity'}” and its saved completion history will be permanently removed.`}
            </ThemedText>
            <ThemedView style={styles.modalActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setActivityToDelete(null)}
                style={[styles.modalAction, { borderColor: palette.border }]}>
                <ThemedText type="smallBold" style={{ color: palette.mutedText }}>
                  Keep activity
                </ThemedText>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={deleteActivity}
                style={[styles.modalAction, styles.deleteConfirmButton]}>
                <ThemedText type="smallBold" style={styles.saveButtonText}>
                  Delete
                </ThemedText>
              </Pressable>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const darkPalette = {
  background: '#070b17',
  surface: '#0f172a',
  surfaceInset: '#111827',
  row: '#0b1220',
  border: 'rgba(148, 163, 184, 0.18)',
  text: '#f8fafc',
  mutedText: '#cbd5e1',
  eyebrow: '#a5b4fc',
  toggleBackground: '#1e293b',
  success: '#34d399',
  danger: '#f87171',
};

const lightPalette = {
  background: '#f4f6fb',
  surface: '#ffffff',
  surfaceInset: '#f1f5f9',
  row: '#f8fafc',
  border: '#dbe2ee',
  text: '#172033',
  mutedText: '#5f6b7d',
  eyebrow: '#635bdb',
  toggleBackground: '#eef2ff',
  success: '#059669',
  danger: '#dc2626',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: 18,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  storageNotice: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  storageNoticeText: {
    fontSize: 12,
  },
  headerCard: {
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    overflow: 'hidden',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modeToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  modeToggleText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  labelText: {
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    marginBottom: 18,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  statCardAccent: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    backgroundColor: '#8b5cf6',
    shadowColor: '#a78bfa',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  statLabel: {
    marginBottom: 8,
  },
  statLabelAccent: {
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    lineHeight: 38,
  },
  statValueAccent: {
    color: '#ffffff',
    fontSize: 32,
    lineHeight: 38,
  },
  panel: {
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    shadowColor: '#020617',
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  goalPanel: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  goalTitle: {
    letterSpacing: 0.4,
  },
  goalStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalStepButton: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalStepText: {
    fontSize: 18,
    lineHeight: 22,
  },
  goalTarget: {
    minWidth: 48,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  goalTrack: {
    height: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  goalFill: {
    height: '100%',
    borderRadius: 999,
  },
  goalNote: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },
  weekPanel: {
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  weekCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  weekChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  barTrack: {
    height: 58,
    width: 20,
    borderRadius: 999,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  barFill: {
    width: '100%',
    borderRadius: 999,
  },
  dayLabel: {
    fontSize: 11,
    lineHeight: 16,
  },
  todayLabel: {
    fontWeight: '700',
  },
  weekNote: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 12,
  },
  panelTitle: {
    marginBottom: 14,
    letterSpacing: 0.7,
  },
  emptyMessage: {
    paddingVertical: 10,
  },
  doneHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    marginBottom: 12,
  },
  doneTitle: {
    letterSpacing: 0.4,
  },
  doneCount: {
    fontSize: 12,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  activityMain: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedRow: {
    marginBottom: 0,
  },
  completedLabel: {
    textDecorationLine: 'line-through',
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
  },
  checkMark: {
    width: 18,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    marginRight: 12,
    shadowColor: '#fff',
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  activityTime: {
    width: 62,
  },
  activityLabel: {
    flex: 1,
  },
  deleteButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderRadius: 10,
  },
  deleteButtonText: {
    fontSize: 24,
    lineHeight: 26,
  },
  activityPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  activityPanelTitle: {
    marginBottom: 0,
  },
  addButton: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(2, 6, 23, 0.64)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    padding: 22,
    borderRadius: 26,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 24,
    lineHeight: 30,
    marginBottom: 18,
  },
  modalLabel: {
    marginBottom: 9,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },
  timeInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  formError: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 8,
  },
  deleteWarning: {
    fontSize: 14,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 14,
  },
  modalAction: {
    minHeight: 42,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  saveButtonText: {
    color: '#ffffff',
  },
  deleteConfirmButton: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
});
