import styled from "styled-components";

const Container = styled.div`
    display: flex;
    gap: 10px;
    margin: 30px 0px;
`;

const Avatar = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
`;

const Details = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Name = styled.span`
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme.text}
`;

const Date = styled.span`
    font-size: 12px;
    font-weight: 400;
    color: ${({ theme }) => theme.textSoft};
    margin-left: 15px;
`;

const Text = styled.span`
    font-size: 14px;
    color: ${({ theme }) => theme.text};
`;

const Comment = () => {
    return (
        <Container>
            <Avatar src="https://yt3.ggpht.com/ytc/AMLnZu80jIF6oehgpUILTaUbqSM5xYHWbPoc_Bz7wddxzg=s68-c-k-c0x00ffffff-no-rj" />
            <Details>
                <Name>
                    Harshvardhan Singh Chauhan<Date>24/11/2022</Date>
                </Name>
                <Text>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, libero perspiciatis quia natus,
                    consectetur rem ipsam molestiae fugiat exercitationem vel nihil, perferendis nobis aut optio quidem
                    quis animi culpa. Similique.
                </Text>
            </Details>
        </Container>
    )
}

export default Comment;