import { tokenAndDispatch, IBlog } from "../globalTypes";
import { NavigateFunction } from "react-router-dom";

export  interface likeSaveCURDBlogParams extends tokenAndDispatch{
    blog: IBlog;
    userId: string,
    isLike?: boolean,
    isSave?: boolean,
    likes?: number,
    saved?: number,
    initialLikes?: number,
    initialSaved?: number,
    navigate?: NavigateFunction
    name?: string,
}

export interface blogCategoryParams{
    search?: string,
    page?: number,
    sort?: string,
    categoryId?: string,
}
