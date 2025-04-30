import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ArrowLeft, Archive, CreditCard as Edit, Trash2 } from 'lucide-react-native';
import { getJournalEntryById, deleteJournalEntry, archiveJournalEntry, unarchiveJournalEntry } from '@/utils/journalManager';
import { getContactById } from '@/utils/contactsManager';
import { Contact, JournalEntry } from '@/types';

export default function JournalEntryDetailScreen() {
  const { id, entryId } = useLocalSearchParams<{ id: string; entryId: string }>();
  const insets = useSafeAreaInsets();
  const [contact, setContact] = useState<Contact | null>(null);
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  useEffect(() => {
    if (id && entryId) {
      loadData();
    }
  }, [id, entryId]);

  const loadData = async () => {
    if (id && entryId) {
      const contactData = await getContactById(id);
      setContact(contactData);

      const entryData = await getJournalEntryById(entryId);
      setEntry(entryData);
    }
  };

  const handleEdit = () => {
    // Navigate to edit screen (would be implemented in a full app)
    alert('Edit functionality would be implemented here');
  };

  const handleDelete = async () => {
    if (showDeleteConfirm) {
      if (entryId) {
        await deleteJournalEntry(entryId);
        router.back();
      }
    } else {
      setShowDeleteConfirm(true);
      
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => {
        setShowDeleteConfirm(false);
      }, 3000);
    }
  };

  const handleArchive = async () => {
    if (isArchiving) return;

    if (showArchiveConfirm) {
      setIsArchiving(true);
      try {
        if (entryId) {
          if (entry?.archived) {
            await unarchiveJournalEntry(entryId);
          } else {
            await archiveJournalEntry(entryId);
          }
          router.back();
        }
      } catch (error) {
        console.error('Failed to archive/unarchive entry:', error);
      } finally {
        setIsArchiving(false);
      }
    } else {
      setShowArchiveConfirm(true);
      
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => {
        setShowArchiveConfirm(false);
      }, 3000);
    }
  };

  const navigateBack = () => {
    router.back();
  };

  if (!entry || !contact) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={navigateBack}>
            <ArrowLeft size={24} color="#007AFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Loading...</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={navigateBack}>
          <ArrowLeft size={24} color="#007AFF" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {entry.title}
        </Text>
        <Pressable style={styles.editButton} onPress={handleEdit}>
          <Edit size={20} color="#007AFF" />
        </Pressable>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <Animated.View entering={FadeIn.delay(100)}>
          <View style={styles.contactInfo}>
            <Image 
              source={{ uri: contact.photoUri || 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg' }} 
              style={styles.contactImage} 
            />
            <Text style={styles.contactName}>{contact.name}</Text>
          </View>
          
          <View style={styles.entryContainer}>
            <Text style={styles.entryTitle}>{entry.title}</Text>
            
            <Text style={styles.entryDate}>
              {new Date(entry.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
            
            <Text style={styles.entryContent}>{entry.content}</Text>
            
            {entry.media && entry.media.length > 0 && (
              <View style={styles.mediaContainer}>
                {entry.media.map((uri, index) => (
                  <Image 
                    key={index}
                    source={{ uri }}
                    style={styles.mediaImage}
                  />
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
      
      <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
        <Pressable 
          style={[
            styles.archiveButton,
            showArchiveConfirm && styles.archiveButtonConfirm,
            isArchiving && styles.buttonDisabled
          ]} 
          onPress={handleArchive}
          disabled={isArchiving}
        >
          <Archive size={20} color={showArchiveConfirm ? "#FFFFFF" : "#007AFF"} />
          <Text 
            style={[
              styles.archiveButtonText,
              showArchiveConfirm && styles.archiveButtonTextConfirm
            ]}
          >
            {showArchiveConfirm 
              ? "Confirm Archive" 
              : entry.archived 
                ? "Unarchive Entry" 
                : "Archive Entry"}
          </Text>
        </Pressable>

        <Pressable 
          style={[
            styles.deleteButton, 
            showDeleteConfirm && styles.deleteButtonConfirm
          ]} 
          onPress={handleDelete}
        >
          <Trash2 size={20} color={showDeleteConfirm ? "#FFFFFF" : "#FF3B30"} />
          <Text 
            style={[
              styles.deleteButtonText,
              showDeleteConfirm && styles.deleteButtonTextConfirm
            ]}
          >
            {showDeleteConfirm ? "Confirm Delete" : "Delete Entry"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#000000',
    maxWidth: '70%',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  contactInfo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  contactImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E5EA',
  },
  contactName: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: '#1C1C1E',
    marginTop: 8,
  },
  entryContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  entryTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1C1C1E',
    marginBottom: 8,
  },
  entryDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
  },
  entryContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 24,
  },
  mediaContainer: {
    marginTop: 24,
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#E5E5EA',
  },
  footer: {
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
    gap: 8,
  },
  archiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  archiveButtonConfirm: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  archiveButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
  },
  archiveButtonTextConfirm: {
    color: '#FFFFFF',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  deleteButtonConfirm: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  deleteButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 8,
  },
  deleteButtonTextConfirm: {
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});