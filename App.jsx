import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchevents, searchevents } from './api.js';
import {View, Text, TextInput, ScrollView,Pressable, StyleSheet, SafeAreaView} from 'react-native';
const colorlist = {};
const randomcolor = () => {
  const chars = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += chars[Math.floor(Math.random() * 16)];}
  return color;};
function assigncolor(cat) {
  const key = String(cat);
  if (!colorlist[key]) {
    colorlist[key] = randomcolor();}
  return colorlist[key];}
const lineupidentity = 'festexplorer_lineup';
function EventCard({ event, isSaved, savepressed }) {
  const catcolor = assigncolor(event.category);
  return (
    <View style={style.card}>
      <View style={[style.categorydesign, { backgroundColor: catcolor }]}>
        <Text style={style.categorydesigntext}>{event.category}</Text>
      </View>
      <Text style={style.cardtitle}>{event.name}</Text>
      <View style={style.cardRow}>
        <Text style={{ fontSize: 13, color: '#666' }}>📅 Day {event.day}</Text>
        <Text style={{ fontSize: 13, color: '#666' }}>🕐 {event.time}</Text>
        <Text style={{ fontSize: 13, color: '#666' }}>📍 {event.venue}</Text>
        <Text style={{ fontSize: 13, color: '#666' }}>👥 {event.registrations}</Text>
      </View>
      <Pressable style={[style.savebutton, isSaved && { backgroundColor: 'black'}]} onPress={() => savepressed(event.id)}>
        <Text style={[style.savebuttonText, isSaved && {color: 'white'}]}>
          {isSaved ? 'Saved' : 'Save'}
        </Text></Pressable></View>);}
export default function App() {
  const [allevents, setAllevents]= useState([]);
  const [search, setSearch]= useState('');
  const [category, setCategory]= useState('All');
  const [categories, setCategories]= useState(['All']);
  const [sort, setSort]= useState('day');
  const [lineup, setLineup]= useState([]);
  const [showLineup, setShowLineup]= useState(false);
  const [showCatDrop, setShowCatDrop]= useState(false);
  useEffect(() => {
    const loadEvents = async () => {
      const data = await fetchevents();
        const unique = ['All', ...new Set(data.map(e => e.category).filter(Boolean))];            
        setCategories(unique);
      setAllevents(data);};
    loadEvents();}, []);
  useEffect(() => {
    const loadLineup = async () => {
      const stored = await AsyncStorage.getItem(lineupidentity);
      if (stored !== null) setLineup(JSON.parse(stored));};
    loadLineup();}, []);
  useEffect(() => {
    const saveLineup = async () => {
      await AsyncStorage.setItem(lineupidentity, JSON.stringify(lineup));};
    saveLineup();}, [lineup]);
  const presssave = (id) => {
    setLineup(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);};
  const filteredEvents = allevents
    .filter(event => {
      const matchesCategory = category === 'All' || event.category === category;
      const matchesSearch =
        search.trim() === '' ||
        event.name.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch;})
    .sort((a, b) => {
      if (sort === 'day') return a.day - b.day;
      if (sort === 'registrations') return b.registrations - a.registrations;
      return 0;});
  const lineupEvents = allevents.filter(e => lineup.includes(e.id));
  return (
    <SafeAreaView style={{paddingTop: 40, backgroundColor: '#F5F5F5'}}>
      <ScrollView contentContainerStyle={{padding: 16, paddingBottom: 40}}>
        <View style={{marginBottom: 16}}>
          <Text style={style.headertitle}>FestExplorer</Text>
        </View>
        <View style={style.statsRow}>
          <View style={style.statBox}>
            <Text style={style.statNumber}>{filteredEvents.length}</Text>
            <Text style={{ fontSize: 11, color: '#888'}}>Events</Text>
          </View>
          <View style={style.statBox}>
            <Text style={[style.statNumber, { color: 'black' }]}>Music</Text>
            <Text style={{ fontSize: 11, color: '#888'}}>Top Category</Text>
          </View>
          <View style={style.statBox}>
            <Text style={style.statNumber}>{lineup.length}</Text>
            <Text style={{ fontSize: 11, color: '#888'}}>Saved</Text>
          </View></View>
        <TextInput
          style={style.searchInput}
          placeholder="Search events…"
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}/>
        <View style={style.sortRow}>
          <Text style={{fontSize: 11, color: '#666'}}>Sort:</Text>
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
            </Text></Pressable>
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
              </Pressable>))}
          </View>)}
        {filteredEvents.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 40 }}>
            <Text style={style.emptyText}>No events found</Text>
          </View>
        ) : (
          filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              isSaved={lineup.includes(event.id)}
              savepressed={presssave}
            />)))}
        <Pressable style={style.lineupToggle} onPress={() => setShowLineup(prev => !prev)}>
          <Text style={style.lineupToggleText}>My Lineup ({lineup.length})</Text></Pressable>
        {showLineup && (
          <View style={{marginTop: 12}}>
            {lineupEvents.length === 0 ? (
              <Text style={style.lineupEmpty}>No events saved yet. Tap Save on any event!</Text>
            ) : (
              lineupEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  isSaved={true}
                  savepressed={presssave}
                />)))}</View>)}</ScrollView></SafeAreaView>);}
const style = StyleSheet.create({
  headertitle: { fontSize: 28, fontWeight: '700', color: 'black' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statBox: { flex: 1, backgroundColor: 'white', borderRadius: 10, padding: 12, marginRight: 8, alignItems: 'center', elevation: 2 },
  statNumber: { fontSize: 18, fontWeight: '700', color: 'black' },
  searchInput: { backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: 'black', marginBottom: 12, borderWidth: 2, borderColor: '#E0E0E0' },
  sortRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 8 },
  sortbutton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#CCC', backgroundColor: 'white' },
  sortbuttonActive: { backgroundColor: 'black', borderColor: '#1A1A2E' },
  dropdown: { backgroundColor: 'white', borderRadius: 10, marginBottom: 12, elevation: 4, borderWidth: 1, borderColor: '#E0E0E0' },
  dropdownItem: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 8 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 14, marginBottom: 12, elevation: 3 },
  categorydesign: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, marginBottom: 8 },
  categorydesigntext: { color: 'white', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  cardtitle: { fontSize: 17, color: 'black', fontWeight: '700', marginBottom: 8 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  savebutton: { marginTop: 10, alignSelf: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#CCC' },
  savebuttonText: { fontSize: 13, color: '#666', fontWeight: '700' },
  lineupToggle: { backgroundColor: 'black', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 8 },
  lineupToggleText: { color: 'white', fontWeight: '700', fontSize: 15 },
  lineupEmpty: { textAlign: 'center', color: '#999', fontSize: 14, paddingVertical: 20 },
  emptyText: { fontSize: 16, color: '#999', fontWeight: '700', marginTop: 12 },
});