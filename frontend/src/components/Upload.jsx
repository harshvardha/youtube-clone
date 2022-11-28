import { useEffect, useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #000000a7;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Wrapper = styled.div`
    width: 600px;
    height: 600px;
    background-color: ${({ theme }) => theme.bgLighter};
    color: ${({ theme }) => theme.text};
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
`;

const Close = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
`;

const Title = styled.h1`
    text-align: center;
`;

const Input = styled.input`
    border: 1px solid ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.text};
    border-radius: 3px;
    padding: 10px;
    background-color: transparent;
`;

const Description = styled.textarea`
    border: 1px solid ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.text};
    border-radius: 3px;
    padding: 10px;
    background-color: transparent;
`;

const Button = styled.button`
    border-radius: 20px;
    border: none;
    padding: 10px 20px;
    font-weight: 700;
    cursor: pointer;
    background-color: #cc1a00;
    color: ${({ theme }) => theme.text};
`;

const Label = styled.label`
    font-size: 14px;
`;

const Upload = ({ setOpen }) => {
    const [image, setImage] = useState(undefined);
    const [video, setVideo] = useState(undefined);
    const [imagePercentage, setImagePercentage] = useState(0);
    const [videoPercentage, setVideoPercentage] = useState(0);
    const [inputs, setInputs] = useState({});
    const [tags, setTags] = useState([]);
    const navigateTo = useNavigate()

    const handleTags = (event) => {
        setTags(event.target.value.split(","));
    }

    const handleChange = (event) => {
        setInputs(prev => {
            return { ...prev, [event.target.name]: event.target.value };
        });
    }

    const uploadFile = (file, urlType) => {
        const storage = getStorage();
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                urlType === "imageUrl" ? setImagePercentage(Math.round(progress)) : setVideoPercentage(Math.round(progress));
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        break;
                }
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downlaodUrl) => {
                    setInputs((prev) => {
                        return { ...prev, [urlType]: downlaodUrl };
                    })
                })
            }
        );
    }

    useEffect(() => {
        video && uploadFile(video, "videoUrl");
    }, [video]);

    useEffect(() => {
        image && uploadFile(image, "imageUrl");
    }, [image])

    const handleUpload = async (event) => {
        event.preventDefault();
        const res = await axios.post("/video", { ...inputs, tags });
        setOpen(false);
        res.status === 200 && navigateTo(`/video/${res.data._id}`);
    }

    return (
        <Container>
            <Wrapper>
                <Close onClick={() => setOpen(false)}>X</Close>
                <Title>Upload a New Video</Title>
                <Label>Video: </Label>
                {videoPercentage > 0 ? (
                    "Uploading: " + videoPercentage
                ) : (
                    <Input type="file" accept="video/*" onChange={(event) => setVideo(event.target.files[0])} />
                )}
                <Input type="text" placeholder="Title" onChange={handleChange} name="title" />
                <Description placeholder="Description" rows={8} onChange={handleChange} name="description" />
                <Input type="text" placeholder="Separate the tags with commas." onChange={handleTags} />
                <Label>Image: </Label>
                {imagePercentage > 0 ? (
                    "Uploading: " + imagePercentage
                ) : (
                    <Input type="file" accept="image/*" onChange={(event) => setImage(event.target.files[0])} />
                )}
                <Button>Upload</Button>
            </Wrapper>
        </Container>
    )
}

export default Upload;