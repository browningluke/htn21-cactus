import React from 'react'
import styled from 'styled-components'
import Button from 'react-bootstrap/Button'

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
        </div>
    )
}

export default Home;
