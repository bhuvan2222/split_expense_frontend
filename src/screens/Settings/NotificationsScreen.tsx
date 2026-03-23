import React, { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Card, Text, Button, TextInput } from 'react-native-paper';
import { Screen } from '../../components/common/Screen';
import { EmptyState } from '../../components/common/EmptyState';
import { useGetNotificationsQuery, useMarkNotificationReadMutation } from '../../api/usersApi';
import { useCreateNotificationMutation } from '../../api/notificationsApi';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../constants/colors';
import { HeroHeader } from '../../components/common/HeroHeader';
import { SectionHeader } from '../../components/common/SectionHeader';

export const NotificationsScreen = () => {
  const { data: notifications = [] } = useGetNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [createNotification, { isLoading: sending }] = useCreateNotificationMutation();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  return (
    <Screen>
      <HeroHeader title="Notifications" subtitle="Updates and alerts from your groups" icon="bell" />
      <SectionHeader title="Send test notification" subtitle="Validate your push setup" />
      <Card style={styles.card} mode="contained">
        <Card.Content>
          <TextInput mode="outlined" label="Title" value={title} onChangeText={setTitle} style={styles.input} />
          <TextInput mode="outlined" label="Body" value={body} onChangeText={setBody} style={styles.input} />
          <Button
            mode="contained"
            onPress={async () => {
              if (!user) return;
              await createNotification({ userId: user.id, title, body }).unwrap();
              setTitle('');
              setBody('');
            }}
            loading={sending}
            style={styles.primaryButton}
          >
            Send
          </Button>
        </Card.Content>
      </Card>

      <SectionHeader title="Recent notifications" subtitle="Unread items appear first" />
      {notifications.length === 0 ? (
        <EmptyState title="No notifications" subtitle="You're all caught up." />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card} mode="contained">
              <Card.Content>
                <Text>{item.title}</Text>
                <Text style={styles.body}>{item.body}</Text>
                {!item.isRead ? (
                  <Button mode="text" onPress={() => markRead({ id: item.id })}>
                    Mark read
                  </Button>
                ) : null}
              </Card.Content>
            </Card>
          )}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  card: { marginBottom: 12, backgroundColor: '#ffffff', borderRadius: 0, marginHorizontal: -20 },
  input: { marginTop: 8, backgroundColor: '#ffffff' },
  primaryButton: { marginTop: 8 },
  body: { color: COLORS.muted, marginTop: 4 }
});
