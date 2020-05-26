import React, {useState} from 'react';
import styled from 'styled-components';
import { IonPhaser } from '@ion-phaser/react';

import game from './first-game-classes';
import GameScene from './scenes/GameScene';


const Main = styled.main`
  position: relative;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Counter = styled.span`
  position: absolute;
  font-size: 24px;
  top: 16px;
  left: 16px;
  color: red;
  
`

const App = () => {
  const [count, setCount] = useState(0)
  game.scene = [GameScene.bind(null, count, setCount)]
  return (
    <Main>
      <Counter>{`Score: ${count}`}</Counter>
      <IonPhaser  game={game} initialize={true}/>
    </Main>
  );
};

export default App;
