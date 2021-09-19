import React, { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/alert';
import styled from 'styled-components';
import Plant from './Plant.js';
import Login from '../Assets/Login.png';
import Connect from '../Assets/Connect.png';
import Help from '../Assets/Help.png';
import Map from '../Assets/Map.png';
import Settings from '../Assets/Settings.png';
import VoiceInput from './VoiceInput.js';
import GrowthPoints from './GrowthPoints';
import axios from 'axios';
import Message from './Message.js';

const WelcomeContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const TitleContainer = styled.div`
	padding-top: 90px;
	padding-bottom: 70px;
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
	cursor: pointer;
`;

const BottomBar = styled.div`
	display: flex;
	flex-direction: row;
	padding: 20px;
	margin: 30px 0;
`;

const TopBar = styled.div`
	display: flex;
	flex-direction: row;
	padding: 20px;
	justify-content: right;
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

const PlantContainer = styled.div`
	display: flex;
	flex-direction: row;
`;

function Welcome() {
	const [display, setDisplay] = useState(false);
	const [userLoggedIn, setUserLoggedIn] = useState(false);
	const [dumbCactus, setDumbCactus] = useState(false);
	const [userInfo, setUserInfo] = useState({});
	const [userTextBubble, setUserTextBubble] = useState(false);
	const [growthPoints, refreshGrowthPoints] = useState(0);

	useEffect(() => {
		axios.get('http://localhost:8080/api/user', {withCredentials: true})
			.then((res) => {
				console.log(res.data);
				setUserLoggedIn(true);
				setUserInfo(res.data.user);
			})
			.catch((error) => {
				console.log(error);
			});
		// axios post to patch user's current plant's growth points
		axios
			.patch('http://localhost:8080/api/user', {currentPlant: {growth: growthPoints}}, {withCredentials: true})
			.then((res) => {
				console.log("updated score to: " + growthPoints);
				console.log(res.data);
			})
			.catch((error) => {
				console.log(error);
			})
	}, [growthPoints]);

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
			<TopBar>
				<GrowthPoints growthPoints={growthPoints} />
			</TopBar>
			<TitleContainer>
				{!userLoggedIn && (
					<Alert variant={'info'}>
						Please login to Discord to keep track of your dumb cactus' growth!
					</Alert>
				)}
                {display && (
                    <div>
                        Grow your plant by clicking "Try Me!" and saying positive affirmations
                        like "You are not a dumb cactus!"
                    </div>
                )}
				<WelcomeTitle>Welcome to CactUs!</WelcomeTitle>
			</TitleContainer>
			<PlantContainer>
				<Plant score={growthPoints} dumbCactus={dumbCactus}/>
				<Message />
			</PlantContainer>
			<BottomBar>
				{!userLoggedIn ? (
					<a href='http://localhost:8080/auth/discord'>
						{' '}
						<LoginButton src={Login} />
					</a>
				) : (
					<Alert variant={'warning'}>Hello {userInfo.name}!</Alert>
				)}
				<VoiceInput
					growthPoints={growthPoints}
					refreshGrowthPoints={refreshGrowthPoints}
					setUserTextBubble={setUserTextBubble}
					userLoggedIn={userLoggedIn}
					setUserLoggedIn={setUserLoggedIn}
					setDumbCactus={setDumbCactus}
				></VoiceInput>
			</BottomBar>
		</WelcomeContainer>
	);
}

export default Welcome;
