import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Group {
  id: string;
  name: string;
  members: string[];
  totalExpenses: number;
  createdAt: Date;
}

interface GroupsState {
  groups: Group[];
  selectedGroup: Group | null;
}

const initialState: GroupsState = {
  groups: [],
  selectedGroup: null,
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
    },
    addGroup: (state, action: PayloadAction<Group>) => {
      state.groups.push(action.payload);
    },
    setSelectedGroup: (state, action: PayloadAction<Group | null>) => {
      state.selectedGroup = action.payload;
    },
    updateGroup: (state, action: PayloadAction<Group>) => {
      const index = state.groups.findIndex(group => group.id === action.payload.id);
      if (index !== -1) {
        state.groups[index] = action.payload;
      }
    },
  },
});

export const { setGroups, addGroup, setSelectedGroup, updateGroup } = groupsSlice.actions;
export default groupsSlice.reducer;