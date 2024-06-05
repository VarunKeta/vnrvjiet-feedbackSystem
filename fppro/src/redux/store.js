//create redux store
import {configureStore} from '@reduxjs/toolkit'
import userAdminReducer from './slices/userAdminSlice'
export const store=configureStore({
    reducer:{
        userAdminLoginReducer:userAdminReducer
    }
})