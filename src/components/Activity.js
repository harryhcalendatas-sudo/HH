import { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

const CATEGORIES = ['Chill', 'Night Drive', 'Focus', 'Workout'];
const FILTERS = ['All', ...CATEGORIES, 'Favorites'];

const INITIAL_SONGS = [
  { id: '1', title: 'Afterglow', artist: 'ODESZA', category: 'Chill', duration: '3:39', tint: '#7D6BFF', favorite: true },
  { id: '2', title: 'Midnight City', artist: 'M83', category: 'Night Drive', duration: '4:03', tint: '#3F8EFF', favorite: false },
  { id: '3', title: 'Sunset Lover', artist: 'Petit Biscuit', category: 'Chill', duration: '3:57', tint: '#F09A67', favorite: false },
  { id: '4', title: 'Space Song', artist: 'Beach House', category: 'Focus', duration: '5:20', tint: '#9875DE', favorite: true },
  { id: '5', title: 'Nights', artist: 'Frank Ocean', category: 'Night Drive', duration: '5:07', tint: '#46B9A8', favorite: false },
  { id: '6', title: 'The Less I Know The Better', artist: 'Tame Impala', category: 'Workout', duration: '3:36', tint: '#E97991', favorite: false },
];

const PALETTE = {
  background: '#0B0B10',
  panel: '#14141D',
  panelLight: '#1B1B27',
  border: '#292936',
  text: '#F5F4FA',
  muted: '#9292A4',
  purple: '#A88BFF',
  blue: '#76A9FF',
};

export default function Activity() {
  const { width } = useWindowDimensions();
  const isWide = width >= 850;
  const [songs, setSongs] = useState(INITIAL_SONGS);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [artistInput, setArtistInput] = useState('');
  const [newCategory, setNewCategory] = useState('Chill');

  const visibleSongs = songs.filter((song) => {
    const matchesSearch = `${song.title} ${song.artist}`.toLowerCase().includes(search.trim().toLowerCase());
    const matchesFilter = activeFilter === 'All'
      || (activeFilter === 'Favorites' ? song.favorite : song.category === activeFilter);
    return matchesSearch && matchesFilter;
  });

  function playSong(song) {
    setCurrentSong(song);
    setIsPlaying(true);
  }

  function moveSong(direction) {
    if (!songs.length) return;
    const currentIndex = songs.findIndex((song) => song.id === currentSong?.id);
    const nextIndex = currentIndex < 0
      ? 0
      : (currentIndex + direction + songs.length) % songs.length;
    playSong(songs[nextIndex]);
  }

  function toggleFavorite(id) {
    setSongs((currentSongs) => currentSongs.map((song) => (
      song.id === id ? { ...song, favorite: !song.favorite } : song
    )));
    setCurrentSong((current) => current?.id === id ? { ...current, favorite: !current.favorite } : current);
  }

  function addSong() {
    const title = titleInput.trim();
    const artist = artistInput.trim();
    if (!title || !artist) return;

    setSongs((currentSongs) => [{
      id: String(Date.now()),
      title,
      artist,
      category: newCategory,
      duration: '3:42',
      tint: '#6E91FF',
      favorite: false,
    }, ...currentSongs]);
    setActiveFilter('All');
    setSearch('');
    setTitleInput('');
    setArtistInput('');
  }

  function renderSong({ item, index }) {
    const isCurrent = currentSong?.id === item.id;
    return (
      <View style={[styles.songRow, isCurrent && styles.songRowCurrent]}>
        <View style={[styles.cover, { backgroundColor: `${item.tint}22`, borderColor: `${item.tint}66` }]}>
          <View style={[styles.coverOrb, { backgroundColor: item.tint }]} />
          <Text style={styles.coverNumber}>{String(index + 1).padStart(2, '0')}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.songDetails}
          onPress={() => playSong(item)}
          accessibilityRole="button"
          accessibilityLabel={`Play ${item.title} by ${item.artist}`}>
          <Text numberOfLines={1} style={[styles.songTitle, isCurrent && styles.currentText]}>{item.title}</Text>
          <Text numberOfLines={1} style={styles.artist}>{item.artist}</Text>
        </TouchableOpacity>
        {isWide && <Text style={styles.categoryText}>{item.category}</Text>}
        <Text style={styles.duration}>{item.duration}</Text>
        <TouchableOpacity
          activeOpacity={0.65}
          style={styles.iconButton}
          onPress={() => toggleFavorite(item.id)}
          accessibilityRole="button"
          accessibilityLabel={item.favorite ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`}>
          <Text style={[styles.heart, item.favorite && styles.heartActive]}>{item.favorite ? '♥' : '♡'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.75}
          style={[styles.playButton, isCurrent && styles.playButtonCurrent]}
          onPress={() => isCurrent ? setIsPlaying((playing) => !playing) : playSong(item)}
          accessibilityRole="button"
          accessibilityLabel={isCurrent && isPlaying ? `Pause ${item.title}` : `Play ${item.title}`}>
          <Text style={styles.playIcon}>{isCurrent && isPlaying ? 'Ⅱ' : '▶'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.page, isWide && styles.pageWide]}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.brandLine}>
            <View style={styles.brandMark}><Text style={styles.brandMarkText}>V</Text></View>
            <View>
              <Text style={styles.brand}>VIBEPLAY</Text>
              <Text style={styles.tagline}>your sound, your vibe</Text>
            </View>
          </View>
          <View style={styles.profile}><Text style={styles.profileInitial}>J</Text></View>
        </View>

        <View style={[styles.intro, isWide && styles.introWide]}>
          <View style={styles.introCopy}>
            <Text style={styles.eyebrow}>MONDAY, YOUR WAY</Text>
            <Text style={styles.headline}>Find your{'\n'}frequency.</Text>
            <Text style={styles.introSub}>A little soundtrack for wherever you are.</Text>
          </View>
          <View style={styles.mixCard}>
            <View style={styles.mixTopline}>
              <Text style={styles.mixLabel}>YOUR LIBRARY</Text>
              <Text style={styles.mixSpark}>✦</Text>
            </View>
            <Text style={styles.mixNumber}>{String(songs.length).padStart(2, '0')}</Text>
            <Text style={styles.mixFoot}>tracks in your rotation</Text>
            <View style={styles.equalizer}>
              {[14, 27, 18, 34, 23, 12, 29, 17, 36, 21, 11, 26, 16, 31, 19, 9].map((height, index) => (
                <View key={index} style={[styles.equalizerBar, { height, opacity: 0.45 + (index % 3) * 0.18 }]} />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}>⌕</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search songs or artists"
            placeholderTextColor={PALETTE.muted}
            style={styles.searchInput}
            accessibilityLabel="Search songs or artists"
            returnKeyType="search"
          />
          <Text style={styles.searchHint}>⌘ K</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {FILTERS.map((filter) => {
            const selected = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                activeOpacity={0.75}
                onPress={() => setActiveFilter(filter)}
                style={[styles.filterChip, selected && styles.filterChipSelected]}
                accessibilityRole="button"
                accessibilityState={{ selected }}>
                <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{filter === 'Favorites' ? '♡  Favorites' : filter}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={[styles.contentGrid, isWide && styles.contentGridWide]}>
          <View style={styles.library}>
            <View style={styles.sectionHeading}>
              <View>
                <Text style={styles.sectionTitle}>{activeFilter === 'All' ? 'Your playlists' : activeFilter}</Text>
                <Text style={styles.sectionCaption}>{visibleSongs.length} {visibleSongs.length === 1 ? 'track' : 'tracks'} in the mix</Text>
              </View>
              <Text style={styles.sortLabel}>RECENTLY ADDED  ↓</Text>
            </View>
            <View style={styles.songList}>
              <View style={styles.listHeader}>
                <Text style={[styles.columnLabel, styles.trackColumn]}>TRACK</Text>
                {isWide && <Text style={[styles.columnLabel, styles.categoryColumn]}>MOOD</Text>}
                <Text style={[styles.columnLabel, styles.durationColumn]}>TIME</Text>
                <View style={styles.actionColumn} />
                <View style={styles.actionColumn} />
              </View>
              {visibleSongs.length > 0 ? (
                <FlatList
                  data={visibleSongs}
                  keyExtractor={(item) => item.id}
                  renderItem={renderSong}
                  scrollEnabled={false}
                  keyboardShouldPersistTaps="handled"
                />
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>♫</Text>
                  <Text style={styles.emptyTitle}>Nothing on this frequency</Text>
                  <Text style={styles.emptyText}>Try another search or switch up your mood.</Text>
                </View>
              )}
            </View>
          </View>

          <View style={[styles.addPanel, !isWide && styles.addPanelCompact]}>
            <View style={styles.addHeadingRow}>
              <View>
                <Text style={styles.addEyebrow}>GROW YOUR COLLECTION</Text>
                <Text style={styles.addTitle}>Add a track</Text>
              </View>
              <View style={styles.addPlus}><Text style={styles.addPlusText}>+</Text></View>
            </View>
            <Text style={styles.fieldLabel}>SONG TITLE</Text>
            <TextInput
              value={titleInput}
              onChangeText={setTitleInput}
              placeholder="e.g. Golden Hour"
              placeholderTextColor={PALETTE.muted}
              style={styles.field}
              accessibilityLabel="Song title"
              returnKeyType="next"
            />
            <Text style={styles.fieldLabel}>ARTIST</Text>
            <TextInput
              value={artistInput}
              onChangeText={setArtistInput}
              placeholder="e.g. Kacey Musgraves"
              placeholderTextColor={PALETTE.muted}
              style={styles.field}
              accessibilityLabel="Artist"
              returnKeyType="done"
            />
            <Text style={styles.fieldLabel}>PICK A MOOD</Text>
            <View style={styles.categoryChoices}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category}
                  activeOpacity={0.75}
                  onPress={() => setNewCategory(category)}
                  style={[styles.categoryChoice, newCategory === category && styles.categoryChoiceSelected]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: newCategory === category }}>
                  <Text style={[styles.categoryChoiceText, newCategory === category && styles.categoryChoiceTextSelected]}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={addSong}
              style={[styles.addButton, (!titleInput.trim() || !artistInput.trim()) && styles.addButtonMuted]}
              accessibilityRole="button">
              <Text style={styles.addButtonText}>Add to library  <Text style={styles.addButtonArrow}>↗</Text></Text>
            </TouchableOpacity>
            <Text style={styles.addNote}>Your next favorite starts here.</Text>
          </View>
        </View>
        <View style={styles.footerSpace} />
      </ScrollView>

      <View style={styles.playerDock}>
        <View style={styles.playerArtwork}><Text style={styles.playerArtworkText}>♫</Text></View>
        <View style={styles.playerSong}>
          <Text numberOfLines={1} style={styles.playerTitle}>{currentSong?.title || 'Choose your soundtrack'}</Text>
          <Text numberOfLines={1} style={styles.playerArtist}>{currentSong?.artist || 'Your next favorite is waiting'}</Text>
        </View>
        <View style={styles.playerControls}>
          <TouchableOpacity style={styles.playerControl} activeOpacity={0.65} onPress={() => moveSong(-1)} accessibilityRole="button" accessibilityLabel="Previous track">
            <Text style={styles.controlGlyph}>|◀</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.playerPlay}
            activeOpacity={0.75}
            onPress={() => currentSong ? setIsPlaying((playing) => !playing) : playSong(songs[0])}
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Pause' : 'Play'}>
            <Text style={styles.playerPlayGlyph}>{isPlaying ? 'Ⅱ' : '▶'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.playerControl} activeOpacity={0.65} onPress={() => moveSong(1)} accessibilityRole="button" accessibilityLabel="Next track">
            <Text style={styles.controlGlyph}>▶|</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.playerProgress}><View style={[styles.playerProgressFill, { width: isPlaying ? '42%' : '12%' }]} /></View>
        <Text style={styles.playerTime}>{currentSong?.duration || '0:00'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: PALETTE.background },
  scroll: { flex: 1 },
  page: { width: '100%', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28 },
  pageWide: { maxWidth: 1180, alignSelf: 'center', paddingHorizontal: 42, paddingTop: 30, paddingBottom: 36 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 34 },
  brandLine: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  brandMark: { width: 38, height: 38, borderRadius: 13, backgroundColor: '#9B78FF', alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: '#0B0B10', fontSize: 22, fontWeight: '900' },
  brand: { color: PALETTE.text, fontSize: 15, fontWeight: '800', letterSpacing: 1.8 },
  tagline: { color: PALETTE.muted, fontSize: 11, marginTop: 2 },
  profile: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#252334', borderWidth: 1, borderColor: '#3E3955', alignItems: 'center', justifyContent: 'center' },
  profileInitial: { color: '#C6B6FF', fontSize: 13, fontWeight: '700' },
  intro: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 18, marginBottom: 28 },
  introWide: { paddingVertical: 6, marginBottom: 30 },
  introCopy: { flex: 1 },
  eyebrow: { color: PALETTE.blue, fontSize: 10, fontWeight: '700', letterSpacing: 2.1, marginBottom: 10 },
  headline: { color: PALETTE.text, fontSize: 38, lineHeight: 42, fontWeight: '700', letterSpacing: 0 },
  introSub: { color: PALETTE.muted, fontSize: 13, marginTop: 10 },
  mixCard: { width: 172, height: 152, padding: 16, borderRadius: 18, backgroundColor: '#181624', borderWidth: 1, borderColor: '#343047', overflow: 'hidden' },
  mixTopline: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mixLabel: { fontSize: 9, color: '#A59BBF', fontWeight: '700', letterSpacing: 1.5 },
  mixSpark: { color: PALETTE.purple, fontSize: 14 },
  mixNumber: { fontSize: 38, lineHeight: 42, marginTop: 11, color: PALETTE.text, fontWeight: '700' },
  mixFoot: { fontSize: 10, color: PALETTE.muted },
  equalizer: { height: 35, flexDirection: 'row', alignItems: 'flex-end', gap: 3, position: 'absolute', left: 16, right: 16, bottom: 14 },
  equalizerBar: { flex: 1, borderRadius: 4, backgroundColor: PALETTE.purple },
  searchWrap: { height: 48, borderRadius: 13, borderWidth: 1, borderColor: PALETTE.border, backgroundColor: PALETTE.panel, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginBottom: 18 },
  searchIcon: { color: PALETTE.muted, fontSize: 24, marginRight: 10, marginTop: -5 },
  searchInput: { flex: 1, color: PALETTE.text, fontSize: 13, paddingVertical: 0, outlineStyle: 'none' },
  searchHint: { color: '#646475', fontSize: 10, borderWidth: 1, borderColor: '#343440', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 5 },
  filters: { gap: 8, paddingBottom: 25, paddingRight: 16 },
  filterChip: { paddingHorizontal: 15, paddingVertical: 9, borderRadius: 22, backgroundColor: '#14141B', borderWidth: 1, borderColor: '#24242D' },
  filterChipSelected: { backgroundColor: '#30264B', borderColor: '#7053A5' },
  filterText: { color: '#A2A2B1', fontSize: 11, fontWeight: '600' },
  filterTextSelected: { color: '#D5C7FF' },
  contentGrid: { gap: 24 },
  contentGridWide: { flexDirection: 'row', alignItems: 'flex-start', gap: 28 },
  library: { flex: 1, minWidth: 0 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 },
  sectionTitle: { color: PALETTE.text, fontSize: 20, fontWeight: '700' },
  sectionCaption: { color: PALETTE.muted, fontSize: 11, marginTop: 4 },
  sortLabel: { color: '#7F7F90', fontSize: 8, letterSpacing: 1, fontWeight: '700' },
  songList: { borderRadius: 16, backgroundColor: '#111118', borderWidth: 1, borderColor: '#22222D', overflow: 'hidden' },
  listHeader: { height: 37, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#22222D' },
  columnLabel: { color: '#6F6F80', fontSize: 8, fontWeight: '700', letterSpacing: 1.2 },
  trackColumn: { flex: 1 },
  categoryColumn: { width: 118 },
  durationColumn: { width: 44, textAlign: 'right', marginRight: 14 },
  actionColumn: { width: 33 },
  songRow: { minHeight: 68, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#20202A' },
  songRowCurrent: { backgroundColor: '#1B1726' },
  cover: { width: 42, height: 42, borderRadius: 11, borderWidth: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginRight: 12 },
  coverOrb: { position: 'absolute', width: 25, height: 25, borderRadius: 15, opacity: 0.48, right: -4, top: -6 },
  coverNumber: { color: '#EAE6F5', fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  songDetails: { flex: 1, minWidth: 0, paddingRight: 7 },
  songTitle: { color: '#E8E7EF', fontSize: 12, fontWeight: '600' },
  currentText: { color: '#C4ADFF' },
  artist: { color: '#858594', fontSize: 10, marginTop: 5 },
  categoryText: { width: 118, color: '#A2A0B0', fontSize: 10 },
  duration: { width: 44, textAlign: 'right', color: '#858594', fontSize: 10, marginRight: 14 },
  iconButton: { width: 33, height: 36, justifyContent: 'center', alignItems: 'center' },
  heart: { color: '#666675', fontSize: 19 },
  heartActive: { color: '#DC82B5' },
  playButton: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: '#22222D' },
  playButtonCurrent: { backgroundColor: '#8F71DA' },
  playIcon: { color: '#F6F3FF', fontSize: 10 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 42, paddingHorizontal: 18 },
  emptyIcon: { color: PALETTE.purple, fontSize: 30, marginBottom: 9 },
  emptyTitle: { color: PALETTE.text, fontSize: 14, fontWeight: '600' },
  emptyText: { color: PALETTE.muted, fontSize: 11, textAlign: 'center', marginTop: 6 },
  addPanel: { width: 276, padding: 20, borderRadius: 17, backgroundColor: '#14141D', borderWidth: 1, borderColor: '#2A2937' },
  addPanelCompact: { width: '100%' },
  addHeadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  addEyebrow: { color: '#9C8BC5', fontSize: 8, fontWeight: '700', letterSpacing: 1.5 },
  addTitle: { color: PALETTE.text, fontSize: 19, fontWeight: '700', marginTop: 5 },
  addPlus: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#2B2440', alignItems: 'center', justifyContent: 'center' },
  addPlusText: { color: '#C3ACFF', fontSize: 21, lineHeight: 25 },
  fieldLabel: { color: '#797989', fontSize: 8, fontWeight: '700', letterSpacing: 1.3, marginBottom: 7, marginTop: 12 },
  field: { height: 40, paddingHorizontal: 12, color: PALETTE.text, fontSize: 11, backgroundColor: '#0E0E15', borderWidth: 1, borderColor: '#292936', borderRadius: 9, outlineStyle: 'none' },
  categoryChoices: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  categoryChoice: { borderRadius: 8, paddingHorizontal: 9, paddingVertical: 7, backgroundColor: '#1C1C26', borderWidth: 1, borderColor: '#292936' },
  categoryChoiceSelected: { backgroundColor: '#30264B', borderColor: '#7053A5' },
  categoryChoiceText: { color: '#A09FAC', fontSize: 9, fontWeight: '600' },
  categoryChoiceTextSelected: { color: '#D5C7FF' },
  addButton: { height: 41, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#8D70D4', marginTop: 19 },
  addButtonMuted: { backgroundColor: '#655586' },
  addButtonText: { color: '#FBF9FF', fontSize: 11, fontWeight: '700' },
  addButtonArrow: { fontSize: 13 },
  addNote: { color: '#737282', fontSize: 9, textAlign: 'center', marginTop: 12 },
  footerSpace: { height: 10 },
  playerDock: { minHeight: 70, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#15141D', borderTopWidth: 1, borderTopColor: '#302B40', gap: 11 },
  playerArtwork: { width: 42, height: 42, borderRadius: 11, backgroundColor: '#302644', alignItems: 'center', justifyContent: 'center' },
  playerArtworkText: { color: '#C6AFFF', fontSize: 22 },
  playerSong: { flex: 1, minWidth: 0 },
  playerTitle: { color: PALETTE.text, fontSize: 11, fontWeight: '700' },
  playerArtist: { color: PALETTE.muted, fontSize: 9, marginTop: 4 },
  playerControls: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  playerControl: { width: 26, height: 32, alignItems: 'center', justifyContent: 'center' },
  controlGlyph: { color: '#B1AFBE', fontSize: 11 },
  playerPlay: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#9274D8' },
  playerPlayGlyph: { color: '#FFF', fontSize: 11 },
  playerProgress: { width: 90, height: 3, borderRadius: 2, backgroundColor: '#393644', overflow: 'hidden', marginLeft: 3 },
  playerProgressFill: { height: '100%', borderRadius: 2, backgroundColor: '#A88BFF' },
  playerTime: { color: '#858392', fontSize: 9, width: 28, textAlign: 'right' },
});