import { current } from "@reduxjs/toolkit";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Comment from "./Comment";

const Container = styled.div`

`;

const NewComment = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

const Avatar = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
`;

const Input = styled.input`
    border: none;
    border-bottom: 1px solid ${({ theme }) => theme.textSoft};
    background-color: transparent;
    outline: none;
    padding: 5px;
    width: 100%;
    color: ${({ theme }) => theme.text};
`;

const Comments = ({ videoId }) => {
    const [comments, setComments] = useState([]);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/comments/${videoId}`);
                setComments(res.data);
            } catch (error) {
                console.log(error);
            }
        }
    }, [videoId]);

    return (
        <Container>
            <NewComment>
                <Avatar src={currentUser.image} />
                <Input placeholder="Add a comment..." />
            </NewComment>
            {comments.map(comment => (
                <Comment key={comment._id} comment={comment} />
            ))}
        </Container>
    )
}

export default Comments;