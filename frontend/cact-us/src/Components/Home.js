import React from 'react';
import styled from 'styled-components';
import seed from '../Assets/Seed.png';
import login from '../Assets/Login.png';
import VoiceInput from './VoiceInput.js';

const HomeContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const PromptContainer = styled.div``;

const Prompt = styled.h1`
	font-family: Montserrat;
	font-size: 50px;
	text-align: center;
	color: #a4e85a;
`;

const LoginButton = styled.button`
	background-color: #a4e85a;
	border: none;
	border-radius: 28px;
	cursor: pointer;
	font-size: 17px;
	padding: 16px 31px;
`;

const Seed = styled.img`
	width: 300px;
	height: 300px;
`;

const Login = styled.img`
	width: 220px;
	height: 40px;
`;

function Home() {
	return (
		<HomeContainer>
			<PromptContainer>
				<Prompt>Welcome to Cact-Us</Prompt>
			</PromptContainer>
			<Seed src={seed} />
			<Login src={login} />
			<VoiceInput></VoiceInput>
		</HomeContainer>
	);
}

export default Home;
