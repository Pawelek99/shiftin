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
import Button from '../../components/Button/Button';
import generator_worker from '../../utils/generator_worker.js';
import WebWorker from '../../utils/WebWorker';
import exportAsExcel from 'js-export-excel';

const ScheduleView = () => {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [shifts, setShifts] = useState();

  const startWorker = (input) => {
    const worker = new WebWorker(generator_worker);
    worker.postMessage(input);

    const interval = setInterval(() => {
      worker.terminate();
      worker.postMessage(input);
      setAttempts((a) => a + 1);
    }, 3000);

    worker.addEventListener('message', (output) => {
      interval && clearInterval(interval);
      setShifts(output.data);
    });
  };

  const exportFile = () => {
    const options = {
      fileName: `schedule_${currentMonth}_${currentYear}`,
      datas: [
        {
          sheetData: shifts.map((shift) => ({
            name: shift.name,
            ...Object.entries(shift[currentMonth]).map(([key, v]) =>
              v === 0 ? (shift.daysOff.includes(parseInt(key)) ? '-' : '') : v
            ),
            sum: Object.values(shift[currentMonth]).reduce(
              (acc, v) => acc + v,
              0
            ),
          })),
          sheetName: 'Schedule',
          sheetFilter: [
            'name',
            ...Object.keys(shifts[0][currentMonth]).map((key) => key - 1),
            'sum',
          ],
          sheetHeader: [
            '',
            ...Object.keys(shifts[0][currentMonth]).map(
              (day) =>
                `${day < 10 ? `0${day}` : day}.${
                  currentMonth + 1 < 10
                    ? `0${currentMonth + 1}`
                    : currentMonth + 1
                }`
            ),
            'Suma godzin',
          ],
          columnWidths: [
            6,
            ...Object.keys(shifts[0][currentMonth]).map(() => 2),
            6,
          ],
        },
      ],
    };
    new exportAsExcel(options).saveExcel();
  };

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

    startWorker({
      employees,
      inputDate: data.date,
      daysOff: data.daysOff,
      shiftArrangements: shiftArrangements.sort((a, b) => a - b),
    });
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
          <Button
            style={{ margin: '20px', width: '200px', alignSelf: 'center' }}
            onClick={() => exportFile()}>
            Export
          </Button>
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
            {Array((attempts % 3) + 1)
              .fill('.')
              .join('')}
          </span>
        </LoaderWrapper>
      )}
    </Wrapper>
  );
};

export default ScheduleView;
