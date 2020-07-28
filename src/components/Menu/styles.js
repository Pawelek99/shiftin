import styled from 'styled-components';

export const StyledMenu = styled.div`
  background: #ffffff;
  position: absolute;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  max-height: 300px;
  border-radius: 5px;
  z-index: 10;
`;

export const StyledMenuItem = styled.div`
  padding: 10px 15px;
  cursor: pointer;
  transition: 0.3s background;

  &:hover {
    background: #efefef;
  }
`;
