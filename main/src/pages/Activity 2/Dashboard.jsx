import { ScrollView, StyleSheet, Text, View } from "react-native-web";

const tasks = [
  { time: "09:00", title: "Review product brief", detail: "Studio project · 30 min", color: "#D5F36B", mark: "01" },
  { time: "10:30", title: "Design sync", detail: "With the creative team · 45 min", color: "#F6B49B", mark: "02" },
  { time: "13:00", title: "Build the first draft", detail: "Deep work · 90 min", color: "#B8D8F4", mark: "03" },
];

const habits = [
  { label: "Read for 20 minutes", complete: true },
  { label: "Get outside", complete: true },
  { label: "Plan tomorrow", complete: false },
];

function Label({ children, style }) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

function Dashboard() {
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <View style={styles.layout}>
        <View style={styles.sidebar}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}><Text style={styles.brandMarkText}>d</Text></View>
            <Text style={styles.brandName}>dayform</Text>
          </View>

          <Label style={styles.sideCaption}>WORKSPACE</Label>
          <View style={styles.navItemActive}>
            <Text style={styles.navIcon}>◫</Text><Text style={styles.navTextActive}>Overview</Text>
            <View style={styles.navDot} />
          </View>
          <View style={styles.navItem}><Text style={styles.navIcon}>▤</Text><Text style={styles.navText}>My tasks</Text><Text style={styles.navCount}>5</Text></View>
          <View style={styles.navItem}><Text style={styles.navIcon}>▦</Text><Text style={styles.navText}>Calendar</Text></View>
          <View style={styles.navItem}><Text style={styles.navIcon}>◷</Text><Text style={styles.navText}>Insights</Text></View>

          <View style={styles.sidebarBottom}>
            <View style={styles.streakCard}>
              <View style={styles.streakTop}><Text style={styles.streakFlame}>✳</Text><Label>THIS WEEK</Label></View>
              <Text style={styles.streakNumber}>4 day streak</Text>
              <Text style={styles.streakDetail}>You’re finding your rhythm.</Text>
              <View style={styles.weekDots}>
                {[true, true, true, true, false, false, false].map((done, i) => (
                  <View key={i} style={[styles.weekDot, done && styles.weekDotDone]} />
                ))}
              </View>
              <View style={styles.weekLabels}>{["M", "T", "W", "T", "F", "S", "S"].map((day, i) => <Text key={i} style={styles.weekLabel}>{day}</Text>)}</View>
            </View>
            <View style={styles.profileRow}>
              <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
              <View style={styles.profileCopy}><Text style={styles.profileName}>Alex Morgan</Text><Text style={styles.profileTier}>Personal workspace</Text></View>
              <Text style={styles.profileMore}>···</Text>
            </View>
          </View>
        </View>

        <View style={styles.main}>
          <View style={styles.topbar}>
            <View><Text style={styles.breadcrumb}>Workspace <Text style={styles.breadcrumbSlash}>/</Text> Overview</Text></View>
            <View style={styles.topbarRight}>
              <View style={styles.search}><Text style={styles.searchIcon}>⌕</Text><Text style={styles.searchText}>Search anything</Text><Text style={styles.shortcut}>⌘ K</Text></View>
              <View style={styles.notification}><Text style={styles.notificationIcon}>♧</Text><View style={styles.notificationDot} /></View>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.headingRow}>
              <View>
                <Label style={styles.dateLabel}>TUESDAY, SEPTEMBER 29</Label>
                <Text style={styles.heading}>Good morning, Alex<Text style={styles.headingPeriod}>.</Text></Text>
                <Text style={styles.subheading}>A little progress adds up. Here’s your day at a glance.</Text>
              </View>
              <View style={styles.dayPicker}><Text style={styles.dayPickerText}>Today</Text><Text style={styles.dayPickerArrow}>⌄</Text></View>
            </View>

            <View style={styles.hero}>
              <View style={styles.heroCopy}>
                <View style={styles.heroEyebrow}><View style={styles.liveDot} /><Text style={styles.heroEyebrowText}>YOUR DAILY FOCUS</Text></View>
                <Text style={styles.heroTitle}>Make today{`\n`}count.</Text>
                <Text style={styles.heroDescription}>You’ve got this. Keep your attention on what matters most.</Text>
                <View style={styles.progressRow}><View style={styles.progressTrack}><View style={styles.progressFill} /></View><Text style={styles.progressText}>3 of 5 done</Text></View>
              </View>
              <View style={styles.heroRight}>
                <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>✳</Text></View>
                <Text style={styles.heroQuote}>“Small steps{`\n`}still move you{`\n`}forward.”</Text>
                <Text style={styles.heroAuthor}>A NOTE TO SELF</Text>
              </View>
              <View style={styles.heroIndex}><Text style={styles.heroIndexText}>09 / 29</Text></View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.stat}><View style={styles.statIconWrap}><Text style={styles.statIcon}>◷</Text></View><View><Text style={styles.statValue}>3h 20m</Text><Text style={styles.statLabel}>FOCUS TIME</Text></View><Text style={styles.statTrend}>↗ 12%</Text></View>
              <View style={styles.stat}><View style={[styles.statIconWrap, styles.statIconPeach]}><Text style={styles.statIcon}>✓</Text></View><View><Text style={styles.statValue}>3 <Text style={styles.statMuted}>/ 5</Text></Text><Text style={styles.statLabel}>TASKS DONE</Text></View><View style={styles.miniBars}>{[8, 13, 10, 18, 14, 22, 18].map((h, i) => <View key={i} style={[styles.miniBar, { height: h }, i === 5 && styles.miniBarActive]} />)}</View></View>
              <View style={[styles.stat, styles.statLast]}><View style={[styles.statIconWrap, styles.statIconBlue]}><Text style={styles.statIcon}>✳</Text></View><View><Text style={styles.statValue}>4 days</Text><Text style={styles.statLabel}>CURRENT STREAK</Text></View><Text style={styles.statTrend}>Personal best: 9</Text></View>
            </View>

            <View style={styles.columns}>
              <View style={styles.schedule}>
                <View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>Today’s plan</Text><Text style={styles.sectionSubtitle}>A clear path, one step at a time</Text></View><Text style={styles.viewAll}>View calendar ↗</Text></View>
                <View style={styles.timeline}>
                  {tasks.map((task, i) => (
                    <View style={styles.taskRow} key={task.mark}>
                      <Text style={styles.taskTime}>{task.time}</Text>
                      <View style={styles.timelineRail}><View style={[styles.timelineDot, { backgroundColor: task.color }]} />{i < tasks.length - 1 && <View style={styles.timelineLine} />}</View>
                      <View style={styles.taskCard}>
                        <View style={[styles.taskMark, { backgroundColor: task.color }]}><Text style={styles.taskMarkText}>{task.mark}</Text></View>
                        <View style={styles.taskCopy}><Text style={styles.taskTitle}>{task.title}</Text><Text style={styles.taskDetail}>{task.detail}</Text></View>
                        <Text style={styles.taskMore}>···</Text>
                      </View>
                    </View>
                  ))}
                  <View style={styles.taskRow}>
                    <Text style={styles.taskTime}>15:30</Text><View style={styles.timelineRail}><View style={[styles.timelineDot, styles.timelineDotLast]} /></View>
                    <View style={styles.addTask}><Text style={styles.addTaskText}>＋</Text><Text style={styles.addTaskLabel}>Make space for something new</Text></View>
                  </View>
                </View>
              </View>

              <View style={styles.rightColumn}>
                <View style={styles.habitsCard}>
                  <View style={styles.sectionHeading}><View><Text style={styles.sectionTitle}>Daily rituals</Text><Text style={styles.sectionSubtitle}>2 of 3 complete</Text></View><Text style={styles.habitSpark}>✳</Text></View>
                  <View style={styles.habitsList}>{habits.map((habit) => <View style={styles.habitRow} key={habit.label}><View style={[styles.checkbox, habit.complete && styles.checkboxDone]}>{habit.complete && <Text style={styles.checkmark}>✓</Text>}</View><Text style={[styles.habitLabel, habit.complete && styles.habitLabelDone]}>{habit.label}</Text></View>)}</View>
                  <View style={styles.habitsFooter}><Text style={styles.habitsFooterText}>Consistency over intensity.</Text><Text style={styles.habitsFooterMark}>↗</Text></View>
                </View>
                <View style={styles.noteCard}>
                  <View style={styles.noteHeader}><Text style={styles.noteLabel}>A MOMENT TO RESET</Text><Text style={styles.noteIcon}>↗</Text></View>
                  <Text style={styles.noteTitle}>Take a breath.</Text>
                  <Text style={styles.noteBody}>You don’t have to do it all at once. Just begin with the next thing.</Text>
                  <View style={styles.noteRule} /><Text style={styles.noteTime}>2 MIN · ANYTIME</Text>
                </View>
              </View>
            </View>
            <Text style={styles.footer}>A slower day can still be a good day. <Text style={styles.footerMark}>✳</Text></Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F3F5F2" },
  pageContent: { flexGrow: 1 },
  layout: { flex: 1, flexDirection: "row", minHeight: "100%", maxWidth: 1600, width: "100%", alignSelf: "center" },
  sidebar: { width: 236, flexShrink: 0, backgroundColor: "#FAFBF9", borderRightWidth: 1, borderColor: "#E7EAE5", paddingHorizontal: 20, paddingTop: 28, paddingBottom: 18 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 52 },
  brandMark: { width: 34, height: 34, borderRadius: 11, backgroundColor: "#183E38", alignItems: "center", justifyContent: "center" },
  brandMarkText: { color: "#D5F36B", fontSize: 23, fontWeight: "700", lineHeight: 28 },
  brandName: { fontSize: 19, color: "#233631", fontWeight: "700", letterSpacing: -0.5 },
  label: { color: "#8B9690", fontSize: 10, fontWeight: "700", letterSpacing: 1.2 },
  sideCaption: { marginBottom: 13, marginLeft: 10 },
  navItem: { height: 44, flexDirection: "row", alignItems: "center", paddingHorizontal: 11, borderRadius: 8, gap: 12 },
  navItemActive: { height: 44, flexDirection: "row", alignItems: "center", paddingHorizontal: 11, borderRadius: 8, gap: 12, backgroundColor: "#EDF2E8", marginBottom: 3 },
  navIcon: { color: "#7E8C84", fontSize: 17, width: 20, textAlign: "center" },
  navText: { color: "#65716B", fontSize: 13, flex: 1 },
  navTextActive: { color: "#25433A", fontSize: 13, fontWeight: "600", flex: 1 },
  navDot: { height: 6, width: 6, borderRadius: 3, backgroundColor: "#A7C650" },
  navCount: { color: "#87918A", fontSize: 11, backgroundColor: "#EFF1ED", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 7 },
  sidebarBottom: { marginTop: "auto" },
  streakCard: { padding: 15, backgroundColor: "#F1F4EB", borderRadius: 10, marginBottom: 20 },
  streakTop: { flexDirection: "row", alignItems: "center", gap: 7 },
  streakFlame: { color: "#8BAA3E", fontSize: 14 },
  streakNumber: { color: "#34433B", fontSize: 16, fontWeight: "700", marginTop: 11 },
  streakDetail: { color: "#808B81", fontSize: 11, marginTop: 4 },
  weekDots: { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  weekDot: { width: 15, height: 15, borderRadius: 8, backgroundColor: "#E0E5DC" },
  weekDotDone: { backgroundColor: "#B8D467" },
  weekLabels: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
  weekLabel: { width: 15, textAlign: "center", fontSize: 9, color: "#8A938A" },
  profileRow: { borderTopWidth: 1, borderColor: "#E7EAE5", paddingTop: 16, flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 34, height: 34, borderRadius: 12, backgroundColor: "#F3D2C0", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#764F3E", fontSize: 14, fontWeight: "700" },
  profileCopy: { flex: 1 },
  profileName: { color: "#35413B", fontSize: 12, fontWeight: "600" },
  profileTier: { color: "#8A948E", fontSize: 10, marginTop: 3 },
  profileMore: { color: "#818B85", fontSize: 18, letterSpacing: 1 },
  main: { flex: 1, minWidth: 0 },
  topbar: { height: 70, paddingHorizontal: 38, borderBottomWidth: 1, borderColor: "#E7EAE5", flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F8F9F6" },
  breadcrumb: { color: "#758078", fontSize: 12 },
  breadcrumbSlash: { color: "#BBC1BA", marginHorizontal: 7 },
  topbarRight: { flexDirection: "row", alignItems: "center", gap: 17 },
  search: { height: 35, width: 208, borderRadius: 7, borderWidth: 1, borderColor: "#E5E9E3", backgroundColor: "#FBFCFA", flexDirection: "row", alignItems: "center", paddingHorizontal: 9, gap: 7 },
  searchIcon: { fontSize: 18, color: "#8C968F" },
  searchText: { fontSize: 11, color: "#9AA39C", flex: 1 },
  shortcut: { fontSize: 9, color: "#919A92", backgroundColor: "#F1F3EF", paddingHorizontal: 5, paddingVertical: 3, borderRadius: 3 },
  notification: { width: 32, height: 32, alignItems: "center", justifyContent: "center", borderRadius: 8, borderWidth: 1, borderColor: "#E5E9E3", backgroundColor: "#FBFCFA", position: "relative" },
  notificationIcon: { color: "#68766E", fontSize: 17 },
  notificationDot: { position: "absolute", right: 6, top: 6, width: 5, height: 5, borderRadius: 3, backgroundColor: "#E99472" },
  content: { width: "100%", maxWidth: 1200, alignSelf: "center", paddingHorizontal: 38, paddingTop: 34, paddingBottom: 25 },
  headingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 },
  dateLabel: { color: "#89948C", marginBottom: 9 },
  heading: { color: "#273630", fontSize: 31, fontWeight: "600", letterSpacing: -1.1 },
  headingPeriod: { color: "#A9C84E" },
  subheading: { color: "#818C84", fontSize: 13, marginTop: 7 },
  dayPicker: { borderWidth: 1, borderColor: "#E1E6DF", borderRadius: 7, backgroundColor: "#FAFBF9", paddingHorizontal: 12, paddingVertical: 9, flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 2 },
  dayPickerText: { color: "#506057", fontSize: 11, fontWeight: "600" },
  dayPickerArrow: { color: "#869189", fontSize: 13 },
  hero: { minHeight: 216, borderRadius: 12, backgroundColor: "#193E38", padding: 25, flexDirection: "row", overflow: "hidden", position: "relative" },
  heroCopy: { flex: 1, maxWidth: 480 },
  heroEyebrow: { flexDirection: "row", alignItems: "center", gap: 8 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#D5F36B" },
  heroEyebrowText: { color: "#B6C9BA", fontSize: 9, fontWeight: "700", letterSpacing: 1.4 },
  heroTitle: { color: "#F5F7F1", fontSize: 36, fontWeight: "600", lineHeight: 39, letterSpacing: -1.1, marginTop: 14 },
  heroDescription: { color: "#C0CEC4", fontSize: 11, marginTop: 8 },
  progressRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 17 },
  progressTrack: { width: 116, height: 5, backgroundColor: "#47635A", borderRadius: 3, overflow: "hidden" },
  progressFill: { width: "60%", height: 5, borderRadius: 3, backgroundColor: "#D5F36B" },
  progressText: { color: "#D2DCD2", fontSize: 10 },
  heroRight: { width: 190, marginLeft: "auto", borderLeftWidth: 1, borderColor: "#416057", paddingLeft: 25, justifyContent: "center" },
  heroBadge: { height: 27, width: 27, backgroundColor: "#D5F36B", borderRadius: 9, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  heroBadgeText: { color: "#28483B", fontSize: 17 },
  heroQuote: { color: "#F2F5EE", fontSize: 17, lineHeight: 22, fontWeight: "500" },
  heroAuthor: { color: "#A7BDB0", fontSize: 8, fontWeight: "700", letterSpacing: 1.3, marginTop: 10 },
  heroIndex: { position: "absolute", right: 25, top: 20 },
  heroIndexText: { color: "#7B9788", fontSize: 9, letterSpacing: 1.1 },
  statsRow: { flexDirection: "row", backgroundColor: "#FBFCFA", borderWidth: 1, borderColor: "#E8EBE6", borderRadius: 10, marginTop: 17, minHeight: 78, alignItems: "center", paddingHorizontal: 18 },
  stat: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 10, borderRightWidth: 1, borderColor: "#E9ECE7", paddingRight: 14, marginRight: 14 },
  statLast: { borderRightWidth: 0, marginRight: 0, paddingRight: 0 },
  statIconWrap: { width: 32, height: 32, borderRadius: 10, backgroundColor: "#EDF2E8", alignItems: "center", justifyContent: "center" },
  statIconPeach: { backgroundColor: "#F9EEE8" },
  statIconBlue: { backgroundColor: "#ECF1F6" },
  statIcon: { color: "#718C55", fontSize: 15 },
  statValue: { color: "#34423A", fontSize: 16, fontWeight: "700" },
  statMuted: { color: "#97A098", fontSize: 13, fontWeight: "500" },
  statLabel: { color: "#89938C", fontSize: 8, fontWeight: "700", letterSpacing: 0.8, marginTop: 4 },
  statTrend: { color: "#7B9652", fontSize: 9, marginLeft: "auto" },
  miniBars: { flexDirection: "row", alignItems: "flex-end", gap: 3, height: 24, marginLeft: "auto" },
  miniBar: { width: 4, borderRadius: 2, backgroundColor: "#DCE4D1" },
  miniBarActive: { backgroundColor: "#ADC85E" },
  columns: { flexDirection: "row", alignItems: "flex-start", gap: 24, marginTop: 28 },
  schedule: { flex: 1.65, minWidth: 0 },
  rightColumn: { flex: 1, minWidth: 230, gap: 14 },
  sectionHeading: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { color: "#35433B", fontSize: 16, fontWeight: "600" },
  sectionSubtitle: { color: "#8A948D", fontSize: 10, marginTop: 4 },
  viewAll: { color: "#657C51", fontSize: 10, fontWeight: "600" },
  timeline: { paddingTop: 3 },
  taskRow: { flexDirection: "row", minHeight: 68 },
  taskTime: { width: 48, color: "#89938C", fontSize: 10, paddingTop: 15 },
  timelineRail: { width: 22, alignItems: "center", position: "relative" },
  timelineDot: { width: 9, height: 9, borderRadius: 5, marginTop: 16, zIndex: 1, borderWidth: 2, borderColor: "#F3F5F2" },
  timelineDotLast: { backgroundColor: "#BFC9BE" },
  timelineLine: { position: "absolute", top: 25, bottom: -2, width: 1, backgroundColor: "#E1E6DF" },
  taskCard: { flex: 1, minWidth: 0, minHeight: 55, backgroundColor: "#FBFCFA", borderWidth: 1, borderColor: "#E8EBE6", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, flexDirection: "row", alignItems: "center", gap: 11 },
  taskMark: { width: 32, height: 32, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  taskMarkText: { fontSize: 9, fontWeight: "700", color: "#455147" },
  taskCopy: { flex: 1, minWidth: 0 },
  taskTitle: { color: "#39463F", fontSize: 11, fontWeight: "600" },
  taskDetail: { color: "#89938C", fontSize: 9, marginTop: 4 },
  taskMore: { color: "#949D96", fontSize: 17 },
  addTask: { flex: 1, minWidth: 0, height: 43, borderWidth: 1, borderStyle: "dashed", borderColor: "#D9DFD7", borderRadius: 8, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 9 },
  addTaskText: { color: "#85947B", fontSize: 17 },
  addTaskLabel: { color: "#929A92", fontSize: 10 },
  habitsCard: { backgroundColor: "#FBFCFA", borderWidth: 1, borderColor: "#E8EBE6", borderRadius: 10, padding: 16 },
  habitSpark: { color: "#A4BF56", fontSize: 17 },
  habitsList: { gap: 15, paddingVertical: 5 },
  habitRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  checkbox: { width: 17, height: 17, borderRadius: 5, borderWidth: 1, borderColor: "#D3DAD0", alignItems: "center", justifyContent: "center" },
  checkboxDone: { backgroundColor: "#D5F36B", borderColor: "#D5F36B" },
  checkmark: { color: "#425336", fontSize: 10, fontWeight: "700" },
  habitLabel: { color: "#59665E", fontSize: 10 },
  habitLabelDone: { color: "#879189" },
  habitsFooter: { borderTopWidth: 1, borderColor: "#E9ECE7", marginTop: 10, paddingTop: 12, flexDirection: "row", justifyContent: "space-between" },
  habitsFooterText: { color: "#89938C", fontSize: 9 },
  habitsFooterMark: { color: "#8BA34E", fontSize: 12 },
  noteCard: { backgroundColor: "#F7ECE5", borderRadius: 10, padding: 17 },
  noteHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  noteLabel: { color: "#A37D68", fontSize: 8, fontWeight: "700", letterSpacing: 1.1 },
  noteIcon: { color: "#AA8069", fontSize: 15 },
  noteTitle: { color: "#57483E", fontSize: 17, fontWeight: "600", marginTop: 15 },
  noteBody: { color: "#816F63", fontSize: 10, lineHeight: 16, marginTop: 6 },
  noteRule: { height: 1, backgroundColor: "#E9D8CB", marginTop: 14, marginBottom: 10 },
  noteTime: { color: "#A1806E", fontSize: 8, fontWeight: "700", letterSpacing: 0.8 },
  footer: { color: "#919A92", fontSize: 9, textAlign: "center", marginTop: 28 },
  footerMark: { color: "#9FB852" },
});

export default Dashboard;