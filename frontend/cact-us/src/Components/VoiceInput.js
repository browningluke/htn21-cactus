import { useReactMediaRecorder } from 'react-media-recorder';
import React, { useState } from 'react';
import Button from 'react-bootstrap/button';
import styled from 'styled-components';
import axios from 'axios';
import TryMe from '../Assets/TryMe.png';

const RecordView = () => {
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
				setLoading(false);
			},
		});

	const TryButton = styled.img`
		width: 158px;
		height: 52px;
		vertical-align: baseline;
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
		</div>
	);
};

export default RecordView;
