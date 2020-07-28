import React from 'react';
import { StyledButton } from './styles';

const Button = ({
  style,
  children,
  secondary,
  color = '#3f51b5',
  disabled,
  onClick,
}) => {
  return (
    <StyledButton
      style={style}
      color={color}
      secondary={secondary}
      disabled={disabled}
      onClick={onClick}>
      {children}
    </StyledButton>
  );
};

export default Button;
