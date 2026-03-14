export type AuthStackParamList = {
  Welcome: undefined;
  Login: { mode?: 'login' | 'register' } | undefined;
  Onboarding: undefined;
};

export type GroupsStackParamList = {
  GroupsList: undefined;
  CreateGroup: undefined;
  GroupDetail: { groupId: string };
  InviteMembers: { groupId: string };
  EditGroup: { groupId: string };
};

export type ExpensesStackParamList = {
  ExpenseHistory: { groupId?: string } | undefined;
  AddExpense: { groupId?: string } | undefined;
  ExpenseDetail: { expenseId: string };
  EditExpense: { expenseId: string };
  ImportBill: { groupId?: string } | undefined;
  ItemSplit: { groupId?: string } | undefined;
};

export type SettlementsStackParamList = {
  SettlementsHome: { groupId?: string } | undefined;
  UpiPay: { settlementId: string; upiIntent?: string };
};

export type SettingsStackParamList = {
  SettingsHome: undefined;
  Profile: undefined;
  Premium: undefined;
  Language: undefined;
  Notifications: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Groups: undefined;
  Expenses: undefined;
  Settlements: undefined;
  Reports: undefined;
  Settings: undefined;
};
