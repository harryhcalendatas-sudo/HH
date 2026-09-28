import { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const filters = [
  { key: 'all', label: 'Everything' },
  { key: 'active', label: 'To do' },
  { key: 'done', label: 'Done' },
];

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');
  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.length - completedCount;
  const visibleTasks = useMemo(
    () => tasks.filter((task) => filter === 'all' || (filter === 'done' ? task.completed : !task.completed)),
    [filter, tasks],
  );

  function addTask() {
    const title = input.trim();
    if (!title) return;

    setTasks((current) => [{ id: `${Date.now()}-${current.length}`, title, completed: false }, ...current]);
    setInput('');
  }

  function toggleTask(id) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)),
    );
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.page}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>A CLEARER DAY</Text>
              <Text style={styles.title}>Little by{'\n'}little.</Text>
            </View>
            <View style={styles.countMark} accessibilityLabel={`${activeCount} tasks remaining`}>
              <Text style={styles.countNumber}>{activeCount}</Text>
              <Text style={styles.countLabel}>LEFT</Text>
            </View>
          </View>

          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              {tasks.length === 0
                ? 'Start with one thing on your mind.'
                : `${completedCount} of ${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} complete`}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${tasks.length ? (completedCount / tasks.length) * 100 : 0}%` },
                ]}
              />
            </View>
          </View>

          <View style={styles.addRow}>
            <TextInput
              accessibilityLabel="New task"
              placeholder="Add a task..."
              placeholderTextColor="#87918A"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={addTask}
              returnKeyType="done"
              maxLength={100}
              style={styles.input}
            />
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Add task"
              activeOpacity={0.78}
              onPress={addTask}
              style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>YOUR LIST</Text>
            <Text style={styles.itemCount}>{tasks.length.toString().padStart(2, '0')}</Text>
          </View>

          <View style={styles.filterBar} accessibilityRole="tablist">
            {filters.map((option) => (
              <TouchableOpacity
                key={option.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: filter === option.key }}
                activeOpacity={0.75}
                onPress={() => setFilter(option.key)}
                style={[styles.filterButton, filter === option.key && styles.filterButtonSelected]}>
                <Text
                  style={[
                    styles.filterText,
                    filter === option.key && styles.filterTextSelected,
                  ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <FlatList
            data={visibleTasks}
            keyExtractor={(task) => task.id}
            style={styles.list}
            contentContainerStyle={visibleTasks.length ? styles.listContent : styles.emptyListContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <View style={styles.emptyGlyph}>
                  <View style={styles.emptyGlyphLine} />
                  <View style={[styles.emptyGlyphLine, styles.emptyGlyphLineShort]} />
                </View>
                <Text style={styles.emptyTitle}>
                  {filter === 'done' ? 'Nothing checked off yet' : filter === 'active' && tasks.length ? 'All caught up' : 'A fresh page'}
                </Text>
                <Text style={styles.emptyCopy}>
                  {filter === 'done' ? 'Finished tasks will find their way here.' : 'Add a task above and give it a little space.'}
                </Text>
              </View>
            }
            renderItem={({ item, index }) => (
              <View style={[styles.taskRow, index === visibleTasks.length - 1 && styles.lastTaskRow]}>
                <TouchableOpacity
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: item.completed }}
                  accessibilityLabel={`Mark ${item.title} ${item.completed ? 'incomplete' : 'complete'}`}
                  activeOpacity={0.7}
                  onPress={() => toggleTask(item.id)}
                  style={[styles.checkButton, item.completed && styles.checkButtonCompleted]}>
                  {item.completed && <Text style={styles.checkMark}>✓</Text>}
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => toggleTask(item.id)}
                  style={styles.taskTitleButton}>
                  <Text style={[styles.taskTitle, item.completed && styles.taskTitleCompleted]}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${item.title}`}
                  activeOpacity={0.7}
                  onPress={() => deleteTask(item.id)}
                  style={styles.deleteButton}>
                  <Text style={styles.deleteText}>×</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={styles.footer}>
            <View style={styles.footerDot} />
            <Text style={styles.footerText}>ONE THING AT A TIME</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5EF',
  },
  page: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 620,
    paddingHorizontal: 26,
    paddingTop: 24,
    paddingBottom: 10,
  },
  header: {
    minHeight: 136,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerCopy: {
    gap: 10,
  },
  eyebrow: {
    color: '#B25A3E',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    color: '#1D3932',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
    fontSize: 42,
    lineHeight: 44,
  },
  countMark: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E5EBE1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  countNumber: {
    color: '#1D3932',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },
  countLabel: {
    color: '#64776D',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  summary: {
    marginTop: 15,
    marginBottom: 22,
    gap: 11,
  },
  summaryText: {
    color: '#65736B',
    fontSize: 14,
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#E0E3DC',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#B25A3E',
    borderRadius: 2,
  },
  addRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#CAD0C7',
  },
  input: {
    flex: 1,
    minHeight: 54,
    paddingHorizontal: 2,
    color: '#1D3932',
    fontSize: 16,
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1D3932',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#F5F5EF',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 31,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 27,
    marginBottom: 11,
  },
  sectionTitle: {
    color: '#1D3932',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  itemCount: {
    color: '#89928A',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  filterBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E3DC',
  },
  filterButton: {
    marginRight: 22,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  filterButtonSelected: {
    borderBottomColor: '#B25A3E',
  },
  filterText: {
    color: '#8A938C',
    fontSize: 13,
  },
  filterTextSelected: {
    color: '#1D3932',
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 4,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyGlyph: {
    width: 54,
    height: 54,
    borderWidth: 1,
    borderColor: '#C7D0C5',
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginBottom: 19,
  },
  emptyGlyphLine: {
    width: 20,
    height: 2,
    backgroundColor: '#B25A3E',
    borderRadius: 1,
  },
  emptyGlyphLineShort: {
    width: 13,
    backgroundColor: '#9CAB99',
  },
  emptyTitle: {
    color: '#1D3932',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
    fontSize: 23,
  },
  emptyCopy: {
    color: '#7A857C',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 7,
  },
  taskRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E3DC',
  },
  lastTaskRow: {
    borderBottomWidth: 0,
  },
  checkButton: {
    width: 23,
    height: 23,
    borderWidth: 1.5,
    borderColor: '#A9B4A8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButtonCompleted: {
    backgroundColor: '#1D3932',
    borderColor: '#1D3932',
  },
  checkMark: {
    color: '#F5F5EF',
    fontSize: 14,
    lineHeight: 17,
  },
  taskTitleButton: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 62,
    paddingHorizontal: 13,
  },
  taskTitle: {
    color: '#34483F',
    fontSize: 15,
    lineHeight: 21,
  },
  taskTitleCompleted: {
    color: '#98A198',
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    width: 38,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -7,
  },
  deleteText: {
    color: '#89928A',
    fontSize: 24,
    lineHeight: 26,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    gap: 7,
  },
  footerDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#B25A3E',
  },
  footerText: {
    color: '#929B93',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});