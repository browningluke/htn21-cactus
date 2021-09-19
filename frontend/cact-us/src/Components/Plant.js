import React from 'react';
import styled from 'styled-components';
import Seed from '../Assets/Seed.png';
import Cactus1 from '../Assets/Cactus1.png';
import Cactus2 from '../Assets/Cactus2.png';
import Cactus3 from '../Assets/Cactus3.png';

const PlantImg = styled.img`
	width: 152px;
	height: 175px;
	margin-top: 50px;
`;

const Plant = () => {
	const score = 75;
	if (score < 25) {
		return <PlantImg src={Seed} />;
	} else if (score >= 25 && score < 50) {
		return <PlantImg src={Cactus1} />;
	} else if (score >= 50 && score < 75) {
		return <PlantImg src={Cactus2} />;
	} else {
		return <PlantImg src={Cactus3} />;
	}
};

export default Plant;
