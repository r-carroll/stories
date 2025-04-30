export interface Contact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  photoUri?: string;
  journalCount: number;
  lastInteraction?: string;
}

export interface JournalEntry {
  id: string;
  contactId: string;
  title: string;
  content: string;
  date: string;
  media?: string[];
  hasMedia: boolean;
  archived?: boolean;
  archivedAt?: string;
}