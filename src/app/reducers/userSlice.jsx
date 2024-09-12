import {createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: false,
    userData:{},
    searchTerm: "",
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
            console.log("ho gya ", state.userData)
        },
        setSearch: (state, action) => {
            state.searchTerm = action.payload
        }
    }
})

export const { toggleLogin, setUser, setSearch } = userSlice.actions

export default userSlice.reducer