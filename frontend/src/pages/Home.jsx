import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Card from "../components/Card";

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    col-gap: 100px;
    padding: 10px 20px;
`


const Home = ({ type }) => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            const res = await axios.get(`http://localhost:5000/videos/${type}`);
            console.log(res);
            setVideos(res.data);
        }
        fetchVideos();
    }, [type])

    return (
        <Container>
            {videos.map((video) => <Card key={video._id} video={video} />)}
        </Container>
    )
}

export default Home;