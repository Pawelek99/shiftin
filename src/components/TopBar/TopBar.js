import React from 'react';
import { StyledTopBar, Img, Icon } from './styles';
import logoImg from '../../files/logo.svg';
import settingsImg from '../../files/settings.svg';

const TopBar = () => {
  return (
    <StyledTopBar>
      <Img src={logoImg} />
      <Icon src={settingsImg} />
    </StyledTopBar>
  );
};

export default TopBar;
