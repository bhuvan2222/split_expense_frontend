import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type {
  MainTabParamList,
  GroupsStackParamList,
  ExpensesStackParamList,
  SettlementsStackParamList,
  SettingsStackParamList
} from './types';

import { HomeScreen } from '../screens/Home/HomeScreen';
import { ReportsScreen } from '../screens/Reports/ReportsScreen';
import { GroupsListScreen } from '../screens/Groups/GroupsListScreen';
import { CreateGroupScreen } from '../screens/Groups/CreateGroupScreen';
import { GroupDetailScreen } from '../screens/Groups/GroupDetailScreen';
import { InviteMembersScreen } from '../screens/Groups/InviteMembersScreen';
import { ExpenseHistoryScreen } from '../screens/Expenses/ExpenseHistoryScreen';
import { AddExpenseScreen } from '../screens/Expenses/AddExpenseScreen';
import { ExpenseDetailScreen } from '../screens/Expenses/ExpenseDetailScreen';
import { EditExpenseScreen } from '../screens/Expenses/EditExpenseScreen';
import { ImportBillScreen } from '../screens/Bills/ImportBillScreen';
import { ItemSplitScreen } from '../screens/Bills/ItemSplitScreen';
import { SettlementsScreen } from '../screens/Settlements/SettlementsScreen';
import { UpiPayScreen } from '../screens/Settlements/UpiPayScreen';
import { SettingsScreen } from '../screens/Settings/SettingsScreen';
import { ProfileScreen } from '../screens/Settings/ProfileScreen';
import { PremiumScreen } from '../screens/Settings/PremiumScreen';
import { LanguageScreen } from '../screens/Settings/LanguageScreen';
import { NotificationsScreen } from '../screens/Settings/NotificationsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const GroupsStack = createNativeStackNavigator<GroupsStackParamList>();
const ExpensesStack = createNativeStackNavigator<ExpensesStackParamList>();
const SettlementsStack = createNativeStackNavigator<SettlementsStackParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

const GroupsStackNavigator = () => (
  <GroupsStack.Navigator>
    <GroupsStack.Screen name="GroupsList" component={GroupsListScreen} options={{ title: 'Groups' }} />
    <GroupsStack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ title: 'New group' }} />
    <GroupsStack.Screen name="GroupDetail" component={GroupDetailScreen} options={{ title: 'Group' }} />
    <GroupsStack.Screen name="InviteMembers" component={InviteMembersScreen} options={{ title: 'Invite members' }} />
  </GroupsStack.Navigator>
);

const ExpensesStackNavigator = () => (
  <ExpensesStack.Navigator>
    <ExpensesStack.Screen name="ExpenseHistory" component={ExpenseHistoryScreen} options={{ title: 'Expenses' }} />
    <ExpensesStack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: 'Add expense' }} />
    <ExpensesStack.Screen name="ExpenseDetail" component={ExpenseDetailScreen} options={{ title: 'Expense' }} />
    <ExpensesStack.Screen name="EditExpense" component={EditExpenseScreen} options={{ title: 'Edit expense' }} />
    <ExpensesStack.Screen name="ImportBill" component={ImportBillScreen} options={{ title: 'Import bill' }} />
    <ExpensesStack.Screen name="ItemSplit" component={ItemSplitScreen} options={{ title: 'Split items' }} />
  </ExpensesStack.Navigator>
);

const SettlementsStackNavigator = () => (
  <SettlementsStack.Navigator>
    <SettlementsStack.Screen name="SettlementsHome" component={SettlementsScreen} options={{ title: 'Settlements' }} />
    <SettlementsStack.Screen name="UpiPay" component={UpiPayScreen} options={{ title: 'UPI Pay' }} />
  </SettlementsStack.Navigator>
);

const SettingsStackNavigator = () => (
  <SettingsStack.Navigator>
    <SettingsStack.Screen name="SettingsHome" component={SettingsScreen} options={{ title: 'Settings' }} />
    <SettingsStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    <SettingsStack.Screen name="Premium" component={PremiumScreen} options={{ title: 'Premium' }} />
    <SettingsStack.Screen name="Language" component={LanguageScreen} options={{ title: 'Language' }} />
    <SettingsStack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
  </SettingsStack.Navigator>
);

export const MainTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Groups" component={GroupsStackNavigator} options={{ headerShown: false }} />
    <Tab.Screen name="Expenses" component={ExpensesStackNavigator} options={{ headerShown: false }} />
    <Tab.Screen name="Settlements" component={SettlementsStackNavigator} options={{ headerShown: false }} />
    <Tab.Screen name="Reports" component={ReportsScreen} />
    <Tab.Screen name="Settings" component={SettingsStackNavigator} options={{ headerShown: false }} />
  </Tab.Navigator>
);
