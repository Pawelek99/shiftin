import styled from 'styled-components';

export const StyledInput = styled.input`
  width: 100%;
  height: 50px;
  font-size: 1rem;
  color: #515151;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  outline-color: #3f51b555;
  outline-width: 0.5px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
`;

export const InputWrapper = styled.div`
  position: relative;

  button {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translate(0, -50%);
  }
`;
