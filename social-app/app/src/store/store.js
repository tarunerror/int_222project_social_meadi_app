import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import postsReducer from './postsSlice';
import screenReducer from './screenSlice';

const store = configureStore({
  reducer: {
    auth: userReducer,
    posts: postsReducer,
    screen: screenReducer,
  },
});

export default store;