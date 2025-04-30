import { Contact } from '@/types';
import * as ExpoContacts from 'expo-contacts';
import { Platform } from 'react-native';

// Mock data for demo purposes - in a real app, this would use AsyncStorage or a database
let CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Emma Thompson',
    phone: '+1 (555) 123-4567',
    email: 'emma@example.com',
    photoUri: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
    journalCount: 3,
    lastInteraction: '2025-03-10T14:30:00Z',
  },
  {
    id: '2',
    name: 'Michael Chen',
    phone: '+1 (555) 987-6543',
    email: 'michael@example.com',
    photoUri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    journalCount: 1,
    lastInteraction: '2025-03-08T09:15:00Z',
  },
];

// Get all contacts
export const getAllContacts = async (): Promise<Contact[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...CONTACTS];
};

// Get a contact by ID
export const getContactById = async (id: string): Promise<Contact | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  return CONTACTS.find(contact => contact.id === id) || null;
};

// Get recent contacts
export const getRecentContacts = async (limit: number = 5): Promise<Contact[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Sort by last interaction and return the most recent ones
  return [...CONTACTS]
    .sort((a, b) => {
      if (!a.lastInteraction) return 1;
      if (!b.lastInteraction) return -1;
      return new Date(b.lastInteraction).getTime() - new Date(a.lastInteraction).getTime();
    })
    .slice(0, limit);
};

// Import contacts from device
export const importSystemContacts = async (): Promise<ExpoContacts.Contact[]> => {
  if (Platform.OS === 'web') {
    throw new Error('Contact import not supported on web');
  }

  const { status } = await ExpoContacts.requestPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access contacts was denied');
  }

  const { data } = await ExpoContacts.getContactsAsync({
    fields: [
      ExpoContacts.Fields.Name,
      ExpoContacts.Fields.PhoneNumbers,
      ExpoContacts.Fields.Emails,
      ExpoContacts.Fields.Image,
    ],
  });

  return data;
};

// Import contacts
export const importContacts = async (newContacts: Partial<Contact>[]): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Add new contacts with generated IDs
  const contactsToAdd = newContacts.map(contact => ({
    id: Math.random().toString(36).substring(2, 11),
    name: contact.name || 'Unknown',
    phone: contact.phone,
    email: contact.email,
    photoUri: contact.photoUri,
    journalCount: 0,
    lastInteraction: new Date().toISOString(),
  }));
  
  CONTACTS = [...CONTACTS, ...contactsToAdd];
};

// Update contact journal count
export const updateContactJournalCount = async (contactId: string, count: number): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  CONTACTS = CONTACTS.map(contact => {
    if (contact.id === contactId) {
      return {
        ...contact,
        journalCount: count,
        lastInteraction: new Date().toISOString(),
      };
    }
    return contact;
  });
};