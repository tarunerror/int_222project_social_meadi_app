import { createSlice } from '@reduxjs/toolkit';
export const componentMap = {
  Home: 'Home',
  AddPost: 'AddPost',
  CreateStory: 'CreateStory',
  SelectFromGallery: 'SelectFromGallery',
  ImageTool: 'ImageTool',
  Post: 'Post',
  PostViewPost: 'PostViewPost',
  PostViewStory: 'PostViewStory',
};
const initialState = {
  activeScreen: null,
  backStack: [],
  isHeaderVisible: true,
  screenIds: ['home', 'addPost', 'createStory', 'selectFromGallery', 'imageTool', 'post', 'postViewPost', 'postViewStory'],
  screens: [
    { id: 'home', componentId: 'Home' },
    { id: 'addPost', componentId: 'AddPost' },
    { id: 'createStory', componentId: 'CreateStory' },
    { id: 'selectFromGallery', componentId: 'SelectFromGallery' },
    { id: 'imageTool', componentId: 'ImageTool' },
    { id: 'post', componentId: 'Post' },
    { id: 'postViewPost', componentId: 'PostViewPost' },
    { id: 'postViewStory', componentId: 'PostViewStory' },
  ]
};

const screenSlice = createSlice({
  name: 'screen',
  initialState,
  reducers: {
    setActiveScreen: (state, action) => {
      const screenId = action.payload;
      if (state.screenIds.includes(screenId)) {
        state.backStack.push(state.activeScreen);
        document.title = `Mini Social App - ${screenId.split(/(?=[A-Z])/).join(' ').toUpperCase()}`;
        state.activeScreen = screenId;
      }
    },
    navigateToPreviousScreen: (state) => {
      if (state.backStack.length > 0) {
        const lastScreenId = state.backStack.pop();
        state.activeScreen = lastScreenId;
      }
    },
    closeActiveScreen: (state) => {
      state.backStack = [];
      state.activeScreen = 'home'
    },
    toggleHeaderVisibility: (state) => {
      state.isHeaderVisible = !state.isHeaderVisible;
    },
  },
});

export const {
  setActiveScreen,
  navigateToPreviousScreen,
  closeActiveScreen,
  toggleHeaderVisibility,
} = screenSlice.actions;
export default screenSlice.reducer;