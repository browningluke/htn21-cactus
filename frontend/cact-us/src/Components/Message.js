import React from 'react';
import styled from 'styled-components';
import TextLoop from 'react-text-loop';

const MessageBox = styled.div`
	width: auto;
	min-width: 250px;
	height: 80px;
	background-color: #99c0ff;
	padding: 20px;
	border-radius: 10px;
`;

const Message = () => {
	return (
		<MessageBox>
			<TextLoop
				children={[
					'I am feeling a little dry!!',
					'Need some sunshine here!',
					'I am in a prickly situation!',
					'I\'m just a dumb little cactus.. :(',
					'Sometimes I don\'t believe in myself.',
					'I could use a little boost!',
					'Water me with positivity, will you?',
					'It gets a little lonely up on this screen..',
					'My friends back home call me Dumb Cactus..',
					'I would really appreciate some comfort right now.'
				]}
			/>
		</MessageBox>
	);
};

export default Message;
