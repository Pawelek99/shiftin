import styled, { css, keyframes } from 'styled-components';

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

const anim1 = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;
const anim2 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
`;
const anim3 = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`;

export const Loader = styled.div`
  justify-self: center;
  align-self: center;
  display: inline-flex;
  position: relative;
  width: 80px;
  height: 12px;

  div {
    position: absolute;
    top: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ababab;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);

    &:nth-child(1) {
      left: 10px;
      animation: ${anim1} 0.6s infinite;
    }
    &:nth-child(2) {
      left: 10px;
      animation: ${anim2} 0.6s infinite;
    }
    &:nth-child(3) {
      left: 34px;
      animation: ${anim2} 0.6s infinite;
    }
    &:nth-child(4) {
      left: 58px;
      animation: ${anim3} 0.6s infinite;
    }
  }
`;

export const LoaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    margin-top: 20px;
  }
`;
