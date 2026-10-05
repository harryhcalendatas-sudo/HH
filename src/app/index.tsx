import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const activityItems = [
  { time: '09:30', label: 'Workout', tint: '#8b5cf6' },
  { time: '12:10', label: 'Focus block', tint: '#38bdf8' },
  { time: '18:45', label: 'Walk', tint: '#34d399' },
];

export default function ActivityScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.headerCard}>
          <ThemedView style={styles.headerTopRow}>
            <ThemedText type="small" style={styles.labelText}>
              Today
            </ThemedText>

            <ThemedView style={styles.badge}>
              <ThemedText type="small" style={styles.badgeText}>
                +18%
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedText type="subtitle" style={styles.title}>
            Activity
          </ThemedText>

          <ThemedView style={styles.statsRow}>
            <ThemedView style={styles.statCard}>
              <ThemedText type="small" style={styles.statLabel}>
                Streak
              </ThemedText>
              <ThemedText type="title" style={styles.statValue}>
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

        <ThemedView style={styles.panel}>
          <ThemedText type="smallBold" style={styles.panelTitle}>
            Upcoming
          </ThemedText>

          {activityItems.map((item) => (
            <ThemedView key={item.label} style={styles.activityRow}>
              <ThemedView style={[styles.dot, { backgroundColor: item.tint }]} />
              <ThemedText type="default" style={styles.activityTime}>
                {item.time}
              </ThemedText>
              <ThemedText type="default" style={styles.activityLabel}>
                {item.label}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#070b17',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    gap: 18,
  },
  headerCard: {
    borderRadius: 30,
    padding: 22,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.18)',
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
  labelText: {
    color: '#a5b4fc',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(52, 211, 153, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.55)',
  },
  badgeText: {
    color: '#6ee7b7',
    fontSize: 11,
    letterSpacing: 0.4,
  },
  title: {
    color: '#f8fafc',
    marginBottom: 18,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111827',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.14)',
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
    color: '#cbd5e1',
    marginBottom: 8,
  },
  statLabelAccent: {
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 32,
    lineHeight: 38,
  },
  statValueAccent: {
    color: '#ffffff',
    fontSize: 32,
    lineHeight: 38,
  },
  panel: {
    backgroundColor: '#101827',
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.18)',
    shadowColor: '#020617',
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
  },
  panelTitle: {
    color: '#e2e8f0',
    marginBottom: 14,
    letterSpacing: 0.7,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0b1220',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.08)',
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
    color: '#cbd5e1',
  },
  activityLabel: {
    flex: 1,
    color: '#f8fafc',
  },
});
