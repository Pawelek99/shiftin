export default () => {
  const rand = (min, max) => {
    return Math.round(
      max ? Math.random() * (max - min) + min : Math.random() * min
    );
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
    for (let entry of new Set(entries)) {
      const tempEntries = [...entries];
      tempEntries.splice(tempEntries.indexOf(entry), 1);
      for (let nestedEntry of getVariations(tempEntries)) {
        const potentialEntry = [entry, ...nestedEntry];
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
        employees: [...employees],
        inputDate,
        daysOff,
      };
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

  /* eslint no-restricted-globals: ["off", "self"] */
  self.addEventListener('message', (input) => {
    self.postMessage(computeShifts(input.data));
    self.close();
  });
};
