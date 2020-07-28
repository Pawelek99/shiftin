import React, { useState, useEffect } from 'react';
import { StyledMonthPicker, ImgParagraph } from './styles';
import { monthNames } from '../../utils';
import arrowDownImg from '../../files/arrow_down.svg';
import Menu from '../Menu/Menu';

const MonthPicker = ({ style, children, onChanged, date }) => {
  const [popup, setPopup] = useState();
  const [year, setYear] = useState(0);
  const [month, setMonth] = useState(0);

  useEffect(() => {
    const currentDate = date ? new Date(date.year, date.month) : new Date();
    setYear(currentDate.getFullYear());
    setMonth(currentDate.getMonth());
  }, [date]);

  return (
    <StyledMonthPicker style={style}>
      {children}
      <ImgParagraph
        img={arrowDownImg}
        onClick={(e) =>
          setPopup({
            target: e.target,
            items: Array(10)
              .fill(new Date().getFullYear())
              .map((v, i) => v + i),
            onClick: (i) => {
              setYear(new Date().getFullYear() + i);
              onChanged &&
                onChanged({ year: new Date().getFullYear() + i, month });
              setPopup();
            },
            onDismiss: () => setPopup(),
          })
        }>
        {year}
      </ImgParagraph>
      <ImgParagraph
        img={arrowDownImg}
        onClick={(e) =>
          setPopup({
            target: e.target,
            items: monthNames,
            onClick: (i) => {
              setMonth(i);
              onChanged && onChanged({ year, month: i });
              setPopup();
            },
            onDismiss: () => setPopup(),
          })
        }>
        {monthNames[month]}
      </ImgParagraph>
      {popup && (
        <Menu
          target={popup.target}
          items={popup.items}
          onClick={popup.onClick}
          onDismiss={popup.onDismiss}
        />
      )}
    </StyledMonthPicker>
  );
};

export default MonthPicker;
