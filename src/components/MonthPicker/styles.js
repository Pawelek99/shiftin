import styled from 'styled-components';

export const StyledMonthPicker = styled.div`
  width: 100%;
  height: 50px;
  background: #ffffff;
  border-radius: 5px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 10px 15px;
`;

export const ImgParagraph = styled.p`
  position: relative;
  display: inline-block;
  color: #515151;
  padding: 5px 31px 5px 10px;
  border-radius: 5px;
  margin: 0 10px;
  background: #3f51b51f;
  cursor: pointer;

  &:after {
    content: '';
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url(${({ img }) => img});
    position: absolute;
    top: 50%;
    margin-left: 5px;
    transform: translate(0, -50%);
  }
`;

export const Paragraph = styled.p`
  color: #515151;
  font-size: 1rem;
`;
