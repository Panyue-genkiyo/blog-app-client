import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    UserLocationStateType,
    UserPagePayLoadType,
    BlogCategoryPagePayLoadType,
    BlogCommentsPagePayLoadType,
} from "../../types/rd-types/locationTypes";

const initialState: UserLocationStateType = {
    user: {},
    comments: {},
    bc: {}
}

const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        setUserLocation: (state, action: PayloadAction<UserPagePayLoadType>) => {
            if(state.user[action.payload.userId])  {
                state.user[action.payload.userId][action.payload.target] = action.payload.page;
            }
        },
        setBlogCategoryLocation: (state, action: PayloadAction<BlogCategoryPagePayLoadType>) => {
            state.bc[action.payload.categoryId] = {
                page: action.payload.page,
                sort: action.payload.sort
            }
        },
        setBlogCommentsLocation: (state, action: PayloadAction<BlogCommentsPagePayLoadType>) => {
           state.comments[action.payload.blogId] = action.payload.page;
        }
    }
});

export const { setUserLocation, setBlogCategoryLocation, setBlogCommentsLocation } = locationSlice.actions;
export default locationSlice.reducer;
