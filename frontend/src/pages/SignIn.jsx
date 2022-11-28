import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 56px);
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${({ theme }) => theme.bgLighter};
    border: 1px solid ${({ theme }) => theme.soft};
    padding: 20px 50px;
    gap: 10px;
`;

const Title = styled.h1`
    font-size: 24px;
    color: ${({ theme }) => theme.text};
`;

const SubTitle = styled.h2`
    font-size: 20px;
    font-weight: 300;
    color: ${({ theme }) => theme.text};
`;

const Input = styled.input`
    border-radius: 20px;
    border: 2px solid ${({ theme }) => theme.bg};
    padding: 10px;
    background-color: transparent;
    width: 100%;
    color: ${({ theme }) => theme.text};
    font-size: 15px;
`;

const Button = styled.button`
    border-radius: 20px;
    border:none;
    padding: 10px 20px;
    font-weight: 500;
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
    display: flex;
    margin-top: 10px;
    font-size: 12px;
    color: ${({ theme }) => theme.text};
`;

const Links = styled.div`
    display: flex;
    column-gap: 20px;
    margin-left: 70px;
`;

const Link = styled.span`
    color: ${({ theme }) => theme.text};
`;

const SignIn = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const handleLogin = async (event) => {
        event.preventDefault();
        dispatch(loginStart());
        try {
            const res = await axios.post("http://localhost:5000/authentication/signin", { name, password })
            console.log(res);
            dispatch(loginSuccess(res.data));
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const signInWithGoogle = async () => {
        dispatch(loginStart());
        signInWithPopup(auth, provider)
            .then(result => {
                axios.post("http://localhost:5000/authentication/google", {
                    name: result.user.displayName,
                    email: result.user.email,
                    image: result.user.photoURL
                }).then(res => {
                    dispatch(loginSuccess(res.data));
                })
            })
            .catch(error => {
                console.log(error);
                dispatch(loginFailure());
            })
    }

    return (
        <Container>
            <Wrapper>
                <Title>Sign in</Title>
                <SubTitle>to continue to YouTube</SubTitle>
                <Input placeholder="username" onChange={(event) => setName(event.target.value)} />
                <Input type="password" placeholder="password" onChange={(event) => setPassword(event.target.value)} />
                <Button onClick={handleLogin}>Sign in</Button>
                <Title>or</Title>
                <Button onClick={signInWithGoogle}>Signin with Google</Button>
                <Title>or</Title>
                <Input placeholder="username" onChange={(event) => setName(event.target.value)} />
                <Input type="email" placeholder="email" onChange={(event) => setEmail(event.target.value)} />
                <Input type="password" placeholder="password" onChange={(event) => setPassword(event.target.value)} />
                <Button onClick={handleLogin}>Sign up</Button>
            </Wrapper>
            <More>
                English(IND)
                <Links>
                    <Link>Help</Link>
                    <Link>Privacy</Link>
                    <Link>Terms</Link>
                </Links>
            </More>
        </Container>
    )
}

export default SignIn;