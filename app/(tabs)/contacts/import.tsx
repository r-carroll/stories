import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Image } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { ArrowLeft, Check, Search, UserPlus } from 'lucide-react-native';
import { importContacts } from '@/utils/contactsManager';

// Mock data for sample contacts that could be imported
const SAMPLE_CONTACTS = [
  { id: '101', name: 'Emma Thompson', phone: '+1 (555) 123-4567', photoUri: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg' },
  { id: '102', name: 'Michael Chen', phone: '+1 (555) 987-6543', photoUri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' },
  { id: '103', name: 'Sophia Martinez', phone: '+1 (555) 456-7890', photoUri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' },
  { id: '104', name: 'James Wilson', phone: '+1 (555) 234-5678', photoUri: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg' },
  { id: '105', name: 'Olivia Johnson', phone: '+1 (555) 876-5432', photoUri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg' },
];

export default function ImportContactsScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<{ [id: string]: boolean }>({});
  const [importing, setImporting] = useState(false);

  const filteredContacts = searchQuery.trim() === ''
    ? SAMPLE_CONTACTS
    : SAMPLE_CONTACTS.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery)
      );

  const toggleContactSelection = (id: string) => {
    setSelectedContacts(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleImport = async () => {
    const contactsToImport = SAMPLE_CONTACTS.filter(contact => selectedContacts[contact.id]);
    
    if (contactsToImport.length === 0) return;
    
    setImporting(true);
    
    try {
      await importContacts(contactsToImport);
      router.push('/(tabs)/contacts');
    } catch (error) {
      console.error('Failed to import contacts:', error);
    } finally {
      setImporting(false);
    }
  };

  const navigateBack = () => {
    router.back();
  };

  const selectedCount = Object.values(selectedContacts).filter(Boolean).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={navigateBack}>
          <ArrowLeft size={24} color="#007AFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Import Contacts</Text>
        <Pressable 
          style={[styles.importButton, selectedCount === 0 && styles.importButtonDisabled]} 
          onPress={handleImport}
          disabled={selectedCount === 0 || importing}
        >
          <Check size={20} color={selectedCount === 0 ? "#8E8E93" : "#FFFFFF"} />
        </Pressable>
      </View>
      
      <Animated.View style={styles.searchContainer} entering={FadeIn.delay(100)}>
        <Search size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts"
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Animated.View>
      
      {selectedCount > 0 && (
        <Animated.View style={styles.selectionBar} entering={FadeIn}>
          <Text style={styles.selectionText}>
            {selectedCount} {selectedCount === 1 ? 'contact' : 'contacts'} selected
          </Text>
        </Animated.View>
      )}
      
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(150 + index * 50).springify()}>
            <Pressable 
              style={styles.contactItem}
              onPress={() => toggleContactSelection(item.id)}
            >
              <Image 
                source={{ uri: item.photoUri }} 
                style={styles.contactImage} 
              />
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactPhone}>{item.phone}</Text>
              </View>
              <View 
                style={[
                  styles.checkbox, 
                  selectedContacts[item.id] && styles.checkboxSelected
                ]}
              >
                {selectedContacts[item.id] && (
                  <Check size={16} color="#FFFFFF" />
                )}
              </View>
            </Pressable>
          </Animated.View>
        )}
        contentContainerStyle={styles.contactsList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No contacts found</Text>
          </View>
        }
      />
      
      <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
        <Pressable 
          style={[
            styles.importAllButton,
            selectedCount === SAMPLE_CONTACTS.length && styles.importAllButtonDisabled
          ]}
          onPress={() => {
            const allSelected = selectedCount === SAMPLE_CONTACTS.length;
            if (allSelected) {
              // Deselect all
              setSelectedContacts({});
            } else {
              // Select all
              const newSelection: { [id: string]: boolean } = {};
              SAMPLE_CONTACTS.forEach(contact => {
                newSelection[contact.id] = true;
              });
              setSelectedContacts(newSelection);
            }
          }}
          disabled={importing}
        >
          <UserPlus size={20} color="#007AFF" />
          <Text style={styles.importAllText}>
            {selectedCount === SAMPLE_CONTACTS.length ? 'Deselect All' : 'Select All'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#000000',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  importButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  importButtonDisabled: {
    backgroundColor: '#E5E5EA',
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
  selectionBar: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  selectionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#007AFF',
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
  contactPhone: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
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
  },
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
  },
  importAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  importAllButtonDisabled: {
    borderColor: '#8E8E93',
  },
  importAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
  },
});