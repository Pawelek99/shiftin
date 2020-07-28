import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background: #efefef;
`;

export const CenteredWrapper = styled.div`
  width: 100%;
  height: 100%;
  max-width: 720px;
  flex: 1;
  display: flex;
  align-self: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const RowWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-self: flex-end;
  margin-top: 50px;

  button:first-child {
    margin-right: 20px;
  }
`;

export const ListItemWrapper = styled.div`
  position: relative;
  margin-bottom: 5px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  min-height: 50px;
  transition: all 0.3s;
  font-size: 1rem;

  ${({ expanded }) =>
    expanded
      ? css`
          background: #ffffff;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
          min-height: 200px;
        `
      : css`
          background: #efefef;
        `};
`;

export const CollapsedItemWrapper = styled.div`
  cursor: pointer;
  padding: calc((50px - 1rem) / 2);
  align-items: center;
  display: flex;

  > span {
    margin: 0 10px;
  }
`;

export const ExtendedItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 calc((50px - 1rem) / 2);
  padding-bottom: calc((50px - 1rem) / 2);

  > span {
    font-size: 0.8rem;
    margin: calc((50px - 1rem) / 2);
  }
`;

export const ImgButton = styled.img`
  position: absolute;
  width: 16px;
  height: 16px;
  right: 10px;
  top: 17px;
  background: url(${({ img }) => img});
  cursor: pointer;
  transition: transform 0.3s;
`;
