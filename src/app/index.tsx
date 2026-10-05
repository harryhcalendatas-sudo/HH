import { Appearance, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const activityItems = [
  { time: '09:30', label: 'Workout', tint: '#8b5cf6' },
  { time: '12:10', label: 'Focus block', tint: '#38bdf8' },
  { time: '18:45', label: 'Walk', tint: '#34d399' },
];

export default function ActivityScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme !== 'light';
  const palette = isDark ? darkPalette : lightPalette;

  return (
    <ThemedView style={[styles.container, { backgroundColor: palette.background }]}>
      <SafeAreaView style={styles.safeArea}>
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
            styles.panel,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}>
          <ThemedText type="smallBold" style={[styles.panelTitle, { color: palette.text }]}>
            Upcoming
          </ThemedText>

          {activityItems.map((item) => (
            <ThemedView
              key={item.label}
              style={[
                styles.activityRow,
                { backgroundColor: palette.row, borderColor: palette.border },
              ]}>
              <ThemedView style={[styles.dot, { backgroundColor: item.tint }]} />
              <ThemedText
                type="default"
                style={[styles.activityTime, { color: palette.mutedText }]}>
                {item.time}
              </ThemedText>
              <ThemedText type="default" style={[styles.activityLabel, { color: palette.text }]}>
                {item.label}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    gap: 18,
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
  panelTitle: {
    marginBottom: 14,
    letterSpacing: 0.7,
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
