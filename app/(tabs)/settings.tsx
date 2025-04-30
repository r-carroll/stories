import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable, ScrollView, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Bell, Cloud, CircleHelp as HelpCircle, Lock, Moon, User } from 'lucide-react-native';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const systemColorScheme = useColorScheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(systemColorScheme === 'dark');
  const [cloudSyncEnabled, setCloudSyncEnabled] = React.useState(true);

  const isDark = darkModeEnabled;

  const toggleSwitch = useCallback(async (setting: string, value: boolean) => {
    switch (setting) {
      case 'notifications':
        setNotificationsEnabled(value);
        break;
      case 'darkMode':
        setDarkModeEnabled(value);
        await AsyncStorage.setItem('darkMode', value ? 'dark' : 'light');
        break;
      case 'cloudSync':
        setCloudSyncEnabled(value);
        break;
    }
  }, []);

  React.useEffect(() => {
    const loadSettings = async () => {
      const storedDarkMode = await AsyncStorage.getItem('darkMode');
      if (storedDarkMode) {
        setDarkModeEnabled(storedDarkMode === 'dark');
      }
    };
    loadSettings();
  }, []);

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    hasSwitch: boolean = false,
    value?: boolean,
    settingKey?: string,
    onPress?: () => void
  ) => (
    <Pressable
      style={[styles.settingItem, isDark && styles.settingItemDark]}
      onPress={onPress}
      disabled={hasSwitch}
    >
      <View style={styles.settingIconContainer}>
        {icon}
      </View>
      <Text style={[styles.settingTitle, isDark && styles.settingTitleDark]}>{title}</Text>
      {hasSwitch && (
        <Switch
          value={value}
          onValueChange={(newValue) => settingKey && toggleSwitch(settingKey, newValue)}
          trackColor={{ false: '#D1D1D6', true: '#34C759' }}
          thumbColor={'#FFFFFF'}
        />
      )}
    </Pressable>
  );

  return (
    <View style={[styles.container, isDark && styles.containerDark, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.titleDark]}>Settings</Text>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Preferences</Text>
            {renderSettingItem(
              <Bell size={22} color="#007AFF" />,
              'Notifications',
              true,
              notificationsEnabled,
              'notifications'
            )}
            {renderSettingItem(
              <Moon size={22} color="#6C3CB5" />,
              'Dark Mode',
              true,
              darkModeEnabled,
              'darkMode'
            )}
            {renderSettingItem(
              <Cloud size={22} color="#34C759" />,
              'Cloud Sync',
              true,
              cloudSyncEnabled,
              'cloudSync'
            )}
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Account</Text>
            {renderSettingItem(
              <User size={22} color="#FF9500" />,
              'Profile'
            )}
            {renderSettingItem(
              <Lock size={22} color="#FF2D55" />,
              'Privacy & Security'
            )}
          </View>
        </Animated.View>
        
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>Support</Text>
            {renderSettingItem(
              <HelpCircle size={22} color="#5856D6" />,
              'Help & Support'
            )}
            <View style={styles.aboutContainer}>
              <Text style={[styles.appVersion, isDark && styles.appVersionDark]}>Journal v1.0.0</Text>
              <Text style={[styles.copyright, isDark && styles.copyrightDark]}>© 2025 Journal App</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
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
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1C1C1E',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  settingItemDark: {
    backgroundColor: '#1C1C1E',
    borderBottomColor: '#2C2C2E',
  },
  settingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1C1C1E',
    flex: 1,
  },
  settingTitleDark: {
    color: '#FFFFFF',
  },
  aboutContainer: {
    alignItems: 'center',
    padding: 24,
  },
  appVersion: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8E8E93',
  },
  appVersionDark: {
    color: '#8E8E93',
  },
  copyright: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  copyrightDark: {
    color: '#8E8E93',
  },
});