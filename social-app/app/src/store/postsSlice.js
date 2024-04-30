import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const addImage = createAsyncThunk('posts/addImage', async (imageUrl) => {
  try {
    return imageUrl;
  } catch (error) {
    throw Error('An error occurred while adding the image');
  }
});

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  try {
    const response = await api.get('/posts', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw Error('An error occurred while fetching the posts');
  }
});

export const createPost = createAsyncThunk('posts/createPost', async (postData) => {
  try {
    const response = await api.post('/posts/create',
      postData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
    return response.data.post;
  } catch (error) {
    throw Error('An error occurred while creating the post or story');
  }
});

export const likePost = createAsyncThunk('posts/likePost', async (postId) => {
  try {
    const response = await api.post(`/posts/like/${postId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return response.data.post;
  } catch (error) {
    throw Error('An error occurred while liking the post or story');
  }
});

export const likeStory = createAsyncThunk('posts/likeStory', async (postId) => {
  try {
    const response = await api.post(`/posts/like/${postId}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    return response.data.post;
  } catch (error) {
    throw Error('An error occurred while liking the post or story');
  }
});

// by id fetch
export const fetchPostById = createAsyncThunk('posts/fetchPostById', async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw Error('An error occurred while fetching the post or story');
  }
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    story: [],
    postId: '',
    image: '',
    loading: false,
    error: null,
  },
  reducers: {
    setPostId: (state, action) => {
      state.postId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(likePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
      )
      .addCase(likePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.map((post) => {
          if (post._id === action.payload._id) {
            return action.payload;
          }
          return post;
        }
        )
      }
      )
      .addCase(likePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      }
      )
      .addCase(addImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
      )
      .addCase(addImage.fulfilled, (state, action) => {
        state.loading = false;
        state.image = action.payload;
      }
      )
      .addCase(addImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      }
      )
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
      )
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.story = action.payload;
      }
      )
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      }
      )
      .addCase(likeStory.pending, (state) => {
        state.loading = true;
        state.error = null;
      }
      )
      .addCase(likeStory.fulfilled, (state, action) => {
        state.loading = false;
        state.story = action.payload;
      }
      )
      .addCase(likeStory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      }
      )
  },
});

export const { setPostId } = postsSlice.actions;
export default postsSlice.reducer;