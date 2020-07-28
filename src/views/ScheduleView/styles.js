import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  background: #efefef;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Card = styled.div`
  width: 90%;
  display: flex;
  align-self: center;
  flex-direction: row;
  justify-self: center;
  border-radius: 5px;
  box-shadow: 0 4px 10px 5px rgba(0, 0, 0, 0.03);
  background: #ffffff;
  overflow: hidden;
`;

export const List = styled.div`
  width: 200px;
  display: inline-flex;
  flex-direction: column;
  box-shadow: 0 4px 10px 5px rgba(0, 0, 0, 0.03);
  z-index: 2;
`;

export const ListItem = styled.div`
  width: 200px;
  height: 60px;
  padding: 20px;
  font-size: 1.2rem;
  color: #515151;
  border: 1px solid #efefef;
`;

export const Schedule = styled.div`
  height: 100%;
  overflow-x: auto;
  z-index: 0;
`;

export const ScheduleRow = styled.div`
  height: 60px;
  display: inline-flex;
`;

export const ScheduleEntry = styled.div`
  width: 60px;
  height: 60px;
  font-weight: ${({ header }) => (header ? 400 : 600)};
  display: inline-flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border: 1px solid #efefef;
  ${({ header }) =>
    header &&
    css`
      border-bottom-width: 5px;
    `};

  span {
    color: ${({ day }) =>
      day === 0 ? '#f53b3b' : day === 6 ? '#ababab' : '#515151'};
    align-self: center;
    justify-self: center;
  }
`;
