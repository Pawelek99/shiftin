import React, { useState, useEffect, useCallback } from 'react';
import { StyledCalendar, StyledTitle, Entry } from './styles';
import {
  monthNames,
  weekdays,
  getMonthDays,
  getMonthWorkingHours,
} from '../../utils';

const useForceUpdate = () => {
  const [, updateState] = useState();
  return useCallback(() => updateState({}), []);
};

const Calendar = ({ style, small, inputDate, daysOff, onChanged }) => {
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [days, setDays] = useState([]);
  const forceUpdate = useForceUpdate();

  const getSelectedDays = (days) => {
    return days.filter((day) => day.selected).map((day) => day.value);
  };

  useEffect(() => {
    const date = inputDate
      ? new Date(inputDate.year, inputDate.month)
      : new Date();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    setYear(currentYear);
    setMonth(currentMonth);

    const days = [];

    date.setDate(1);
    for (let i = (date.getDay() + 6) % 7; i > 0; i--) {
      date.setDate(date.getDate() - 1);
      days.unshift({
        value: date.getDate(),
        selected: false,
        current: false,
      });
    }
    date.setFullYear(currentYear, currentMonth, 1);
    days.push(
      ...Array(getMonthDays(currentMonth, currentYear))
        .fill(0)
        .map((_, i) => {
          date.setDate(i + 1);
          return {
            value: i + 1,
            selected:
              (!daysOff && date.getDay() === 0) ||
              (daysOff && daysOff.includes(i + 1)),
            current: true,
          };
        })
    );

    date.setMonth(currentMonth + 1, 0);
    for (let i = 6 - ((date.getDay() + 6) % 7); i > 0; i--) {
      date.setDate(date.getDate() + 1);
      days.push({
        value: date.getDate(),
        selected: false,
        current: false,
      });
    }

    setDays(days);

    onChanged && onChanged(getSelectedDays(days));
    // eslint-disable-next-line
  }, [inputDate, onChanged]);

  return (
    <StyledCalendar style={style} small={small}>
      <StyledTitle>
        {year} | {monthNames[month]} (
        {getMonthWorkingHours(inputDate.month, inputDate.year, daysOff).join(
          ', '
        )}
        )
      </StyledTitle>
      {[...weekdays.slice(1), weekdays[0]].map((weekday, i) => (
        <Entry
          style={{ fontWeight: 600, color: '#ababab', cursor: 'auto' }}
          small={small}
          key={i}>
          {weekday.slice(0, 3)}
        </Entry>
      ))}
      {days.map((day, i) => (
        <Entry
          key={i}
          selected={day.selected}
          current={day.current}
          small={small}
          onClick={() => {
            day.selected = day.current && !day.selected;
            forceUpdate();
            onChanged && onChanged(getSelectedDays(days));
          }}>
          {day.value}
        </Entry>
      ))}
    </StyledCalendar>
  );
};

export default Calendar;
