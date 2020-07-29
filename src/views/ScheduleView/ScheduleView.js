import React, { useState, useEffect } from 'react';
import {
  Wrapper,
  Card,
  List,
  ListItem,
  Schedule,
  ScheduleRow,
  ScheduleEntry,
  Loader,
  LoaderWrapper,
} from './styles';
import { getDay, getMonthWorkingHours, weekdays } from '../../utils';
import TopBar from '../../components/TopBar/TopBar';
import generator_worker from '../../utils/generator_worker.js';
import WebWorker from '../../utils/WebWorker';

const ScheduleView = () => {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(0);
  const [shifts, setShifts] = useState();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('data'));
    setCurrentMonth(data.date.month);
    setCurrentYear(data.date.year);

    const hoursLeft = getMonthWorkingHours(
      data.date.month,
      data.date.year,
      data.daysOff
    )[1];
    const employees = data.employees.map((employee) => ({
      name: employee.name,
      daysOff: employee.daysOff,
      hours: 0,
      hoursLeft: hoursLeft - (employee.overtime || 0),
      overtime: employee.overtime || 0,
      daysOffLeft: 8,
    }));

    const shiftArrangements = [];
    data.shifts.forEach((shift) =>
      shiftArrangements.push(...Array(shift.people).fill(shift.hours))
    );
    shiftArrangements.push(
      ...Array(employees.length - shiftArrangements.length).fill(0)
    );

    const worker = new WebWorker(generator_worker);
    worker.postMessage({
      employees,
      inputDate: data.date,
      daysOff: data.daysOff,
      shiftArrangements: shiftArrangements.sort((a, b) => a - b),
    });

    worker.addEventListener('message', (output) =>
      setShifts(output.data.employees)
    );
  }, []);

  return (
    <Wrapper>
      <TopBar />
      {shifts ? (
        <>
          <Card
            style={{
              width: '100%',
              boxShadow: 'none',
            }}>
            <List>
              <ListItem></ListItem>
              {shifts.map((shift, i) => (
                <ListItem
                  key={i}
                  style={{
                    background: i % 2 === 0 ? '#fafafa' : '#ffffff',
                  }}>
                  {shift.name} ({shift.hours})
                </ListItem>
              ))}
            </List>
            <Schedule>
              <ScheduleRow>
                {Object.keys(shifts[0][currentMonth]).map((day, i) => (
                  <ScheduleEntry
                    header
                    key={i}
                    day={getDay(day, currentMonth, currentYear)}>
                    <span>
                      {day < 10 && '0'}
                      {day}
                    </span>
                    <span style={{ fontSize: '0.8rem' }}>
                      {weekdays[getDay(day, currentMonth, currentYear)].slice(
                        0,
                        3
                      )}
                    </span>
                  </ScheduleEntry>
                ))}
              </ScheduleRow>
              {shifts.map((shift, i) => (
                <ScheduleRow key={i}>
                  {Object.values(shift[currentMonth]).map((hour, j) => (
                    <ScheduleEntry
                      key={j}
                      style={{
                        background: i % 2 === 0 ? '#fafafa' : '#ffffff',
                      }}
                      day={getDay(j + 1, currentMonth, currentYear)}>
                      <span>
                        {(shift.daysOff || []).includes(j + 1)
                          ? '-'
                          : hour === 0
                          ? ''
                          : hour}
                      </span>
                    </ScheduleEntry>
                  ))}
                </ScheduleRow>
              ))}
            </Schedule>
          </Card>
        </>
      ) : (
        <LoaderWrapper>
          <Loader>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </Loader>
          <span style={{ textAlign: 'center', justifySelf: 'center' }}>
            Trwa konsultowanie z pracownikami
          </span>
        </LoaderWrapper>
      )}
    </Wrapper>
  );
};

export default ScheduleView;
