import styled, { css } from 'styled-components';

export const StyledAmountPicker = styled.div`
  width: 100%;
  height: 50px;
  border-radius: 5px;
  ${({ elevated }) =>
    elevated
      ? css`
          background: #ffffff;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
        `
      : css`
          background: #efefef;
        `};
  display: flex;
  align-items: center;
  padding: 10px 15px;
`;

export const AmountWrapper = styled.span`
  display: flex;
  align-items: center;
`;
