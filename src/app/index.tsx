import { useState } from 'react';
import { Appearance, Pressable, ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const activityItems = [
  { time: '09:30', label: 'Workout', tint: '#8b5cf6' },
  { time: '12:10', label: 'Focus block', tint: '#38bdf8' },
  { time: '18:45', label: 'Walk', tint: '#34d399' },
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

export default function ActivityScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme !== 'light';
  const palette = isDark ? darkPalette : lightPalette;
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const upcomingItems = activityItems.filter((item) => !completedItems.includes(item.label));
  const doneItems = activityItems.filter((item) => completedItems.includes(item.label));
  const todayIndex = (new Date().getDay() + 6) % 7;
  const dailyGoal = activityItems.length;
  const goalProgress = doneItems.length / dailyGoal;

  const toggleActivity = (label: string) => {
    setCompletedItems((currentItems) =>
      currentItems.includes(label)
        ? currentItems.filter((item) => item !== label)
        : [...currentItems, label],
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: palette.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
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
                onPress={() => Appearance.setColorScheme(isDark ? 'light' : 'dark')}
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
              <ThemedText type="small" style={[styles.goalCount, { color: palette.eyebrow }]}>
                {doneItems.length} of {dailyGoal}
              </ThemedText>
            </ThemedView>
            <ThemedView
              accessibilityRole="progressbar"
              accessibilityLabel="Daily activity goal"
              accessibilityValue={{ min: 0, max: dailyGoal, now: doneItems.length }}
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
                ? 'Daily goal complete. Great work!'
                : `${dailyGoal - doneItems.length} ${
                    dailyGoal - doneItems.length === 1 ? 'activity' : 'activities'
                  } left to reach your goal`}
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
                Today {doneItems.length}/{activityItems.length}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.weekChart}>
              {weekDays.map((day, index) => {
                const isToday = index === todayIndex;
                const progress = isToday ? doneItems.length / activityItems.length : 0;

                return (
                  <ThemedView
                    key={`${day.name}-${index}`}
                    style={styles.dayColumn}
                    accessibilityLabel={
                      isToday
                        ? `${day.name}, today, ${doneItems.length} of ${activityItems.length} activities complete`
                        : `${day.name}, no activity history tracked`
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
              Today updates as you complete activities. Earlier days aren’t tracked yet.
            </ThemedText>
          </ThemedView>

          <ThemedView
            style={[
              styles.panel,
              { backgroundColor: palette.surface, borderColor: palette.border },
            ]}>
            <ThemedText type="smallBold" style={[styles.panelTitle, { color: palette.text }]}>
              Upcoming
            </ThemedText>

            {upcomingItems.length === 0 ? (
              <ThemedText
                type="small"
                style={[styles.emptyMessage, { color: palette.mutedText }]}>
                All activities complete. Nice work!
              </ThemedText>
            ) : (
              upcomingItems.map((item) => (
                <Pressable
                  key={item.label}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: false }}
                  accessibilityLabel={`Mark ${item.label} complete`}
                  onPress={() => toggleActivity(item.label)}
                  style={({ pressed }) => [
                    styles.activityRow,
                    {
                      backgroundColor: palette.row,
                      borderColor: palette.border,
                      opacity: pressed ? 0.72 : 1,
                    },
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
                  <ThemedView style={[styles.checkCircle, { borderColor: palette.mutedText }]} />
                </Pressable>
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
                  <Pressable
                    key={item.label}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: true }}
                    accessibilityLabel={`Mark ${item.label} incomplete`}
                    onPress={() => toggleActivity(item.label)}
                    style={({ pressed }) => [
                      styles.activityRow,
                      styles.completedRow,
                      {
                        backgroundColor: palette.row,
                        borderColor: palette.border,
                        opacity: pressed ? 0.72 : 1,
                      },
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
                ))}
              </>
            )}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
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
  goalCount: {
    fontSize: 13,
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
});
