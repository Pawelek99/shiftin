const { rand, getVariations, getCombinationsSum, getMonthDays } = require('.');

const shiftMeetsConditions = (employees, shifts) => {
  for (let i = 0; i < employees.length; i++) {
    if (
      (employees[i].daysOffLeft === 0 && shifts[i] === 0) ||
      employees[i].hoursLeft < shifts[i]
    ) {
      return false;
    }
  }

  return true;
};

export const computeShifts = (
  { employees, inputDate, daysOff, shiftArrangements },
  variations,
  date
) => {
  if (!date || !variations) {
    date = new Date(inputDate.year, inputDate.month, 1);
    variations = getVariations(shiftArrangements);
  }

  if (date.getMonth() !== inputDate.month) {
    return { employees, inputDate, daysOff };
  }

  if (daysOff.includes(date.getDate())) {
    const output = { employees: [...employees], inputDate, daysOff };
    for (let i = 0; i < output.employees.length; i++) {
      output.employees[i][date.getMonth()] = {
        ...output.employees[i][date.getMonth()],
        [date.getDate()]: 0,
      };
    }

    return computeShifts(
      output,
      variations,
      new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    );
  }

  const tempVariations = variations.filter((shifts) =>
    shiftMeetsConditions(employees, shifts)
  );

  const startIndex = rand(tempVariations.length);
  for (let j = startIndex; j < startIndex + tempVariations.length; j++) {
    const shifts = tempVariations[j % tempVariations.length];

    const tempEmployees = JSON.parse(JSON.stringify(employees));

    for (let j = 0; j < tempEmployees.length; j++) {
      if (shifts[j] === 0) {
        tempEmployees[j].daysOffLeft--;
      }

      tempEmployees[j].hoursLeft -= shifts[j];
      tempEmployees[j].hours += shifts[j];
      tempEmployees[j][date.getMonth()] = {
        ...tempEmployees[j][date.getMonth()],
        [date.getDate()]: shifts[j],
      };
    }

    const output = computeShifts(
      { employees: tempEmployees, inputDate, daysOff },
      tempVariations,
      new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    );

    if (output) {
      return output;
    }
  }

  return false;
};

export const splitIntoRemainders = (hoursCount, hoursLeft) => {
  const hours = Object.keys(hoursCount);
  const remainderHourPairs = {};
  const possibleRemainders = {};
  for (let i = hours.length - 1; i > 0; i--) {
    for (let j = i - 1; j >= 0; j--) {
      possibleRemainders[hours[i] - hours[j]] = hoursCount[hours[j]];
      remainderHourPairs[hours[i] - hours[j]] = hours[j];
    }
  }

  const combinations = getCombinationsSum(
    Object.keys(possibleRemainders)
      .flatMap((remainder) => parseInt(remainder))
      .sort(),
    hoursLeft
  )
    .filter((combination) => {
      const count = combination.reduce(
        (acc, value) => ({
          ...acc,
          [value]: (acc[value] || 0) + 1,
        }),
        {}
      );

      for (let hourCount in possibleRemainders) {
        if (count[hourCount] > possibleRemainders[hourCount]) {
          return false;
        }
      }

      return true;
    })
    .map((combination) =>
      combination.map((value) => ({
        [remainderHourPairs[value]]: value,
      }))
    );

  return combinations;
};

export const completeShifts = (
  { employees, inputDate, daysOff },
  possibleHours
) => {
  const output = [...employees];
  for (let i = 0; i < output.length; i++) {
    if (output[i].hoursLeft !== 0) {
      const hoursCount = Object.entries(output[i][inputDate.month]).reduce(
        (acc, pair) =>
          pair[1] === 0
            ? acc
            : {
                ...acc,
                [pair[1]]: (acc[pair[1]] || 0) + 1,
              },
        {}
      );

      let remainder =
        possibleHours && output[i].hours < possibleHours
          ? splitIntoRemainders(
              hoursCount,
              Math.max(0, possibleHours - output[i].hours)
            )[0]
          : splitIntoRemainders(hoursCount, output[i].hoursLeft)[0];

      for (let obj of remainder) {
        const indexes = [];
        const hour = parseInt(Object.keys(obj)[0]);
        Object.entries(output[i][inputDate.month]).forEach(
          (day) => day[1] === hour && indexes.push(day[0])
        );
        if (indexes.length > 0) {
          const index = indexes[rand(indexes.length - 1)];
          output[i][inputDate.month][index] += parseInt(Object.values(obj)[0]);
          output[i].hours += parseInt(Object.values(obj)[0]);
        }
      }
    }
  }

  return {
    employees: output,
    inputDate,
    daysOff,
  };
};

export const sortShifts = ({ employees, inputDate, daysOff }, count = 50) => {
  if (count === 0) {
    return employees;
  }
  const output = [...employees];
  const date = new Date(inputDate.year, inputDate.month, 1);
  const countStreak = {};
  do {
    if (daysOff.includes(date.getDate())) {
      date.setDate(date.getDate() + 1);
      continue;
    }

    for (let i = 0; i < output.length; i++) {
      const v = output[i][inputDate.month][date.getDate()];
      countStreak[i] = v === 12 ? (countStreak[i] || 0) + 1 : 0;

      if (
        countStreak[i] >= 3 ||
        (v > 0 && (output[i].daysOff || []).includes(date.getDate()))
      ) {
        let index;
        do {
          index = rand(1, getMonthDays(inputDate.month, inputDate.year));
        } while (daysOff.includes(index));
        for (let shift of output) {
          const temp = shift[inputDate.month][index];
          shift[inputDate.month][index] =
            shift[inputDate.month][date.getDate()];
          shift[inputDate.month][date.getDate()] = temp;
        }

        return sortShifts({ employees: output, inputDate, daysOff }, count - 1);
      }
    }

    date.setDate(date.getDate() + 1);
  } while (date.getMonth() - inputDate.month < 1);

  return output;
};
