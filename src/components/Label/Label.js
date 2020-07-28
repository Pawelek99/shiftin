import React from 'react';
import { StyledLabel } from './styles';

const Label = ({ style, children }) => {
  return <StyledLabel style={style}>{children}</StyledLabel>;
};

export default Label;
