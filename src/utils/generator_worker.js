export default () => {
  const rand = (min, max) => {
    return Math.round(
      max ? Math.random() * (max - min) + min : Math.random() * min
    );
  };

  const getMonthDays = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getVariations = (entries) => {
    if (entries.length === 1) {
      return [entries];
    }

    if (entries.length === 2) {
      return [
        [entries[0], entries[1]],
        [entries[1], entries[0]],
      ];
    }

    const output = [];
    const set = [];
    Array.prototype.push.apply(set, Array.from(new Set(entries)));
    for (let i = 0; i < set.length; i++) {
      const entry = set[i];
      const tempEntries = JSON.parse(JSON.stringify(entries));
      tempEntries.splice(tempEntries.indexOf(entry), 1);
      const variations = getVariations(tempEntries);
      for (let j = 0; j < variations.length; j++) {
        const nestedEntry = variations[j];
        const potentialEntry = [entry];
        Array.prototype.push.apply(potentialEntry, nestedEntry);
        if (
          output.find((entry) =>
            entry.every((item, i) => item === potentialEntry[i])
          )
        ) {
          break;
        }

        output.push(potentialEntry);
      }
    }

    return output;
  };

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

  const computeShifts = (
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
      const output = {
        employees: JSON.parse(JSON.stringify(employees)),
        inputDate,
        daysOff,
      };
      for (let i = 0; i < output.employees.length; i++) {
        if (!output.employees[i][date.getMonth()]) {
          output.employees[i][date.getMonth()] = {};
        }
        output.employees[i][date.getMonth()][date.getDate()] = 0;
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
        if (!tempEmployees[j][date.getMonth()]) {
          tempEmployees[j][date.getMonth()] = {};
        }
        tempEmployees[j][date.getMonth()][date.getDate()] = shifts[j];
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

  const sortShifts = ({ employees, inputDate, daysOff }, count = 50) => {
    if (count === 0) {
      return employees;
    }
    const output = JSON.parse(JSON.stringify(employees));
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
          for (let j = 0; j < output.length; j++) {
            const shift = output[j];
            const temp = shift[inputDate.month][index];
            shift[inputDate.month][index] =
              shift[inputDate.month][date.getDate()];
            shift[inputDate.month][date.getDate()] = temp;
          }

          return sortShifts(
            { employees: output, inputDate, daysOff },
            count - 1
          );
        }
      }

      date.setDate(date.getDate() + 1);
    } while (date.getMonth() - inputDate.month < 1);

    return output;
  };

  /* eslint no-restricted-globals: ["off", "self"] */
  self.addEventListener('message', (input) => {
    self.postMessage(sortShifts(computeShifts(input.data)));
    self.close();
  });
};
