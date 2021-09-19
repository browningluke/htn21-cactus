import React, { useState } from 'react';
import styled from 'styled-components';
import Plant from './Plant.js';
import Login from '../Assets/Login.png';
import Connect from '../Assets/Connect.png';
import Help from '../Assets/Help.png';
import Map from '../Assets/Map.png';
import Settings from '../Assets/Settings.png';
import VoiceInput from './VoiceInput.js';

const WelcomeContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const TitleContainer = styled.div`
	padding-top: 217px;
	padding-bottom: 20px;
`;

const WelcomeTitle = styled.h1`
	font-size: 50px;
	text-align: center;
	color: #a4e85a;
`;

const SideBarContainer = styled.div`
	display: flex;
	flex-direction: column;
	position: absolute;
	top: 0px;
	left: 0px;
	padding: 35px;
`;

const SideButton = styled.img`
	width: 54px;
	height: 54px;
	margin: 10px;
`;

const BottomBar = styled.div`
	display: flex;
	flex-direction: row;
	padding: 20px;
`;

const Button = styled.button`
	border: none;
	cursor: pointer;
	background: none;
`;

const LoginButton = styled.img`
	width: 288px;
	height: 60px;
`;

function Welcome() {
	const [display, setDisplay] = useState(false);
	return (
		<WelcomeContainer>
			<SideBarContainer>
				<Button>
					<SideButton src={Settings} />
				</Button>
				<Button>
					<SideButton src={Map} />
				</Button>
				<Button>
					<SideButton src={Connect} />
				</Button>
				<SideButton
					src={Help}
					onMouseEnter={() => setDisplay(true)}
					onMouseLeave={() => setDisplay(false)}
				/>
			</SideBarContainer>
			<TitleContainer>
				<WelcomeTitle>Welcome to Cact-Us!</WelcomeTitle>
			</TitleContainer>
			<Plant />
			<BottomBar>
				<a href='http://localhost:8080/auth/discord'>
					<LoginButton src={Login} />
				</a>
				<VoiceInput></VoiceInput>
			</BottomBar>
			{display && (
				<div>
					Grow your plant by clicking "Try Me!" and saying positive affirmations
					like "I am grateful all that I have!"
				</div>
			)}
		</WelcomeContainer>
	);
}

export default Welcome;
