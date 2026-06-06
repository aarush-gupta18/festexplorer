import React, { useState, useEffect } from 'react';
import {fetchEvents} from './api.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text, ScrollView, StyleSheet, SafeAreaView, Pressable, Alert} from 'react-native';
import styles from './designing.js';
export default function App() {
  const [events, setEvents] = useState([]);
  const [saved, setSaved] = useState([]);
  const [tab, setTab] = useState('events');
  useEffect(() => {
    fetchEvents().then(data => setEvents(data));
  }, []);
  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem('saved_events');
      if (stored !== null) setSaved(JSON.parse(stored));
    };
    load();
  }, []);
  useEffect(() => {
    const save = async () => {
      await AsyncStorage.setItem('saved_events', JSON.stringify(saved));
    };  
    save();
  }, [saved]);
 const handlePress = (id) => {
    if (tab === 'events') {
      setSaved(prev => [...prev, id]);
      Alert.alert('Event Saved');
    } else {
      let newSaved = [];
      for (let i = 0; i < saved.length; i++) {
        if (saved[i] !== id) {
          newSaved.push(saved[i]);
        }
      }
      setSaved(newSaved);
      Alert.alert('Event removed from lineup');
    }
  };
  let VisibleEvents = [];
  if (tab === 'events') {
    for (let i = 0; i < events.length; i++) {
      if (!saved.includes(events[i].id)) {
        VisibleEvents.push(events[i]);
      }
    }
  } else {
    for (let i = 0; i < events.length; i++) {
      if (saved.includes(events[i].id)) {
        VisibleEvents.push(events[i]);
      }
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>FestExplorer</Text>
      <ScrollView contentContainerStyle={styles.display}>
        {VisibleEvents.map((event) => (
          <Pressable
            key={event.id}
            style={({pressed}) => [styles.box, pressed && {opacity: 0.7}]}
            onPress={() => handlePress(event.id)}>
            <Text style={styles.text}>{event.name}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.tablayout}>
        <Pressable
          style={[styles.tab, tab === 'events' && styles.currenttab]}
          onPress={() => setTab('events')}>
          <Text style={[styles.tabtext, tab === 'events']}>Events</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, tab === 'lineup' && styles.currenttab]}
          onPress={() => setTab('lineup')}>
          <Text style={[styles.tabtext, tab === 'lineup']}>My Lineup {`(${saved.length})`}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );}