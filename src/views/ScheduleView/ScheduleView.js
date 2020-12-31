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
  StyledOptions,
  StyledOptionItem,
} from './styles';
import {
  getDay,
  getMonthWorkingHours,
  getMonthDays,
  weekdays,
} from '../../utils';
import TopBar from '../../components/TopBar/TopBar';
import Button from '../../components/Button/Button';
import exportAsExcel from 'js-export-excel';

const availableShifts = (callback) => [
  {
    name: '6:00 - 14:00',
    callback: () =>
      callback({
        duration: 8,
        start: 6,
        end: 14,
      }),
  },
  {
    name: '8:00 - 16:00',
    callback: () =>
      callback({
        duration: 8,
        start: 8,
        end: 16,
      }),
  },
  {
    name: '12:00 - 21:00',
    callback: () =>
      callback({
        duration: 9,
        start: 12,
        end: 21,
      }),
  },
  {
    name: 'Day off',
    callback: () =>
      callback({
        duration: 0,
        start: 0,
        end: 0,
      }),
  },
];

const ScheduleView = () => {
  const [showingOptions, setShowingOptions] = useState();
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [shifts, setShifts] = useState();

  // const startWorker = (input) => {
  //   const worker = new WebWorker(generator_worker);
  //   worker.postMessage(input);

  //   const interval = setInterval(() => {
  //     worker.terminate();
  //     worker.postMessage(input);
  //     setAttempts((a) => a + 1);
  //   }, 3000);

  //   worker.addEventListener('message', (output) => {
  //     interval && clearInterval(interval);
  //     setShifts(output.data);
  //   });
  // };

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
      [data.date.month]: new Array(
        getMonthDays(data.date.month, data.date.year) + 1
      )
        .fill(0)
        .map(() => {
          const duration = Math.round(Math.random() * 4) * 3;
          const start = Math.round(Math.random() * 4 + 6);
          return {
            duration,
            start,
            end: start + duration,
          };
        }),
    }));

    setShifts(employees);

    // const shiftArrangements = [];
    // data.shifts.forEach((shift) =>
    //   shiftArrangements.push(...Array(shift.people).fill(shift.hours))
    // );
    // shiftArrangements.push(
    //   ...Array(employees.length - shiftArrangements.length).fill(0)
    // );

    // startWorker({
    //   employees,
    //   inputDate: data.date,
    //   daysOff: data.daysOff,
    //   shiftArrangements: shiftArrangements.sort((a, b) => a - b),
    // });
  }, []);

  return (
    <Wrapper
      onClick={() =>
        showingOptions && setShowingOptions({ ...showingOptions, exit: true })
      }>
      <TopBar />
      {shifts ? (
        <>
          <Card
            style={{
              width: '100%',
              height: 'calc(100vh - 60px)',
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
              <Button style={{ margin: '10px 20px' }}>Dodaj</Button>
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
                    <span style={{ fontSize: '0.8rem', marginBottom: '5px' }}>
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
                      day={getDay(j + 1, currentMonth, currentYear)}
                      onClick={(e) =>
                        setShowingOptions({
                          pos: { x: e.clientX, y: e.clientY },
                          callback: (temp) => {
                            shift[currentMonth][j] = temp;
                          },
                        })
                      }>
                      {(shift.daysOff || []).includes(j + 1) ? (
                        <span>-</span>
                      ) : hour.duration > 0 ? (
                        <>
                          <span>{hour.duration}</span>
                          <span>
                            {hour.start} - {hour.end}
                          </span>
                        </>
                      ) : (
                        <span />
                      )}
                    </ScheduleEntry>
                  ))}
                </ScheduleRow>
              ))}
            </Schedule>
            {showingOptions && (
              <StyledOptions
                pos={showingOptions.pos}
                exit={showingOptions.exit}
                onAnimationEnd={() =>
                  showingOptions.exit && setShowingOptions()
                }>
                {availableShifts(showingOptions.callback).map((option) => (
                  <StyledOptionItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowingOptions();
                      option.callback();
                    }}>
                    {option.name}
                  </StyledOptionItem>
                ))}
              </StyledOptions>
            )}
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
