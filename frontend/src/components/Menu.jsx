import styled from "styled-components";
import youtubeLogo from "../images/youtube-logo.png";
import HomeIcon from "@mui/icons-material/Home";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import MoviesOutlinedIcon from "@mui/icons-material/MovieOutlined";
import NewspaperOutlinedIcon from "@mui/icons-material/NewspaperOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined"
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Container = styled.div`
    flex: 1;
    background-color: ${({ theme }) => theme.bgLighter};
    height: 100%;
    color: ${({ theme }) => theme.text};
    font-size: 20px;
    position: sticky;
    top:0;
`;

const Wrapper = styled.div`
    padding: 18px 26px;
    height: 100%;
`;

const Logo = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: bold;
    margin-bottom: 25px;
`

const Img = styled.img`
    height: 25px;
`

const Item = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    cursor: pointer;
    padding: 7.5px 0px;
    font-size: 15px;
    &:hover {
        background-color: ${({ theme }) => theme.soft};
    }
`

const Hr = styled.hr`
    margin: 15px 0px;
    border: 1px solid ${({ theme }) => theme.soft};
`

const Login = styled.div`
    color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
    padding: 10px 15px;
    background-color: transparent;
    border: 1px solid #3ea6ff;
    color: #3ea6ff;
    border-radius: 3px;
    font-weight: 500;
    margin-top: 10px;
    margin-bottom: 20px;
    cursor: pointer;
    display:flex;
    align-items: center;
    gap:5px;
`

const P = styled.p`
    font-size: 15px;
`

const Title = styled.h2`
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.textSoft};
    margin-bottom: 20px;
`

const Menu = ({ darkMode, setDarkMode }) => {
    const { currentUser } = useSelector(state => state.user);

    return (
        <Container>
            <Wrapper>
                <Link to={"/"} style={{ textDecoration: "none", color: darkMode ? "white" : "black" }}>
                    <Logo>
                        <Img src={youtubeLogo} />
                        YouTube
                    </Logo>
                </Link>
                <Link to={"/"} style={{ textDecoration: "none", color: darkMode ? "white" : "black" }}>
                    <Item>
                        <HomeIcon />
                        Home
                    </Item>
                </Link>
                <Link to={"/trendingVideos"} style={{ textDecoration: "none", color: darkMode ? "white" : "black" }}>
                    <Item>
                        <ExploreOutlinedIcon />
                        Explore
                    </Item>
                </Link>
                <Link to={"/subscriptions"} style={{ textDecoration: "none", color: darkMode ? "white" : "black" }}>
                    <Item>
                        <SubscriptionsOutlinedIcon />
                        Subscriptions
                    </Item>
                </Link>
                <Hr />
                <Item>
                    <VideoLibraryOutlinedIcon />
                    Library
                </Item>
                <Item>
                    <HistoryOutlinedIcon />
                    History
                </Item>
                <Hr />
                {!currentUser &&
                    <>
                        <Login>
                            <P>Sign in to like videos, comment, and subscribe</P>
                            <Link to={"/signin"} style={{ textDecoration: "none" }}>
                                <Button><AccountCircleOutlinedIcon /> SIGN IN</Button>
                            </Link>
                        </Login>
                        <Hr />
                    </>
                }
                <Title>BEST OF YOUTUBE</Title>
                <Item>
                    <LibraryMusicOutlinedIcon />
                    Music
                </Item>
                <Item>
                    <SportsBasketballOutlinedIcon />
                    Sports
                </Item>
                <Item>
                    <SportsEsportsOutlinedIcon />
                    Gaming
                </Item>
                <Item>
                    <MoviesOutlinedIcon />
                    Movies
                </Item>
                <Item>
                    <NewspaperOutlinedIcon />
                    News
                </Item>
                <Item>
                    <LiveTvOutlinedIcon />
                    Live
                </Item>
                <Hr />
                <Item>
                    <SettingsOutlinedIcon />
                    Settings
                </Item>
                <Item>
                    <FlagOutlinedIcon />
                    Report
                </Item>
                <Item>
                    <HelpOutlineOutlinedIcon />
                    Help
                </Item>
                <Item onClick={() => setDarkMode(!darkMode)}>
                    <LightModeOutlinedIcon />
                    {darkMode ? "LightMode" : "DarkMode"}
                </Item>
            </Wrapper>
        </Container>
    )
}

export default Menu;