import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getConversations,
    getConversationsGroup,
    getConversation,
    getConversationBetweenTwoUsers,
    createConversation1vs1,
    createConversationGroupChat,
    deleteConversation1vs1,
} from '../../api/conversationAPI'; // Đường dẫn đến file conversationAPI

// Async thunks cho các API calls
export const fetchConversations = createAsyncThunk(
    'conversation/fetchConversations',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await getConversations(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Lấy danh sách cuộc trò chuyện nhóm
export const fetchGroupConversations = createAsyncThunk(
    'conversation/fetchGroupConversations',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await getConversationsGroup(userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Lấy thông tin cuộc trò chuyện theo ID
export const fetchConversation = createAsyncThunk(
    'conversation/fetchConversation',
    async (conversationId, { rejectWithValue }) => {
        try {
            const response = await getConversation(conversationId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Lấy thông tin cuộc trò chuyện giữa hai người dùng
export const fetchConversationBetweenUsers = createAsyncThunk(
    'conversation/fetchConversationBetweenUsers',
    async ({ friend_id, user_id }, { rejectWithValue }) => {
        try {
            const response = await getConversationBetweenTwoUsers(friend_id, user_id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Tạo cuộc trò chuyện 1-1
export const createOneOnOneConversation = createAsyncThunk(
    'conversation/createOneOnOneConversation',
    async ({ userId, friendId }, { rejectWithValue }) => {
        try {
            const response = await createConversation1vs1(userId, friendId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Tạo cuộc trò chuyện nhóm
export const createGroupConversation = createAsyncThunk(
    'conversation/createGroupConversation',
    async (groupData, { rejectWithValue }) => {
        try {
            const response = await createConversationGroupChat(groupData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Xóa cuộc trò chuyện 1-1
export const deleteOneOnOneConversation = createAsyncThunk(
    'conversation/deleteOneOnOneConversation',
    async ({ conversationId, userId }, { rejectWithValue }) => {
        try {
            const response = await deleteConversation1vs1(conversationId, userId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Tạo slice
const conversationSlice = createSlice({
    name: 'conversation',
    initialState: {
        conversations: [],
        groupConversations: [],
        currentConversation: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentConversation: (state) => {
            state.currentConversation = null;
        },
        addNewConversation: (state, action) => {
            const newConversation = action.payload;
            const existingIndex = state.conversations.findIndex(
                (conv) => conv._id === newConversation._id
            );

            if (existingIndex !== -1) {
                // Cập nhật cuộc trò chuyện hiện có
                state.conversations[existingIndex] = newConversation;
            } else {
                // Thêm cuộc trò chuyện mới
                state.conversations.push(newConversation);
            }

            // Sắp xếp danh sách conversations theo lastMessage.createdAt hoặc createdAt
            state.conversations.sort((a, b) => {
                const timeA = a.lastMessage?.createdAt
                    ? new Date(a.lastMessage.createdAt).getTime()
                    : new Date(a.createdAt).getTime(); // Sử dụng createdAt nếu lastMessage không có
                const timeB = b.lastMessage?.createdAt
                    ? new Date(b.lastMessage.createdAt).getTime()
                    : new Date(b.createdAt).getTime(); // Sử dụng createdAt nếu lastMessage không có
                return timeB - timeA; // Sắp xếp giảm dần (mới nhất lên đầu)
            });
        },
    },
    extraReducers: (builder) => {
        // Fetch all conversations
        builder
            .addCase(fetchConversations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConversations.fulfilled, (state, action) => {
                state.loading = false;
                state.conversations = action.payload;
            })
            .addCase(fetchConversations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch group conversations
            .addCase(fetchGroupConversations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGroupConversations.fulfilled, (state, action) => {
                state.loading = false;
                state.groupConversations = action.payload;
            })
            .addCase(fetchGroupConversations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch single conversation
            .addCase(fetchConversation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConversation.fulfilled, (state, action) => {
                state.loading = false;
                state.currentConversation = action.payload;
            })
            .addCase(fetchConversation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch conversation between two users
            .addCase(fetchConversationBetweenUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchConversationBetweenUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.currentConversation = action.payload;
            })
            .addCase(fetchConversationBetweenUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create 1-1 conversation
            .addCase(createOneOnOneConversation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOneOnOneConversation.fulfilled, (state, action) => {
                state.loading = false;
                state.conversations.push(action.payload);
                state.currentConversation = action.payload;
            })
            .addCase(createOneOnOneConversation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create group conversation
            .addCase(createGroupConversation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGroupConversation.fulfilled, (state, action) => {
                state.loading = false;
                state.groupConversations.push(action.payload);
                state.currentConversation = action.payload;
            })
            .addCase(createGroupConversation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete 1-1 conversation
            .addCase(deleteOneOnOneConversation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOneOnOneConversation.fulfilled, (state, action) => {
                state.loading = false;
                state.conversations = state.conversations.filter(
                    (conv) => conv._id !== action.payload._id
                );
                if (state.currentConversation?._id === action.payload._id) {
                    state.currentConversation = null;
                }
            })
            .addCase(deleteOneOnOneConversation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions
export const { clearError, clearCurrentConversation, addNewConversation } = conversationSlice.actions;

// Export reducer
export default conversationSlice.reducer;