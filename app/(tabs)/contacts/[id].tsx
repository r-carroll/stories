import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { ArrowLeft, CreditCard as Edit, Phone, CirclePlus as PlusCircle, Archive } from 'lucide-react-native';
import { getContactById } from '@/utils/contactsManager';
import { getJournalEntriesForContact, getArchivedEntriesForContact, archiveJournalEntry } from '@/utils/journalManager';
import { Contact, JournalEntry } from '@/types';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const SWIPE_THRESHOLD = -100;

function JournalEntryItem({ 
  entry, 
  onPress, 
  onArchive
}: { 
  entry: JournalEntry; 
  onPress: () => void;
  onArchive: () => void;
}) {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(72);
  const opacity = useSharedValue(1);
  const archiveIconOpacity = useSharedValue(0);
  const archiveBackgroundWidth = useSharedValue(0);

  const pan = Gesture.Pan()
    .onChange((event) => {
      translateX.value = translateX.value + event.changeX;
      
      // Archive animation (swipe left)
      if (translateX.value < 0) {
        archiveIconOpacity.value = Math.min(1, Math.abs(translateX.value) / Math.abs(SWIPE_THRESHOLD));
        archiveBackgroundWidth.value = Math.abs(translateX.value);
      }
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_THRESHOLD) {
        // Archive
        translateX.value = withTiming(-200);
        itemHeight.value = withTiming(0);
        opacity.value = withTiming(0, undefined, (finished) => {
          if (finished) {
            runOnJS(onArchive)();
          }
        });
      } else {
        // Reset
        translateX.value = withSpring(0);
        archiveIconOpacity.value = withTiming(0);
        archiveBackgroundWidth.value = withTiming(0);
      }
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const rContainerStyle = useAnimatedStyle(() => ({
    height: itemHeight.value,
    opacity: opacity.value,
    marginBottom: withTiming(itemHeight.value === 0 ? 0 : 8),
  }));

  const rArchiveIconStyle = useAnimatedStyle(() => ({
    opacity: archiveIconOpacity.value,
    transform: [
      { scale: archiveIconOpacity.value },
      { translateX: -20 * (1 - archiveIconOpacity.value) }
    ],
  }));

  const rArchiveBackgroundStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: archiveBackgroundWidth.value,
    backgroundColor: '#FF3B30',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  }));

  return (
    <Animated.View style={[styles.entryItemContainer, rContainerStyle]}>
      <Animated.View style={rArchiveBackgroundStyle} />
      <Animated.View style={[styles.archiveIconContainer, rArchiveIconStyle]}>
        <Archive size={24} color="#FFFFFF" />
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={rStyle}>
          <Pressable 
            style={styles.entryItem}
            onPress={onPress}
          >
            <View style={styles.entryHeader}>
              <Text style={styles.entryTitle}>{entry.title}</Text>
              <Text style={styles.entryDate}>
                {new Date(entry.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            </View>
            <Text style={styles.entryPreview} numberOfLines={2}>
              {entry.content}
            </Text>
            {entry.hasMedia && (
              <View style={styles.mediaIndicator}>
                <Text style={styles.mediaText}>Contains media</Text>
              </View>
            )}
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [contact, setContact] = useState<Contact | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [archivedCount, setArchivedCount] = useState(0);

  useEffect(() => {
    if (id) {
      loadContactData();
    }
  }, [id]);

  const loadContactData = async () => {
    if (id) {
      const contactData = await getContactById(id);
      setContact(contactData);

      const entries = await getJournalEntriesForContact(id);
      setJournalEntries(entries);

      const archivedEntries = await getArchivedEntriesForContact(id);
      setArchivedCount(archivedEntries.length);
    }
  };

  const handleArchive = async (entryId: string) => {
    await archiveJournalEntry(entryId);
    setJournalEntries(prev => prev.filter(entry => entry.id !== entryId));
    setArchivedCount(prev => prev + 1);
  };

  const navigateToEntry = (entryId: string) => {
    if (id) {
      router.push(`/(tabs)/contacts/${id}/${entryId}`);
    }
  };

  const navigateToNewEntry = () => {
    if (id) {
      router.push(`/(tabs)/contacts/${id}/new`);
    }
  };

  const navigateToArchived = () => {
    if (id) {
      router.push(`/(tabs)/contacts/${id}/archived`);
    }
  };

  const navigateBack = () => {
    router.back();
  };

  if (!contact) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={navigateBack}>
            <ArrowLeft size={24} color="#007AFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Loading...</Text>
          <View style={styles.placeholderButton} />
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
        <Text style={styles.headerTitle}>{contact.name}</Text>
        <Pressable style={styles.actionButton}>
          <Edit size={20} color="#007AFF" />
        </Pressable>
      </View>

      <Animated.View style={styles.profileSection} entering={FadeIn.delay(100)}>
        <Image 
          source={{ uri: contact.photoUri || 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg' }} 
          style={styles.profileImage} 
        />
        <Text style={styles.profileName}>{contact.name}</Text>
        <View style={styles.contactActions}>
          <Pressable style={styles.contactAction}>
            <View style={styles.actionIconContainer}>
              <Phone size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.actionText}>Call</Text>
          </Pressable>
        </View>
      </Animated.View>

      <View style={styles.journalSection}>
        <View style={styles.journalHeader}>
          <Text style={styles.journalTitle}>Stories</Text>
          <View style={styles.journalActions}>
            {archivedCount > 0 && (
              <Pressable style={styles.archivedButton} onPress={navigateToArchived}>
                <Archive size={16} color="#007AFF" />
                <Text style={styles.archivedButtonText}>
                  {archivedCount} Archived
                </Text>
              </Pressable>
            )}
            <Pressable style={styles.addEntryButton} onPress={navigateToNewEntry}>
              <PlusCircle size={20} color="#FFFFFF" />
              <Text style={styles.addEntryText}>New Story</Text>
            </Pressable>
          </View>
        </View>

        <Animated.FlatList
          data={journalEntries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.entriesList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No journal entries yet</Text>
              <Text style={styles.emptySubtext}>Create your first entry to start keeping memories</Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInDown.delay(200 + index * 50).springify()}>
              <JournalEntryItem
                entry={item}
                onPress={() => navigateToEntry(item.id)}
                onArchive={() => handleArchive(item.id)}
              />
            </Animated.View>
          )}
        />
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
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderButton: {
    width: 40,
    height: 40,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E5EA',
  },
  profileName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1C1C1E',
    marginTop: 8,
  },
  contactActions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  contactAction: {
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#1C1C1E',
    marginTop: 4,
  },
  journalSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  journalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  journalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1C1C1E',
  },
  journalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  addEntryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
  },
  archivedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 4,
  },
  archivedButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#007AFF',
  },
  entriesList: {
    paddingBottom: 16,
  },
  entryItemContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  archiveIconContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
  },
  entryItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
  entryDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
  },
  entryPreview: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#636366',
    lineHeight: 20,
  },
  mediaIndicator: {
    backgroundColor: '#E5E5EA',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  mediaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#636366',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8E8E93',
  },
  emptySubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
});