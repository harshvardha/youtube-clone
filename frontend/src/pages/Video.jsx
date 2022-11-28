import { AddTaskOutlined, ReplyOutlined, ThumbDown, ThumbDownOffAltOutlined, ThumbUp, ThumbUpOutlined } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";
import Comments from "../components/Comments";
import { dislike, fetchSuccess, like } from "../redux/videoSlice";
import { format } from "timeago.js";
import { subscription } from "../redux/userSlice";
import Recommendation from "../components/Recommendation";

const Container = styled.div`
    display: flex;
    gap: 24px;
`;

const Content = styled.div`
    flex: 5;
`;

const VideoWrapper = styled.div`

`;

const Title = styled.h1`
    margin-top: 10px;
    margin-bottom: 2px;
    font-size: 18px;
    font-weight: 400;
    color: ${({ theme }) => theme.text};
`;

const Details = styled.span`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Info = styled.span`
    color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
    display: flex;
    gap: 20px;
    color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
    display:flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    border:none;
    background-color: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
`;

const Hr = styled.hr`
    margin: 15px 0px;
    border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ChannelInfo = styled.div`
    display: flex;
    gap: 20px;
`;

const Image = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
`;

const ChannelDetail = styled.div`
    display: flex;
    flex-direction: column;
    color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
    font-weight: 500;
`;

const ChannelCounter = styled.span`
    margin-top: 5px;
    margin-bottom: 20px;
    color: ${({ theme }) => theme.text};
    font-size: 12px;
`;

const Description = styled.p`
    font-size: 14px;
`;

const Subscribe = styled.button`
    background-color: #cc1a00;
    font-weight: 500;
    color: white;
    border: none;
    border-radius: 20px;
    height: max-content;
    padding: 10px 20px;
    cursor: pointer;
`;

const VideoFrame = styled.video`
    max-height: 720px;
    width: 100%;
    object-fit: cover;
`;

const Video = () => {
    const { currentUser } = useSelector(state => state.user);
    const { currentVideo } = useSelector(state => state.video);
    const dispatch = useDispatch();
    const params = useParams();
    const [video, setVideo] = useState({});
    const [channel, setChannel] = useState({});

    const handleLike = async () => {
        await axios.put(`http://localhost:5000/users/like/${currentVideo._id}`);
        dispatch(like(currentUser._id));
    }

    const handleDislike = async () => {
        await axios.put(`http://localhost:5000/users/dislike/${currentVideo._id}`);
        dispatch(dislike(currentUser._id));
    }

    const handleSubscribe = async () => {
        currentUser.subscribedUsers.includes(channel._id) ?
            await axios.put(`http://localhost:5000/users/unsubscribe/${channel._id}`) :
            await axios.put(`http://localhost:5000/users/subscribe/${channel._id}`);
        dispatch(subscription(channel._id));
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const videoId = params.id;
                console.log("video id: ", videoId)
                const videoRes = await axios.get(`http://localhost:5000/videos/find/${videoId}`);
                const channelRes = await axios.get(`http://localhost:5000/users/find/${videoRes.data.userId}`);
                console.log("video: ", videoRes);
                console.log("channel: ", channelRes);
                setChannel(channelRes.data);
                dispatch(fetchSuccess(videoRes.data));
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);

    return (
        <Container>
            <Content>
                <VideoWrapper>
                    <VideoFrame src={currentVideo ? currentVideo.videoUrl : ""} controls />
                </VideoWrapper>
                <Title>{currentVideo ? currentVideo.title : ""}</Title>
                <Details>
                    <Info>{currentVideo ? currentVideo.views : ""} views . {format(currentVideo ? currentVideo.createdAt : "")}</Info>
                    <Buttons>
                        <Button onClick={handleLike}>{currentVideo ? (currentVideo.likes ? (currentVideo.likes.includes(currentUser._id) ? <ThumbUp /> : <ThumbUpOutlined />) : "") : ""}{currentVideo ? (currentVideo.likes ? currentVideo.likes.length : "0") : "0"}</Button>
                        <Button onClick={handleDislike}>{currentVideo ? (currentVideo.dislikes ? (currentVideo.dislikes.includes(currentUser._id) ? <ThumbDown /> : <ThumbDownOffAltOutlined />) : "") : ""}</Button>
                        <Button><ReplyOutlined /></Button>
                        <Button><AddTaskOutlined /></Button>
                    </Buttons>
                </Details>
                <Hr />
                <Channel>
                    <ChannelInfo>
                        <Image src={channel ? channel.image : ""} />
                        <ChannelDetail>
                            <ChannelName>{channel ? channel.name : ""}</ChannelName>
                            <ChannelCounter>{channel ? channel.subscribers : ""} subscribers</ChannelCounter>
                            <Description>{currentVideo ? currentVideo.description : ""}</Description>
                        </ChannelDetail>
                    </ChannelInfo>
                    <Subscribe onClick={handleSubscribe}>{currentUser ? (currentUser.subscribedUsers ? (currentUser.subscribedUsers.includes(channel._id) ? "SUBSCRIBED" : "SUBSCRIBE") : "") : ""}</Subscribe>
                </Channel>
                <Hr />
                <Comments videoId={currentVideo ? currentVideo._id : ""} />
            </Content>
            <Recommendation tags={currentVideo ? currentVideo.tags : ""} />
        </Container>
    )
}

export default Video;