import React from 'react';
import { StyledCard } from './styles';

const Card = ({ children, style }) => {
  return <StyledCard style={style}>{children}</StyledCard>;
};

export default Card;
