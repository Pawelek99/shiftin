import styled, { css } from 'styled-components';

export const StyledButton = styled.button`
  padding: 10px 30px;
  border-radius: 5px;
  outline-color: #3f51b555;
  font-size: 1rem;
  font-weight: 300;
  cursor: pointer;

  ${({ secondary }) =>
    secondary
      ? css`
          border: 1px solid ${({ color }) => color};
          background: transparent;
          color: ${({ color }) => color};
        `
      : css`
          background: ${({ color }) => color};
          border: none;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
          color: #ffffff;
        `};

  ${({ disabled }) =>
    disabled &&
    css`
      filter: grayscale(0.3);
      opacity: 0.3;
      cursor: not-allowed;
    `};
`;
