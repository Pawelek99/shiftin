import styled from 'styled-components';

export const StyledTopBar = styled.div`
  position: sticky;
  top: 0px;
  width: 100%;
  height: 60px;
  min-height: 60px;
  background: #ffffff;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  padding: 0 50px;
  align-items: center;
  z-index: 100;
`;

export const Img = styled.img`
  width: 100px;
`;

export const Icon = styled.img`
  width: 32px;
  height: 32px;
  padding: 4px;
  background: #ffffff;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.3s;

  &:hover {
    background: #efefef;
  }
`;
