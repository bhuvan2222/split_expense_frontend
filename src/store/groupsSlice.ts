import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Group = { id: string; name: string };

type GroupsState = {
  items: Group[];
};

const initialState: GroupsState = {
  items: []
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.items = action.payload;
    }
  }
});

export const { setGroups } = groupsSlice.actions;
export default groupsSlice.reducer;
