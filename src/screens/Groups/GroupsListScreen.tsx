import React, { useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { FAB, TextInput, Button, Card, Text, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { GroupCard } from '../../components/group/GroupCard';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useJoinByInviteMutation, useListGroupsQuery } from '../../api/groupsApi';
import { COLORS } from '../../constants/colors';
import { HeroHeader } from '../../components/common/HeroHeader';
import { SectionHeader } from '../../components/common/SectionHeader';

export const GroupsListScreen = () => {
  const navigation = useNavigation<any>();
  const { data: groups = [], isLoading } = useListGroupsQuery();
  const [inviteCode, setInviteCode] = useState('');
  const [joinByInvite, { isLoading: joining }] = useJoinByInviteMutation();

  return (
    <Screen>
      <HeroHeader
        title="Your Groups"
        subtitle="Manage shared expenses with friends"
        icon="account-group"
        badge={`${groups.length} groups`}
      />

      <Card style={styles.joinCard} mode="elevated" elevation={2}>
        <Card.Content>
          <View style={styles.joinHeader}>
            <Avatar.Icon size={32} icon="link-variant" style={styles.joinIcon} color={COLORS.primary} />
            <Text style={styles.joinTitle}>Have an invite code?</Text>
          </View>
          <View style={styles.joinRow}>
            <TextInput
              mode="outlined"
              label="Enter code"
              value={inviteCode}
              onChangeText={setInviteCode}
              style={styles.input}
              outlineColor="transparent"
              activeOutlineColor={COLORS.primary}
              dense
            />
            <Button
              mode="contained"
              onPress={async () => {
                if (!inviteCode.trim()) return;
                await joinByInvite({ inviteCode }).unwrap();
                setInviteCode('');
              }}
              loading={joining}
              style={styles.joinButton}
              labelStyle={styles.joinButtonText}
            >
              Join
            </Button>
          </View>
        </Card.Content>
      </Card>

      <SectionHeader title="All groups" subtitle="Tap a group to view details" />

      {isLoading ? (
        <LoadingSpinner />
      ) : groups.length === 0 ? (
        <EmptyState title="No groups yet" subtitle="Create a group to start splitting." />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <GroupCard group={item} onPress={() => navigation.navigate('GroupDetail', { groupId: item.id })} />
          )}
        />
      )}

      <FAB 
        icon="plus" 
        style={styles.fab}
        color="#ffffff"
        onPress={() => navigation.navigate('CreateGroup')} 
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  joinCard: {
    backgroundColor: '#ffffff',
    borderRadius: 0,
    marginBottom: 16,
    marginHorizontal: -20,
  },
  joinHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  joinIcon: { backgroundColor: COLORS.primary + '1A', marginRight: 8 },
  joinTitle: { fontWeight: '600', color: COLORS.text, fontSize: 16 },
  
  joinRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#f8f9fa' },
  joinButton: { borderRadius: 12, justifyContent: 'center' },
  joinButtonText: { fontWeight: 'bold' },

  listContainer: { paddingBottom: 80 },
  
  fab: { 
    position: 'absolute', 
    right: 20, 
    bottom: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 16,
  }
});
