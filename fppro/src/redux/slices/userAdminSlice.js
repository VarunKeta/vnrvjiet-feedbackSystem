import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for login
export const userAdminLoginThunk = createAsyncThunk(
  "user-admin-login",
  async (userCredObj, thunkApi) => {
    try {
      const url = userCredObj.userType === "user" 
                  ? "http://localhost:5000/user-api/login" 
                  : "http://localhost:5000/admin-api/login";
      const res = await axios.post(url, userCredObj);

      if (res.data.message === "login success") {
        localStorage.setItem("token", res.data.token);
        return res.data;
      } else {
        return thunkApi.rejectWithValue(res.data.message);
      }
    } catch (err) {
      console.log("Error in login thunk:", err.message);
      return thunkApi.rejectWithValue(err.message);
    }
  }
);

const userAdminSlice = createSlice({
  name: "user-admin-login",
  initialState: {
    isPending: false,
    loginUserStatus: false,
    currentUser: {},
    errorOccurred: false,
    errMsg: ''
  },
  reducers: {
    resetState: (state) => {
      state.isPending = false;
      state.currentUser = {};
      state.loginUserStatus = false;
      state.errorOccurred = false;
      state.errMsg = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(userAdminLoginThunk.pending, (state) => {
        state.isPending = true;
      })
      .addCase(userAdminLoginThunk.fulfilled, (state, action) => {
        state.isPending = false;
        state.currentUser = action.payload.user;
        state.loginUserStatus = true;
        state.errorOccurred = false;
        state.errMsg = '';
      })
      .addCase(userAdminLoginThunk.rejected, (state, action) => {
        state.isPending = false;
        state.currentUser = {};
        state.loginUserStatus = false;
        state.errorOccurred = true;
        state.errMsg = action.payload || 'Login failed';
      });
  }
});

// Export actions and reducer
export const { resetState } = userAdminSlice.actions;
export default userAdminSlice.reducer;
