import { AccountCircleOutlined, SearchOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
    position: sticky;
    top: 0;
    background-color: ${({ theme }) => theme.bgLighter};
    height: 56px;
`;
const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    padding: 4px 20px;
    position: relative;
    background-color: ${({ theme }) => theme.bgLighter};
`;
const Search = styled.div`
    width: 40%;
    position: absolute;
    left: 0px;
    right: 0px;
    margin: auto;
    display:flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 20px;
    color: ${({ theme }) => theme.text};
`;
const Input = styled.input`
    border: none;
    background-color: transparent;
    outline: none;
    color: ${({ theme }) => theme.text};
    font-size: 15px;
    width: 100%;
`;
const Button = styled.button`
    padding: 5px 15px;
    background-color: transparent;
    border: 1px solid #3ea6ff;
    color: #3ea6ff;
    border-radius: 3px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
`;


const Navbar = () => {
    return (
        <Container>
            <Wrapper>
                <Search>
                    <Input placeholder="Search" />
                    <SearchOutlined />
                </Search>
                <Link to={"/signin"} style={{ textDecoration: "none" }}>
                    <Button>
                        <AccountCircleOutlined />
                        SIGN IN
                    </Button>
                </Link>
            </Wrapper>
        </Container>
    )
}

export default Navbar