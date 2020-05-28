import React from 'react';
import styled from 'styled-components';
import { IonPhaser } from '@ion-phaser/react';

import game from './firstRpgGame'

// import GameScene from './scenes/GameScene';

// import BootScene  from './scenes/BootScene';
// import WorldScene from './scenes/WorldScene';


const Main = styled.main`
  position: relative;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// const Counter = styled.span`
//   position: absolute;
//   font-size: 24px;
//   top: 16px;
//   left: calc(50vw - 380px);
//   color: black;
// `;

const App = () => {
  // const [count, setCount] = useState(0);


  return (
    <Main>
      {/* <Counter>{`Score: ${count}`}</Counter> */}
      <IonPhaser game={game} initialize={true} />
    </Main>
  );
};

export default App;
