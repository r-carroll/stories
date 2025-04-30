import { JournalEntry } from '@/types';
import { updateContactJournalCount } from './contactsManager';

// Mock data for demo purposes - in a real app, this would use AsyncStorage or a database
let JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    contactId: '1',
    title: 'Coffee Meetup',
    content: 'Met Emma for coffee at Starbucks. We discussed her upcoming project and caught up on life. She mentioned she\'s planning a trip to Europe next month. I should follow up with her before she leaves.',
    date: '2025-03-10T14:30:00Z',
    hasMedia: true,
    media: ['https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg'],
    archived: false,
  },
  {
    id: '2',
    contactId: '1',
    title: 'Birthday Dinner',
    content: 'Celebrated Emma\'s birthday at The Italian Restaurant. She loved the gift I got her - a book on photography she\'s been wanting. She was really surprised and happy.',
    date: '2025-02-15T18:30:00Z',
    hasMedia: false,
    archived: false,
  },
  {
    id: '3',
    contactId: '1',
    title: 'Phone Call About Project',
    content: 'Had a long call with Emma about the upcoming marketing campaign. She had some great ideas about the social media strategy. We decided to meet next week to finalize the details.',
    date: '2025-01-20T10:15:00Z',
    hasMedia: false,
    archived: false,
  },
  {
    id: '4',
    contactId: '2',
    title: 'Lunch Meeting',
    content: 'Had lunch with Michael at the new Thai place. He talked about his new job and seems really happy there. He mentioned he might be looking for freelancers for some design work.',
    date: '2025-03-08T12:30:00Z',
    hasMedia: true,
    media: ['https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'],
    archived: false,
  },
];

// Get all journal entries for a contact
export const getJournalEntriesForContact = async (contactId: string): Promise<JournalEntry[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return JOURNAL_ENTRIES
    .filter(entry => entry.contactId === contactId && !entry.archived)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get archived entries for a contact
export const getArchivedEntriesForContact = async (contactId: string): Promise<JournalEntry[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return JOURNAL_ENTRIES
    .filter(entry => entry.contactId === contactId && entry.archived)
    .sort((a, b) => new Date(b.archivedAt || b.date).getTime() - new Date(a.archivedAt || a.date).getTime());
};

// Get a journal entry by ID
export const getJournalEntryById = async (entryId: string): Promise<JournalEntry | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return JOURNAL_ENTRIES.find(entry => entry.id === entryId) || null;
};

// Add a new journal entry
export const addJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'archived' | 'archivedAt'>): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newId = Math.random().toString(36).substring(2, 11);
  
  const newEntry: JournalEntry = {
    id: newId,
    ...entry,
    archived: false,
  };
  
  JOURNAL_ENTRIES = [newEntry, ...JOURNAL_ENTRIES];
  
  // Update the contact's journal count
  const contactEntries = JOURNAL_ENTRIES.filter(e => e.contactId === entry.contactId && !e.archived);
  await updateContactJournalCount(entry.contactId, contactEntries.length);
  
  return newId;
};

// Archive a journal entry
export const archiveJournalEntry = async (entryId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const entryToArchive = JOURNAL_ENTRIES.find(entry => entry.id === entryId);
  
  if (entryToArchive) {
    JOURNAL_ENTRIES = JOURNAL_ENTRIES.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          archived: true,
          archivedAt: new Date().toISOString(),
        };
      }
      return entry;
    });
    
    // Update the contact's journal count
    const contactEntries = JOURNAL_ENTRIES.filter(e => e.contactId === entryToArchive.contactId && !e.archived);
    await updateContactJournalCount(entryToArchive.contactId, contactEntries.length);
  }
};

// Unarchive a journal entry
export const unarchiveJournalEntry = async (entryId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const entryToUnarchive = JOURNAL_ENTRIES.find(entry => entry.id === entryId);
  
  if (entryToUnarchive) {
    JOURNAL_ENTRIES = JOURNAL_ENTRIES.map(entry => {
      if (entry.id === entryId) {
        const { archivedAt, ...rest } = entry;
        return {
          ...rest,
          archived: false,
        };
      }
      return entry;
    });
    
    // Update the contact's journal count
    const contactEntries = JOURNAL_ENTRIES.filter(e => e.contactId === entryToUnarchive.contactId && !e.archived);
    await updateContactJournalCount(entryToUnarchive.contactId, contactEntries.length);
  }
};

// Delete a journal entry
export const deleteJournalEntry = async (entryId: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const entryToDelete = JOURNAL_ENTRIES.find(entry => entry.id === entryId);
  
  if (entryToDelete) {
    JOURNAL_ENTRIES = JOURNAL_ENTRIES.filter(entry => entry.id !== entryId);
    
    // Update the contact's journal count
    const contactEntries = JOURNAL_ENTRIES.filter(e => e.contactId === entryToDelete.contactId && !e.archived);
    await updateContactJournalCount(entryToDelete.contactId, contactEntries.length);
  }
};

// Update a journal entry
export const updateJournalEntry = async (entry: JournalEntry): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  JOURNAL_ENTRIES = JOURNAL_ENTRIES.map(e => 
    e.id === entry.id ? entry : e
  );
};