import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchevents } from './api.js';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const colorlist = {};
const randomcolor = () => {
  const chars = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) color += chars[Math.floor(Math.random() * 16)];
  return color;
};
function assigncolor(cat) {
  const key = String(cat);
  if (!colorlist[key]) colorlist[key] = randomcolor();
  return colorlist[key];
}
const lineupidentity = 'mylineup';
function EventCard({ event, isSaved, savepressed }) {
  const categorycolor = assigncolor(event.category);
  return (
    <View style={[style.card, { borderLeftColor: categorycolor, borderLeftWidth: 5 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
      <View style={[style.categorydesign, { backgroundColor: categorycolor }]}>
      <Text style={style.categorydesigntext}>{event.category}</Text>
    </View>
  <Pressable onPress={() => savepressed(event.id)}>
  <Ionicons
    name={isSaved ? 'bookmark' : 'bookmark-outline'}
    size={24}
    color={isSaved ? '#111' : '#888'}
  />
</Pressable>
</View>
<Text style={style.cardtitle}>{event.name}</Text>
<View style={style.cardRow}>
  <Text style={{ fontSize: 12, color: '#888' }}>📅 Day {event.day}</Text>
  <Text style={{ fontSize: 12, color: '#888' }}>🕐 {event.time}</Text>
  <Text style={{ fontSize: 12, color: '#888' }}>📍 {event.venue}</Text>
  <Text style={{ fontSize: 12, color: '#888' }}>👥 {event.registrations}</Text>
</View>
    </View>
  );}
export default function App() {
  const [allevents, setAllevents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [sort, setSort] = useState('day');
  const [lineup, setLineup] = useState([]);
  const [tab, settab] = useState('events');
  const [showCatDrop, setShowCatDrop] = useState(false);
  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchevents();
      const unique = ['All',...new Set(data.map(e => e.category).filter(Boolean))];
      setCategories(unique);
      setAllevents(data);
    };
    loadEvents();
  }, []);
  useEffect(() => {
    const loadLineup = async () => {
      const stored = await AsyncStorage.getItem(lineupidentity);
      if (stored !== null) setLineup(JSON.parse(stored));
    };
    loadLineup();
  }, []);
  useEffect(() => {
    const saveLineup = async () => {
      await AsyncStorage.setItem(lineupidentity, JSON.stringify(lineup));
    };
    saveLineup();
  }, [lineup]);
  const presssave = (id) => {
    setLineup(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const filteredEvents = allevents
    .filter(event => {
      const matchesCategory = category === 'All' || event.category === category;
      const matchesSearch =
        search.trim() === '' || event.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sort === 'day') return a.day - b.day;
      if (sort === 'registrations') return b.registrations - a.registrations;
    });
  const lineupEvents = allevents.filter(e => lineup.includes(e.id));
  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 40, backgroundColor: '#F5F5F5' }}>
      
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {tab === 'events' ? (
          <View>
            <View style={{ marginBottom: 16 }}>
              <Text style={style.headertitle}>FestExplorer</Text>
            </View>
            <View style={style.statsRow}>
              <View style={style.statBox}>
                <Text style={style.statNumber}>{filteredEvents.length}</Text>
                <Text style={{ fontSize: 11, color: '#888' }}>Events</Text>
              </View>
              <View style={style.statBox}>
                <Text style={[style.statNumber, { color: 'black' }]}>Music</Text>
                <Text style={{ fontSize: 11, color: '#888' }}>Top Category</Text>
              </View>
              <View style={style.statBox}>
                <Text style={style.statNumber}>{lineup.length}</Text>
                <Text style={{ fontSize: 11, color: '#888' }}>Saved</Text>
              </View>
            </View>
            <TextInput
              style={style.searchInput}
              placeholder="Search events…"
              placeholderTextColor="#999"
              value={search}
              onChangeText={setSearch}
            />
            <View style={style.sortRow}>
              <Text style={{ fontSize: 11, color: '#666' }}>Sort:</Text>
              <Pressable
                style={[style.sortbutton, sort === 'day' && style.sortbuttonActive]}
                onPress={() => setSort('day')}>
                <Text style={[{ fontSize: 12, color: '#666' }, sort === 'day' && { color: 'white', fontWeight: '700' }]}>Day</Text>
              </Pressable>
              <Pressable
                style={[style.sortbutton, sort === 'registrations' && style.sortbuttonActive]}
                onPress={() => setSort('registrations')}>
                <Text style={[{ fontSize: 12, color: '#666' }, sort === 'registrations' && { color: 'white', fontWeight: '700' }]}>Regs</Text>
              </Pressable>
              <Pressable
                style={[style.sortbutton, { marginLeft: 'auto' }, category !== 'All' && style.sortbuttonActive]}
                onPress={() => setShowCatDrop(prev => !prev)}>
                <Text style={[{ fontSize: 12, color: '#666' }, category !== 'All' && { color: 'white', fontWeight: '700' }]}>
                  {category === 'All' ? 'Category ' : `${category} `}
                </Text>
              </Pressable>
            </View>
            {showCatDrop && (
              <View style={style.dropdown}>
                {categories.map(cat => (
                  <Pressable
                    key={cat}
                    style={[style.dropdownItem, category === cat && { backgroundColor: '#F0F4FF' }]}
                    onPress={() => { setCategory(cat); setShowCatDrop(false); }}>
                    <Text style={[{ fontSize: 14, color: '#333' }, category === cat && { color: 'black', fontWeight: '700' }]}>
                      {cat === 'All' ? 'All Categories' : cat}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
            {filteredEvents.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={style.noevents}>No events found</Text>
              </View>
            ) : (
              filteredEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  isSaved={lineup.includes(event.id)}
                  savepressed={presssave}
                />
              ))
            )}
          </View>
        ) : (
          <View>
            <View style={{ marginBottom: 16 }}>
              <Text style={style.headertitle}>My Lineup</Text>
            </View>
            {lineupEvents.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Text style={style.nosave}>No events saved yet. Tap Save on any event!</Text>
              </View>
            ) : (
              lineupEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  isSaved={true}
                  savepressed={presssave}
                />
              ))
            )}
          </View>
        )}
      </ScrollView>
      <View style={style.tabBar}>
        <Pressable
          style={[style.tab, tab === 'events' && style.activetab]}
          onPress={() => settab('events')}>
          <Text style={[style.tabtext, tab === 'events' && {color: 'black'}]}>Events</Text>
        </Pressable>
        <Pressable
          style={[style.tab, tab === 'lineup' && style.activetab]}
          onPress={() => settab('lineup')}>
          <Text style={[style.tabtext, tab === 'lineup' && {color: 'black'}]}>My Lineup</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );}
const style = StyleSheet.create({
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E8E8E8',paddingBottom:25 },
  tab: { flex: 1, paddingVertical: 13, alignItems: 'center' },
  activetab: { borderBottomWidth: 2, borderBottomColor: '#111' },
  tabtext: { fontSize: 14, color: '#888', fontWeight: '600' },
  headertitle: { fontSize: 28, fontWeight: '800', color: '#111' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statBox: { flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, marginRight: 8, alignItems: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
  statNumber: { fontSize: 18, fontWeight: '800', color: '#111' },
  searchInput: { backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#111', marginBottom: 12, borderWidth: 1.5, borderColor: '#E8E8E8', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  sortRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 8 },
  sortbutton: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: '#fff' },
  sortbuttonActive: { backgroundColor: '#111', borderColor: '#111' },
  dropdown: { backgroundColor: '#fff', borderRadius: 14, marginBottom: 12, elevation: 8, borderWidth: 1, borderColor: '#F0F0F0', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  dropdownItem: { paddingHorizontal: 16, paddingVertical: 13, borderRadius: 10 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.09, shadowRadius: 8 },
  categorydesign: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginBottom: 10 },
  categorydesigntext: { color: 'white', fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.8 },
  cardtitle: { fontSize: 17, color: '#111', fontWeight: '800', marginBottom: 10, lineHeight: 23,marginTop: -15 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 4 },
  nosave: { textAlign: 'center', color: '#999', fontSize: 14, paddingVertical: 20 },
  noevents: { fontSize: 16, color: '#999', fontWeight: '700', marginTop: 12 },
});