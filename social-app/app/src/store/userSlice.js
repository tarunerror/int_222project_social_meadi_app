import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const SignUpUser = createAsyncThunk('user/registerUser', async ({ username, password, name, image }) => {
    try {
        const response = await api.post('/users/register', { username, password, name, image });
        const { message } = response.data;
        return message;
    } catch (error) {
        throw Error('An error occurred while registering');
    }
});

export const refreshToken = createAsyncThunk('user/refreshToken', async () => {
    try {
        const response = await api.post('/users/refresh-token');
        return response.data.accessToken;
    } catch (error) {
        throw Error('An error occurred while refreshing the access token');
    }
});

export const findUsers = createAsyncThunk('user/findUsers', async (searchTerm) => {
    try {
        const response = await api.get(`/users/find-people/${searchTerm}`);
        return response.data;
    } catch (error) {
        throw Error('An error occurred while finding users');
    }
});

export const loginUser = createAsyncThunk('user/loginUser', async ({ username, password }) => {
    try {
        const response = await api.post('/users/login', { username, password });
        const { message, accessToken } = response.data;
        localStorage.setItem('access_token', accessToken);
        return message;
    } catch (error) {
        throw Error('An error occurred while logging in');
    }
});

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
    try {
        localStorage.removeItem('access_token');
    } catch (error) {
        throw Error('An error occurred while logging out');
    }
});

export const fetchUserProfile = createAsyncThunk('user/fetchUserProfile', async () => {
    try {
        const response = await api.get('/users/me', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        });
        return response.data;
    } catch (error) {
        throw Error('An error occurred while fetching the user profile');
    }
});

const initialState = {
    isAuthenticated: false,
    loading: false,
    error: null,
    homeScreen: false,
    user: {},
    users: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(SignUpUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(SignUpUser.fulfilled, (state, action) => {
                state.loading = false;
            }
            )
            .addCase(SignUpUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }
            )
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
            }
            )
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }
            )
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
            }
            )
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }
            )
            .addCase(refreshToken.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.accessToken = action.payload;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(findUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(findUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(findUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            }
            )
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            }
            )
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }
            );
    },
});

export default userSlice.reducer;