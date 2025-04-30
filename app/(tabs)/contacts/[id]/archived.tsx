import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { ArrowLeft, Archive } from 'lucide-react-native';
import { getArchivedEntriesForContact, unarchiveJournalEntry } from '@/utils/journalManager';
import { getContactById } from '@/utils/contactsManager';
import { Contact, JournalEntry } from '@/types';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const UNARCHIVE_THRESHOLD = 100;

function ArchivedEntryItem({ 
  entry, 
  onPress, 
  onUnarchive 
}: { 
  entry: JournalEntry; 
  onPress: () => void;
  onUnarchive: () => void;
}) {
  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(72);
  const opacity = useSharedValue(1);
  const unarchiveIconOpacity = useSharedValue(0);
  const unarchiveBackgroundWidth = useSharedValue(0);

  const pan = Gesture.Pan()
    .onChange((event) => {
      translateX.value = translateX.value + event.changeX;
      
      // Unarchive animation (swipe right)
      if (translateX.value > 0) {
        unarchiveIconOpacity.value = Math.min(1, translateX.value / UNARCHIVE_THRESHOLD);
        unarchiveBackgroundWidth.value = translateX.value;
      }
    })
    .onEnd(() => {
      if (translateX.value > UNARCHIVE_THRESHOLD) {
        // Unarchive
        translateX.value = withTiming(200);
        itemHeight.value = withTiming(0);
        opacity.value = withTiming(0, undefined, (finished) => {
          if (finished) {
            runOnJS(onUnarchive)();
          }
        });
      } else {
        // Reset
        translateX.value = withSpring(0);
        unarchiveIconOpacity.value = withTiming(0);
        unarchiveBackgroundWidth.value = withTiming(0);
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

  const rUnarchiveIconStyle = useAnimatedStyle(() => ({
    opacity: unarchiveIconOpacity.value,
    transform: [
      { scale: unarchiveIconOpacity.value },
      { translateX: 20 * (1 - unarchiveIconOpacity.value) }
    ],
  }));

  const rUnarchiveBackgroundStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: unarchiveBackgroundWidth.value,
    backgroundColor: '#34C759',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  }));

  return (
    <Animated.View style={[styles.entryItemContainer, rContainerStyle]}>
      <Animated.View style={rUnarchiveBackgroundStyle} />
      <Animated.View style={[styles.unarchiveIconContainer, rUnarchiveIconStyle]}>
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

export default function ArchivedEntriesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [contact, setContact] = useState<Contact | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (id) {
      const contactData = await getContactById(id);
      setContact(contactData);

      const archivedEntries = await getArchivedEntriesForContact(id);
      setEntries(archivedEntries);
    }
  };

  const handleUnarchive = async (entryId: string) => {
    await unarchiveJournalEntry(entryId);
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const navigateBack = () => {
    router.back();
  };

  const navigateToEntry = (entryId: string) => {
    if (id) {
      router.push(`/(tabs)/contacts/${id}/${entryId}`);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={navigateBack}>
          <ArrowLeft size={24} color="#007AFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Archived Stories</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.entriesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No archived stories</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(100 + index * 50).springify()}>
            <ArchivedEntryItem
              entry={item}
              onPress={() => navigateToEntry(item.id)}
              onUnarchive={() => handleUnarchive(item.id)}
            />
          </Animated.View>
        )}
      />
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
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
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
  entriesList: {
    padding: 16,
  },
  entryItemContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  unarchiveIconContainer: {
    position: 'absolute',
    left: 20,
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
    padding: 32,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8E8E93',
  },
});