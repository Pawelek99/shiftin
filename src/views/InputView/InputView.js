import React, { useState, useEffect } from 'react';
import {
  CenteredWrapper,
  Wrapper,
  RowWrapper,
  ImgButton,
  ListItemWrapper,
  CollapsedItemWrapper,
  ExtendedItemWrapper,
} from './styles';
import TopBar from '../../components/TopBar/TopBar';
import Card from '../../components/Card/Card';
import Title from '../../components/Title/Title';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Label from '../../components/Label/Label';
import removeImg from '../../files/remove.svg';
import arrowDownImg from '../../files/arrow_down.svg';
import MonthPicker from '../../components/MonthPicker/MonthPicker';
import Calendar from '../../components/Calendar/Calendar';
import AmountPicker from '../../components/AmountPicker/AmountPicker';
import { useForceUpdate } from '../../components/utils';

const InputView = () => {
  const [daysOff, setDaysOff] = useState();
  const [employees, setEmployees] = useState([]);
  const [workingAmount, setWorkingAmount] = useState({ day: 1, shifts: [] });
  const [inputDate, setInputDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });
  const [step, setStep] = useState(0);
  const forceUpdate = useForceUpdate();

  const content = [
    {
      value: (
        <>
          <Title>Wybierz miesiąc i zaznacz dni wolne (na czerwono)</Title>
          <Label style={{ marginTop: '50px' }}>Miesiąc</Label>
          <MonthPicker
            style={{ position: 'relative' }}
            onChanged={(date) => {
              setDaysOff();
              setInputDate(date);
            }}
            date={inputDate}>
            <Button
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translate(0, -50%)',
                right: '10px',
              }}
              onClick={() => {
                setDaysOff();
                setInputDate((d) => ({ year: d.year, month: d.month }));
              }}>
              Resetuj
            </Button>
          </MonthPicker>
          <Label style={{ marginTop: '30px' }}>Dni wolne</Label>
          <Calendar
            inputDate={inputDate}
            onChanged={setDaysOff}
            daysOff={daysOff}
          />
        </>
      ),
      canNext: () => true,
    },
    {
      value: (
        <>
          <Title>
            Podaj imiona pracowników, dla których chcesz utworzyć grafik
          </Title>
          <Input
            style={{ marginTop: '50px' }}
            label='Imię pracownika'
            action='Dodaj'
            actionCallback={(input) => addEmployee(input)}
          />
          {employees.length > 0 && (
            <>
              <Label style={{ marginTop: '30px' }}>Pracownicy</Label>
              {employees.map((employee, i) => (
                <ListItemWrapper key={i} expanded={employee.expanded}>
                  <CollapsedItemWrapper
                    expanded={employee.expanded}
                    onClick={() => {
                      employee.expanded = !employee.expanded;
                      forceUpdate();
                    }}>
                    <ImgButton
                      style={{
                        position: 'unset',
                        right: 'unset',
                        top: 'unset',
                        transform: employee.expanded
                          ? 'rotate(180deg)'
                          : 'none',
                      }}
                      src={arrowDownImg}
                      onClick={() => removeEmployee(i)}
                    />
                    <span>{employee.name}</span>
                  </CollapsedItemWrapper>
                  <ImgButton
                    src={removeImg}
                    onClick={() => removeEmployee(i)}
                  />
                  {employee.expanded && (
                    <ExtendedItemWrapper>
                      <AmountPicker
                        style={{
                          width: 'unset',
                          margin: '0',
                        }}
                        onChanged={(amounts) =>
                          (employee.overtime = amounts[1])
                        }
                        items={[
                          {
                            label: () =>
                              `${employee.name} posiada nadgodziny w ilości`,
                          },
                          {
                            value: employee.overtime,
                            label: (v) => (v === 1 ? 'godziny' : 'godzin'),
                            min: 0,
                            max: () => 16,
                          },
                        ]}
                      />
                      <span>Dodatkowe dni wolne (zaznacz na czerwono)</span>
                      <Calendar
                        daysOff={employee.daysOff || []}
                        inputDate={inputDate}
                        onChanged={(daysOff) => (employee.daysOff = daysOff)}
                      />
                    </ExtendedItemWrapper>
                  )}
                </ListItemWrapper>
              ))}
            </>
          )}
        </>
      ),
      canNext: () => employees.length > 0,
    },
    {
      value: (
        <>
          <Title>Opisz jaki jest plan pracy jednego dnia</Title>
          <Label style={{ marginTop: '50px' }}>
            Ile osób pracuje jednego dnia?
          </Label>
          <AmountPicker
            elevated={true}
            style={{ position: 'relative' }}
            onChanged={(amounts) => {
              const temp = { ...workingAmount, day: amounts[0] };
              let sum = temp.shifts.reduce((acc, v) => acc + v.people, 0);
              while (sum > temp.day) {
                if (
                  temp.shifts[temp.shifts.length - 1].people >
                  sum - temp.day
                ) {
                  temp.shifts[temp.shifts.length - 1].people -= sum - temp.day;
                  sum = temp.day;
                } else {
                  sum -= temp.shifts[temp.shifts.length - 1].people;
                  temp.shifts.pop();
                }
              }
              setWorkingAmount(temp);
              forceUpdate();
            }}
            items={[
              {
                min: 1,
                max: () => employees.length,
                value: workingAmount.day,
              },
            ]}>
            <Button
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translate(0, -50%)',
                right: '10px',
              }}
              onClick={() => {
                workingAmount.shifts.splice(0);
                workingAmount.day = 1;
                forceUpdate();
              }}>
              Resetuj
            </Button>
          </AmountPicker>
          <Label style={{ marginTop: '30px' }}>
            Jaki jest układ zmian w ciągu dnia?
          </Label>
          {workingAmount.shifts.map((shift, i) => (
            <AmountPicker
              key={i}
              style={{ position: 'relative', marginBottom: '10px' }}
              onChanged={(amounts) => {
                const temp = { ...workingAmount };
                temp.shifts[i].people = amounts[0];
                temp.shifts[i].hours = amounts[1];
                setWorkingAmount(temp);
                forceUpdate();
              }}
              items={[
                {
                  value: shift.people,
                  min: 1,
                  max: () =>
                    workingAmount.day -
                    workingAmount.shifts.reduce(
                      (acc, v, i2) => acc + (i !== i2 ? v.people : 0),
                      0
                    ),
                  label: (v) =>
                    v === 1
                      ? 'osoba pracuje'
                      : v >= 5
                      ? 'osób pracuje'
                      : 'osoby pracują',
                },
                {
                  value: shift.hours,
                  min: 1,
                  max: () => 12,
                  label: (v) =>
                    v === 1
                      ? 'godzinę dziennie'
                      : v >= 5
                      ? 'godzin dziennie'
                      : 'godziny dizennie',
                },
              ]}>
              <ImgButton
                style={{ top: '50%', transform: 'translate(0, -50%)' }}
                src={removeImg}
                onClick={() => {
                  workingAmount.shifts.splice(i, 1);
                  forceUpdate();
                }}
              />
            </AmountPicker>
          ))}
          {workingAmount.shifts.reduce((acc, v) => acc + v.people, 0) <
            workingAmount.day && (
            <Button
              secondary
              style={{ width: '100%', height: '50px', borderColor: '#ababab' }}
              color='#515151'
              onClick={() => {
                workingAmount.shifts.push({ people: 1, hours: 8 });
                forceUpdate();
              }}>
              Dodaj kolejny układ
            </Button>
          )}
        </>
      ),
      canNext: () =>
        workingAmount.shifts.reduce((acc, v) => acc + v.people, 0) >=
        workingAmount.day,
      onNext: () => {
        localStorage.setItem(
          'data',
          JSON.stringify({
            daysOff,
            employees: employees.map((employee) => ({
              name: employee.name,
              daysOff: employee.daysOff,
              overtime: employee.overtime,
            })),
            shifts: workingAmount.shifts,
            date: inputDate,
          })
        );
        window.location.href = '/view';
      },
    },
  ];

  const addEmployee = (name) => {
    if (!name || name.match(/^ *$/)) {
      return;
    }

    employees.push({ name });
    setEmployees(employees);
    forceUpdate();
  };

  const removeEmployee = (index) => {
    employees.splice(index, 1);
    setEmployees(employees);
    forceUpdate();
  };

  useEffect(() => {
    let data = localStorage.getItem('data');
    if (!data) {
      return;
    }
    data = JSON.parse(data);

    setEmployees(data.employees);
    setDaysOff(data.daysOff);
    setInputDate(data.date);
    setWorkingAmount({
      day: data.shifts.reduce((acc, v) => acc + v.people, 0),
      shifts: data.shifts,
    });
  }, []);

  return (
    <Wrapper>
      <TopBar />
      <CenteredWrapper>
        <Card>{content[step].value}</Card>
        <RowWrapper>
          <Button
            secondary
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}>
            Wróć
          </Button>
          <Button
            disabled={!content[step].canNext()}
            onClick={() =>
              content[step].onNext
                ? content[step].onNext()
                : setStep((s) => s + 1)
            }>
            Dalej
          </Button>
        </RowWrapper>
      </CenteredWrapper>
    </Wrapper>
  );
};

export default InputView;
