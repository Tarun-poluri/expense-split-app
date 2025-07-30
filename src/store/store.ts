import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import groupsReducer from './slices/groupsSlice';
import expensesReducer from './slices/expensesSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    groups: groupsReducer,
    expenses: expensesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 