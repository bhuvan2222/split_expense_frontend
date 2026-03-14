import React, { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Card, Text, Button, TextInput } from 'react-native-paper';
import { Screen } from '../../components/common/Screen';
import { EmptyState } from '../../components/common/EmptyState';
import { useGetNotificationsQuery, useMarkNotificationReadMutation } from '../../api/usersApi';
import { useCreateNotificationMutation } from '../../api/notificationsApi';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../constants/colors';

export const NotificationsScreen = () => {
  const { data: notifications = [] } = useGetNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [createNotification, { isLoading: sending }] = useCreateNotificationMutation();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  return (
    <Screen>
      <Text variant="headlineSmall" style={styles.title}>Notifications</Text>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Send test notification</Text>
          <TextInput mode="outlined" label="Title" value={title} onChangeText={setTitle} style={{ marginTop: 8 }} />
          <TextInput mode="outlined" label="Body" value={body} onChangeText={setBody} style={{ marginTop: 8 }} />
          <Button
            mode="contained"
            onPress={async () => {
              if (!user) return;
              await createNotification({ userId: user.id, title, body }).unwrap();
              setTitle('');
              setBody('');
            }}
            loading={sending}
            style={{ marginTop: 8 }}
          >
            Send
          </Button>
        </Card.Content>
      </Card>

      {notifications.length === 0 ? (
        <EmptyState title="No notifications" subtitle="You're all caught up." />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
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
  title: { color: COLORS.primary, marginBottom: 12 },
  card: { marginBottom: 12, backgroundColor: '#ffffff' },
  body: { color: COLORS.muted, marginTop: 4 }
});
