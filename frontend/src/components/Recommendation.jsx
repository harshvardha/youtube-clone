import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "./Card";

const Container = styled.div`
    flex: 2;
`;

const Recommendation = ({ tags }) => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            const res = await axios.get(`http://localhost:5000/videos/tags?tags=${tags}`);
            setVideos(res.data);
        }
        fetchVideos();
    }, [tags]);

    return (
        <Container>
            {videos.map(video => (
                <Card key={video._id} video={video} />
            ))}
        </Container>
    )
}

export default Recommendation;