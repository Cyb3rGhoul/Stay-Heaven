import {createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false
}

export const userSlice = createSlice({
    name: 'isLoggedIn',
    initialState,
    reducers: {
        toggleLogin: (state, action) => {
            state.isLoggedIn = action.payload
        }
    }
})

export const { toggleLogin } = userSlice.actions

export default userSlice.reducer