import React from 'react';
import styled from 'styled-components';
import { IonPhaser } from '@ion-phaser/react';

import game from './game';

const Main = styled.main`
  position: relative;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const App = () => {

  return (
    <Main>
      <IonPhaser  game={game} initialize={true}/>
    </Main>
  );
};

export default App;
