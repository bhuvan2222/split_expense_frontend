import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type OfflineAction = { id: string; type: string; payload: unknown };

type OfflineState = {
  queue: OfflineAction[];
};

const initialState: OfflineState = {
  queue: []
};

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    enqueue: (state, action: PayloadAction<OfflineAction>) => {
      state.queue.push(action.payload);
    },
    dequeue: (state) => {
      state.queue.shift();
    },
    clearQueue: (state) => {
      state.queue = [];
    }
  }
});

export const { enqueue, dequeue, clearQueue } = offlineSlice.actions;
export default offlineSlice.reducer;
