import React, {useMemo} from 'react';
import classes from "./Comment.module.css"
import {getUserDataById} from "../../../API/UserService";
import useSWR from "swr";
import {fetcher} from "../../../API/Base";

const Comment = ({userId, text}) => {
    const userKey = useMemo(() => getUserDataById(userId), [userId])
    const {data: userData, error: userError} = useSWR(userKey, fetcher)

    if(userError) return <div>Error</div>
    if(!userData) return <div>Loading...</div>
    console.log(userData)
    return (
        <div className={classes.CommentContainer}>
            <h3>{userData.username}</h3>
            <div className={classes.content} dangerouslySetInnerHTML={{__html: text}}></div>
        </div>
    );
};

export default Comment;