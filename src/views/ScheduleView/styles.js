import styled, { css, keyframes } from 'styled-components';

const enterAnimation = keyframes`
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
`;

const exitAnimation = keyframes`
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
`;

export const Wrapper = styled.div`
  background: #efefef;
  width: 100%;
  height: 100%;
  min-height: 100vh;
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
  flex: 0;
  flex-direction: column;
  box-shadow: 0 4px 10px 5px rgba(0, 0, 0, 0.03);
  z-index: 2;
`;

export const ListItem = styled.div`
  width: 200px;
  height: 80px;
  line-height: 80px;
  padding: 0 20px;
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
  height: 80px;
  display: inline-flex;
`;

export const ScheduleEntry = styled.div`
  width: 80px;
  height: 80px;
  font-weight: ${({ header }) => (header ? 400 : 600)};
  display: inline-flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border: 1px solid #efefef;
  transition: border 0.3s;
  ${({ header }) =>
    header &&
    css`
      border-bottom-width: 5px;
    `};

  ${({ header }) =>
    !header &&
    css`
      cursor: pointer;
      &:hover {
        border: 1px solid #3f51b5;
      }
    `};

  * {
    color: ${({ day }) =>
      day === 0 ? '#f53b3b' : day === 6 ? '#ababab' : '#515151'};
    align-self: center;
    justify-self: center;
    font-size: 1.2rem;

    &:last-child {
      font-size: 0.8rem;
      color: #ababab;
      font-weight: 400;
    }
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

export const StyledOptions = styled.div`
  position: absolute;
  top: ${({ pos }) => (pos ? pos.y + 'px' : '15px')};
  left: ${({ pos }) => (pos ? pos.x + 'px' : '15px')};
  padding: 10px 0;
  background-color: #ffffff;
  box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.05);
  z-index: 50;

  animation-name: ${({ exit }) => (exit ? exitAnimation : enterAnimation)};
  animation-duration: 0.3s;
  animation-timing-function: ease;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: forwards;
  animation-play-state: running;
`;

export const StyledOptionItem = styled.p`
  margin-block-start: 0;
  margin-block-end: 0;
  padding: 5px 10px;
  cursor: pointer;
  background-color: #ffffff;
  transition: 0.3s background-color;

  &:hover {
    background-color: #efefef;
  }
`;
