import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdAt: string;
}

interface GroupsState {
  groups: Group[];
  selectedGroup: Group | null;
  loading: boolean;
  error: string | null;
}

const initialState: GroupsState = {
  groups: [],
  selectedGroup: null,
  loading: false,
  error: null,
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setGroups, 
  addGroup, 
  setSelectedGroup, 
  updateGroup, 
  setLoading, 
  setError 
} = groupsSlice.actions;
export default groupsSlice.reducer; 