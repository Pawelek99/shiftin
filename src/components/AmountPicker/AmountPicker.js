import React, { useState, useEffect } from 'react';
import { StyledAmountPicker, AmountWrapper } from './styles';
import arrowDownImg from '../../files/arrow_down.svg';
import { ImgParagraph, Paragraph } from '../MonthPicker/styles';
import Menu from '../Menu/Menu';
import { useForceUpdate } from '../utils';

const AmountPicker = ({
  elevated,
  style,
  children,
  items = [{ min: 0, max: () => 10, value: 0 }],
  onChanged,
}) => {
  const [popup, setPopup] = useState();
  const forceUpdate = useForceUpdate();
  const [amounts, setAmounts] = useState([]);

  useEffect(() => {
    setAmounts(
      items.map((item) => ({
        ...item,
        value: (item.value = item.value || item.min),
      }))
    );
    forceUpdate();
  }, [items, forceUpdate]);

  return (
    <StyledAmountPicker style={style} elevated={elevated}>
      {children}
      {amounts.map((item, index) => (
        <AmountWrapper key={index}>
          {item.value !== undefined && (
            <ImgParagraph
              img={arrowDownImg}
              onClick={(e) =>
                setPopup({
                  target: e.target,
                  items: Array(item.max() - item.min + 1)
                    .fill(item.min)
                    .map((v, i) => v + i),
                  onClick: (i) => {
                    item.value = i + item.min;
                    onChanged &&
                      onChanged(amounts.map((amount) => amount.value));
                    setPopup();
                  },
                  onDismiss: () => setPopup(),
                })
              }>
              {item.value}
            </ImgParagraph>
          )}
          {item.label && <Paragraph>{item.label(item.value)}</Paragraph>}
        </AmountWrapper>
      ))}
      {popup && (
        <Menu
          target={popup.target}
          items={popup.items}
          onClick={popup.onClick}
          onDismiss={popup.onDismiss}
        />
      )}
    </StyledAmountPicker>
  );
};

export default AmountPicker;
