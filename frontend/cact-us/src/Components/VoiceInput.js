import { useReactMediaRecorder } from 'react-media-recorder';
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import TryMe from '../Assets/TryMe.png';
import StopRecording from '../Assets/StopRecording.png';
import TalktoMe from '../Assets/TalktoMe.png';

const VoiceInput = ({growthPoints, refreshGrowthPoints, setUserTextBubble, userLoggedIn, setUserLoggedIn, setDumbCactus}) => {
	const [isLoading, setLoading] = useState(false);
    const [hasTried, setHasTried] = useState(false);
	const { status, startRecording, stopRecording } =
		useReactMediaRecorder({
			audio: true,
			mediaRecorderOptions: {
				type: 'audio/wav; codecs=opus',
			},
			onStop: (blobUrl, blob) => {
				setLoading(true);
                setHasTried(true);
				console.log(blobUrl);
				const audiofile = new File([blob], 'audiofile.wav', {
					type: 'audio/wav',
				});
				console.log(audiofile);
                console.log(audiofile.size);
				const formData = new FormData();
				formData.append('file', audiofile);

                // axios post to retrieve speech-to-text response
				axios
					.post('http://localhost:8080/api/speech', formData, {withCredentials: true})
					.then((res) => {
						console.log(res.data);
                        if (res.data.text.includes("dumb cactus")) {setDumbCactus(true)};
                        setUserTextBubble(res.data.text);
                        console.log("score increment from newest audio file: ");
                        console.log(res.data.score*Math.floor(audiofile.size/5000));
                        console.log("expected new score: ");
                        console.log(parseInt(growthPoints+res.data.score*Math.floor(audiofile.size/5000)));
                        refreshGrowthPoints(growthPoints+res.data.score*Math.floor(audiofile.size/5000));
					})
					.catch((error) => {
						console.log(error);
					});
				setLoading(false);
			},
		});

	const TryButton = styled.img`
        width: auto;
		min-width: 158px;
		height: 52px;
		vertical-align: baseline;
		cursor: pointer;
	`;

	return (
		<div>
			{status === 'recording' ? (
				<TryButton
                    style={{display: 'inline-block', marginLeft: '50px'}}
					src={StopRecording}
					disabled={isLoading}
					onClick={!isLoading ? stopRecording : null}
				>
				</TryButton>
			) : (
				<TryButton style={{display: 'inline-block', marginLeft: '50px'}} src={hasTried ? TalktoMe : TryMe} onClick={startRecording} />
			)}
		</div>
	);
};

export default VoiceInput;
