import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Bell } from 'lucide-react-native';
import { getRecentContacts } from '@/utils/contactsManager';
import { Contact } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const systemColorScheme = useColorScheme();
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [recentEntries, setRecentEntries] = useState<any[]>([]);
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('darkMode');
      setIsDark(storedTheme === 'dark');
    };
    loadTheme();

    // Load recent contacts
    const loadRecents = async () => {
      const contacts = await getRecentContacts(5);
      setRecentContacts(contacts);
      
      setRecentEntries([
        { id: '1', contactId: '1', title: 'Coffee meetup', date: new Date(2025, 2, 15), preview: 'Met for coffee at Starbucks and discussed...' },
        { id: '2', contactId: '2', title: 'Birthday dinner', date: new Date(2025, 2, 10), preview: 'Celebrated their birthday at...' },
      ]);
    };
    
    loadRecents();
  }, []);

  const navigateToContact = (contactId: string) => {
    router.push(`/(tabs)/contacts/${contactId}`);
  };

  const navigateToEntry = (contactId: string, entryId: string) => {
    router.push(`/(tabs)/contacts/${contactId}/${entryId}`);
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.titleDark]}>Journal</Text>
        <Pressable style={[styles.notificationButton, isDark && styles.notificationButtonDark]}>
          <Bell size={24} color="#007AFF" />
        </Pressable>
      </View>
      
      <Animated.View entering={FadeInDown.delay(100).springify()}>
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Recent Contacts</Text>
        <FlatList
          horizontal
          data={recentContacts}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentContactsList}
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <Text style={[styles.emptyStateText, isDark && styles.emptyStateTextDark]}>No recent contacts</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(150 + index * 50).springify()}>
              <Pressable 
                style={styles.contactItem}
                onPress={() => navigateToContact(item.id)}
              >
                <Image 
                  source={{ uri: item.photoUri || 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg' }} 
                  style={styles.contactImage} 
                />
                <Text style={[styles.contactName, isDark && styles.contactNameDark]} numberOfLines={1}>
                  {item.name}
                </Text>
              </Pressable>
            </Animated.View>
          )}
        />
      </Animated.View>

      <Animated.View style={styles.entriesContainer} entering={FadeInDown.delay(200).springify()}>
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Recent Stories</Text>
        <FlatList
          data={recentEntries}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.entriesList}
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <Text style={[styles.emptyStateText, isDark && styles.emptyStateTextDark]}>No recent stories</Text>
              <Text style={[styles.emptyStateSubtext, isDark && styles.emptyStateSubtextDark]}>
                Add a contact and write your first journal entry
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(250 + index * 50).springify()}>
              <Pressable 
                style={[styles.entryItem, isDark && styles.entryItemDark]}
                onPress={() => navigateToEntry(item.contactId, item.id)}
              >
                <View style={styles.entryHeader}>
                  <Text style={[styles.entryTitle, isDark && styles.entryTitleDark]}>{item.title}</Text>
                  <Text style={[styles.entryDate, isDark && styles.entryDateDark]}>
                    {item.date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </Text>
                </View>
                <Text style={[styles.entryPreview, isDark && styles.entryPreviewDark]} numberOfLines={2}>
                  {item.preview}
                </Text>
              </Pressable>
            </Animated.View>
          )}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  containerDark: {
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#000000',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  notificationButtonDark: {
    backgroundColor: '#1C1C1E',
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    color: '#1C1C1E',
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  recentContactsList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  contactItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  contactImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E5EA',
    marginBottom: 4,
  },
  contactName: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#1C1C1E',
    textAlign: 'center',
    width: 70,
  },
  contactNameDark: {
    color: '#FFFFFF',
  },
  entriesContainer: {
    flex: 1,
  },
  entriesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  entryItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  entryItemDark: {
    backgroundColor: '#1C1C1E',
    shadowColor: '#000',
    shadowOpacity: 0.2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1C1C1E',
  },
  entryTitleDark: {
    color: '#FFFFFF',
  },
  entryDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
  },
  entryDateDark: {
    color: '#8E8E93',
  },
  entryPreview: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#636366',
    lineHeight: 20,
  },
  entryPreviewDark: {
    color: '#8E8E93',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  emptyStateTextDark: {
    color: '#8E8E93',
  },
  emptyStateSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
  },
  emptyStateSubtextDark: {
    color: '#8E8E93',
  },
});