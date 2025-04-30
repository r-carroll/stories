import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ArrowLeft, Camera, Check, X } from 'lucide-react-native';
import { addJournalEntry } from '@/utils/journalManager';
import { getContactById } from '@/utils/contactsManager';
import { Contact } from '@/types';

export default function NewJournalEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [contact, setContact] = useState<Contact | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [media, setMedia] = useState<string[]>([]);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  React.useEffect(() => {
    if (id) {
      loadContactData();
    }
  }, [id]);

  const loadContactData = async () => {
    if (id) {
      const contactData = await getContactById(id);
      setContact(contactData);
    }
  };

  const handleSave = async () => {
    if (!id || !title.trim() || !content.trim()) {
      return;
    }

    if (showSaveConfirm) {
      setIsLoading(true);
      try {
        const entryId = await addJournalEntry({
          contactId: id,
          title: title.trim(),
          content: content.trim(),
          date: new Date().toISOString(),
          media: media,
          hasMedia: media.length > 0,
        });
        // Replace the current screen instead of pushing a new one
        router.replace(`/(tabs)/contacts/${id}`);
      } catch (error) {
        console.error('Failed to save journal entry:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowSaveConfirm(true);
      setTimeout(() => {
        setShowSaveConfirm(false);
      }, 3000);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const addDummyMedia = () => {
    setMedia([...media, 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg']);
  };

  const removeMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const canSave = title.trim().length > 0 && content.trim().length > 0 && !isLoading;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.headerButton} onPress={handleCancel}>
          <X size={24} color="#FF3B30" />
        </Pressable>
        <Text style={styles.headerTitle}>New Story</Text>
        <Pressable 
          style={[
            styles.headerButton,
            styles.saveButton,
            !canSave && styles.headerButtonDisabled,
            showSaveConfirm && styles.saveButtonConfirm
          ]} 
          onPress={handleSave}
          disabled={!canSave || isLoading}
        >
          <Check size={24} color={showSaveConfirm ? "#FFFFFF" : (!canSave ? "#8E8E93" : "#34C759")} />
        </Pressable>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <Animated.View entering={FadeIn.delay(100)}>
          <View style={styles.contactInfo}>
            {contact && (
              <>
                <Image 
                  source={{ uri: contact.photoUri || 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg' }} 
                  style={styles.contactImage} 
                />
                <Text style={styles.contactName}>{contact.name}</Text>
              </>
            )}
          </View>
          
          <View style={styles.formContainer}>
            <TextInput
              style={styles.titleInput}
              placeholder="Title"
              placeholderTextColor="#8E8E93"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
            
            <TextInput
              style={styles.contentInput}
              placeholder="What happened with this contact? Write your story here..."
              placeholderTextColor="#8E8E93"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
            
            {media.length > 0 && (
              <View style={styles.mediaContainer}>
                {media.map((uri, index) => (
                  <View key={index} style={styles.mediaItem}>
                    <Image source={{ uri }} style={styles.mediaPreview} />
                    <Pressable 
                      style={styles.removeMediaButton}
                      onPress={() => removeMedia(index)}
                    >
                      <X size={16} color="#FFFFFF" />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
      
      <View style={[styles.toolbar, { paddingBottom: insets.bottom || 16 }]}>
        <Pressable style={styles.toolbarButton} onPress={addDummyMedia}>
          <Camera size={24} color="#007AFF" />
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
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#000000',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonDisabled: {
    opacity: 0.5,
  },
  saveButton: {
    backgroundColor: '#E5E5EA',
    borderRadius: 20,
  },
  saveButtonConfirm: {
    backgroundColor: '#34C759',
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
  formContainer: {
    paddingHorizontal: 16,
  },
  titleInput: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1C1C1E',
    padding: 0,
    marginBottom: 8,
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
  },
  contentInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1C1C1E',
    lineHeight: 24,
    minHeight: 200,
    padding: 0,
    textAlignVertical: 'top',
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  mediaItem: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  mediaPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeMediaButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  toolbarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});