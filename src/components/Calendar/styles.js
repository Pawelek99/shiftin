import styled, { css } from 'styled-components';

export const StyledCalendar = styled.div`
  width: ${({ small }) => (small ? '60%' : '100%')};
  border-radius: 5px;
  border: 1px #efefef solid;
`;

export const StyledTitle = styled.p`
  width: 100%;
  color: #515151;
  font-size: 1rem;
  font-weight: 600;
  padding: 10px 15px;
  text-align: center;
`;

export const Entry = styled.div`
  --size: ${({ small }) => (small ? '32px' : '48px')};
  display: inline-block;
  width: var(--size);
  height: var(--size);
  margin-left: calc((14.25% - var(--size)) / 2);
  margin-right: calc((14.25% - var(--size)) / 2);
  margin-top: 5px;
  margin-bottom: 5px;
  font-size: 0.8rem;
  text-align: center;
  padding: calc((var(--size) - 0.8rem) / 2) 0;
  position: relative;
  z-index: 1;
  border-radius: 50%;
  transition: background 0.3s;
  color: #ababab;

  ${({ current }) =>
    current &&
    css`
      cursor: pointer;
      color: ${({ selected }) => (selected ? '#ffffff' : '#515151')};
    `};

  ${({ selected }) =>
    selected &&
    css`
      background: #b53f3f;
    `};
`;
