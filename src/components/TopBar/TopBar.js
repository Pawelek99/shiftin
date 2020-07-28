import React from 'react';
import { StyledTopBar, Img } from './styles';
import logoImg from '../../files/logo.svg';

const TopBar = () => {
  return (
    <StyledTopBar>
      <Img src={logoImg} />
    </StyledTopBar>
  );
};

export default TopBar;
