import { IComment, tokenAndDispatch } from "../globalTypes";

export interface ICommentState{
    comments: IComment[],
    total: number,
}

export interface createCommentProps extends tokenAndDispatch{
    comment: IComment;
}

export interface useCommentsProps{
    id: string | undefined;
    limit?: number;
    page?: number;
}

export interface useCUDRCommentMutationProps extends createCommentProps, useCommentsProps{
    navigate?: any
}
