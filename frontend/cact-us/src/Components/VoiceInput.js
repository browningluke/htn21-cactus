import { useReactMediaRecorder } from 'react-media-recorder';
import React, { useState } from 'react';
import Button from 'react-bootstrap/button';
import Alert from 'react-bootstrap/alert';
import styled from 'styled-components';
import axios from 'axios';
import TryMe from '../Assets/TryMe.png';

const VoiceInput = ({growthPoints, refreshGrowthPoints, setUserTextBubble, userLoggedIn, setUserLoggedIn}) => {
	const [isLoading, setLoading] = useState(false);
	const { status, startRecording, stopRecording, mediaBlobUrl } =
		useReactMediaRecorder({
			audio: true,
			mediaRecorderOptions: {
				type: 'audio/wav; codecs=opus',
			},
			onStop: (blobUrl, blob) => {
				setLoading(true);
				console.log(blobUrl);
				const audiofile = new File([blob], 'audiofile.wav', {
					type: 'audio/wav',
				});
				console.log(audiofile);
				const formData = new FormData();
				formData.append('file', audiofile);

				axios
					.post('http://localhost:8080/api/speech', formData)
					.then((res) => {
						console.log(res.data);
					})
					.catch((error) => {
						console.log(error);
					});
                
                axios
					.get('http://localhost:8080/api/user', {withCredentials: true})
					.then((res) => {
						console.log(res.data);
                        //setUserTextBubble(res.data.text);
                        refreshGrowthPoints(res.data.user.currentPlant.growth);
					})
                
				setLoading(false);
			},
		});

	const TryButton = styled.img`
		width: 158px;
		height: 52px;
		vertical-align: baseline;
		cursor: pointer;
	`;

	return (
		<div>
			{status === 'recording' ? (
				<Button
					src={TryMe}
					disabled={isLoading}
					onClick={!isLoading ? stopRecording : null}
				>
					Stop Recording
				</Button>
			) : (
				<TryButton src={TryMe} onClick={startRecording} />
			)}
			{mediaBlobUrl != null && <audio src={mediaBlobUrl} controls />}
            {!userLoggedIn && <Alert style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "fixed"
            }}variant={'info'}>Please login to Discord to keep track of your dumb cactus' growth!</Alert>}
		</div>
	);
};

export default VoiceInput;
