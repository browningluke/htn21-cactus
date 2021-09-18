import React from 'react'
import styled from 'styled-components'
import Button from 'react-bootstrap/Button'
import VoiceInput from './VoiceInput.js'

const Prompt = styled.h1`
    text-align: center;
    //style prompt here
`

const Seed = styled.img`
    //style seed img here
`

function Home() {
    return (
        <div>
            <Prompt>Welcome to Seed</Prompt>
            <Seed></Seed>
            <Button>Login</Button>
            <VoiceInput></VoiceInput>
        </div>
    )
}

export default Home;
