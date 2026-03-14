import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { FAB, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { GroupCard } from '../../components/group/GroupCard';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { useJoinByInviteMutation, useListGroupsQuery } from '../../api/groupsApi';

export const GroupsListScreen = () => {
  const navigation = useNavigation<any>();
  const { data: groups = [], isLoading } = useListGroupsQuery();
  const [inviteCode, setInviteCode] = useState('');
  const [joinByInvite, { isLoading: joining }] = useJoinByInviteMutation();

  return (
    <Screen>
      <View style={{ marginBottom: 12 }}>
        <TextInput
          mode="outlined"
          label="Join with invite code"
          value={inviteCode}
          onChangeText={setInviteCode}
        />
        <Button
          mode="outlined"
          onPress={async () => {
            if (!inviteCode.trim()) return;
            await joinByInvite({ inviteCode }).unwrap();
            setInviteCode('');
          }}
          loading={joining}
          style={{ marginTop: 8 }}
        >
          Join group
        </Button>
      </View>

      {isLoading ? (
        <LoadingSpinner />
      ) : groups.length === 0 ? (
        <EmptyState title="No groups yet" subtitle="Create a group to start splitting." />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GroupCard group={item} onPress={() => navigation.navigate('GroupDetail', { groupId: item.id })} />
          )}
        />
      )}

      <View style={{ position: 'absolute', right: 20, bottom: 20 }}>
        <FAB icon="plus" onPress={() => navigation.navigate('CreateGroup')} />
      </View>
    </Screen>
  );
};
