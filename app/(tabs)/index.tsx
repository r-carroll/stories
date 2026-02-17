import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFriendships, useUser } from '../../hooks/useDatabase';

interface Friendship {
  id: string | number;
  userId: string | number;
  untoldCount: number;
}

function FriendAvatar({ friendship }: { friendship: Friendship }) {
  const { user } = useUser(friendship.userId);
  
  if (!user) return null;
  
  return (
    <View style={styles.friendItem}>
      {user.avatarUrl ? (
        <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarPlaceholder]}>
          <Text style={styles.avatarInitial}>{user.username.charAt(0)}</Text>
        </View>
      )}
      <Text style={styles.friendName} numberOfLines={1}>{user.username}</Text>
      {friendship.untoldCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{friendship.untoldCount}</Text>
        </View>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { friendships, loading } = useFriendships();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.header}>The Campfire</Text>
      <View style={styles.fireContainer}>
        <Text style={styles.fireEmoji}>🔥</Text>
        {loading ? (
          <Text style={styles.placeholderText}>Gathering Friends...</Text>
        ) : friendships.length === 0 ? (
          <Text style={styles.placeholderText}>No friends yet</Text>
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.friendsList}
          >
            {friendships.map((friendship) => (
              <FriendAvatar key={friendship.id} friendship={friendship} />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  header: {
    fontFamily: 'YoungSerif',
    fontSize: 34,
    color: Colors.primary,
    marginTop: 20,
  },
  fireContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  fireEmoji: {
    fontSize: 80,
    marginBottom: 30,
  },
  placeholderText: {
    fontFamily: 'Inter',
    color: Colors.textMuted,
    fontSize: 16,
  },
  friendsList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  friendItem: {
    alignItems: 'center',
    width: 70,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 6,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontFamily: 'InterSemiBold',
    fontSize: 20,
    color: Colors.text,
  },
  friendName: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: Colors.text,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 4,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontFamily: 'InterSemiBold',
    fontSize: 11,
    color: Colors.background,
  },
});