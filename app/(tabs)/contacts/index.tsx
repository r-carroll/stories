import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Image, useColorScheme, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { CirclePlus as PlusCircle, Search, UserPlus } from 'lucide-react-native';
import { getAllContacts } from '@/utils/contactsManager';
import { Contact } from '@/types';
import * as Contacts from 'expo-contacts';

export default function ContactsScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    checkPermissions();
    loadContacts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [contacts, searchQuery]);

  const checkPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await Contacts.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    } else {
      setHasPermission(true); // Web doesn't need permissions
    }
  };

  const loadContacts = async () => {
    const loadedContacts = await getAllContacts();
    setContacts(loadedContacts);
    setFilteredContacts(loadedContacts);
  };

  const navigateToContact = (contactId: string) => {
    router.push(`/(tabs)/contacts/${contactId}`);
  };

  const navigateToImport = async () => {
    if (Platform.OS === 'web') {
      // Show web-specific import UI
      router.push('/(tabs)/contacts/import');
      return;
    }

    if (!hasPermission) {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        // Show permission denied message
        return;
      }
      setHasPermission(true);
    }

    router.push('/(tabs)/contacts/import');
  };

  const renderContactItem = ({ item, index }: { item: Contact; index: number }) => (
    <Animated.View entering={FadeInDown.delay(100 + index * 50).springify()}>
      <Pressable 
        style={[styles.contactItem, isDark && styles.contactItemDark]}
        onPress={() => navigateToContact(item.id)}
      >
        <Image 
          source={{ uri: item.photoUri || 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg' }} 
          style={styles.contactImage} 
        />
        <View style={styles.contactInfo}>
          <Text style={[styles.contactName, isDark && styles.contactNameDark]}>{item.name}</Text>
          {item.journalCount > 0 && (
            <Text style={[styles.journalCount, isDark && styles.journalCountDark]}>
              {item.journalCount} {item.journalCount === 1 ? 'story' : 'stories'}
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );

  return (
    <View style={[styles.container, isDark && styles.containerDark, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.titleDark]}>Contacts</Text>
        <Pressable 
          style={[styles.addButton, isDark && styles.addButtonDark]} 
          onPress={navigateToImport}
        >
          <UserPlus size={24} color="#007AFF" />
        </Pressable>
      </View>
      
      <Animated.View style={[styles.searchContainer, isDark && styles.searchContainerDark]} entering={FadeIn.delay(100)}>
        <Search size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, isDark && styles.searchInputDark]}
          placeholder="Search contacts"
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Animated.View>
      
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContactItem}
        contentContainerStyle={styles.contactsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, isDark && styles.emptyTextDark]}>No contacts found</Text>
            <Pressable 
              style={[styles.importButton, isDark && styles.importButtonDark]} 
              onPress={navigateToImport}
            >
              <PlusCircle size={20} color="#FFFFFF" />
              <Text style={styles.importButtonText}>Import Contacts</Text>
            </Pressable>
          </View>
        }
      />
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  addButtonDark: {
    backgroundColor: '#1C1C1E',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBEBEB',
    borderRadius: 10,
    marginHorizontal: 16,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  searchContainerDark: {
    backgroundColor: '#1C1C1E',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1C1C1E',
  },
  searchInputDark: {
    color: '#FFFFFF',
  },
  contactsList: {
    paddingHorizontal: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  contactItemDark: {
    backgroundColor: '#1C1C1E',
    shadowOpacity: 0.2,
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E5EA',
  },
  contactInfo: {
    marginLeft: 12,
    flex: 1,
  },
  contactName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1C1C1E',
  },
  contactNameDark: {
    color: '#FFFFFF',
  },
  journalCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  journalCountDark: {
    color: '#8E8E93',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 16,
  },
  emptyTextDark: {
    color: '#8E8E93',
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  importButtonDark: {
    backgroundColor: '#0A84FF',
  },
  importButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});