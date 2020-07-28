import React, { useState } from 'react';
import { StyledInput, InputWrapper } from './styles';
import Button from '../Button/Button';
import Label from '../Label/Label';

const Input = ({ style, label, action, actionCallback }) => {
  const [input, setInput] = useState('');

  return (
    <div style={style}>
      <Label>{label}</Label>
      <InputWrapper>
        <StyledInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.which === 13) {
              actionCallback && actionCallback(input);
              setInput('');
            }
          }}
        />
        {action && (
          <Button
            onClick={() => {
              actionCallback && actionCallback(input);
              setInput('');
            }}>
            {action}
          </Button>
        )}
      </InputWrapper>
    </div>
  );
};

export default Input;
