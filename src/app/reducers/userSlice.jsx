import {createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    userData:{}
}

export const userSlice = createSlice({
    name: 'isLoggedIn',
    initialState,
    reducers: {
        toggleLogin: (state, action) => {
            state.isLoggedIn = action.payload
        },
        setUser: (state, action) => {
            state.userData = action.payload
        }
    }
})

export const { toggleLogin, setUser } = userSlice.actions

export default userSlice.reducer