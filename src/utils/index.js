export const rand = (min, max) => {
  return Math.round(
    max ? Math.random() * (max - min) + min : Math.random() * min
  );
};

export const getVariations = (entries) => {
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

export const getCombinationsSum = (numbers, sum) => {
  const output = [];
  const findNumbers = (sum, index, combination = []) => {
    if (sum < 0) {
      return;
    }

    if (sum === 0) {
      output.push([...combination]);
      return;
    }

    while (index < numbers.length && sum - numbers[index] >= 0) {
      combination.push(numbers[index]);
      findNumbers(sum - numbers[index], index, combination);
      index++;
      combination.pop();
    }
  };

  findNumbers(sum, 0);

  return output;
};

export const getMonthDays = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getDay = (day, month, year) => {
  return new Date(year, month, day).getDay();
};

export const getMonthWorkingHours = (month, year, daysOff = []) => {
  if (!month || !year) {
    return 0;
  }

  const date = new Date(year, month, 1);
  let workingHours = 0;
  let standardWorkingHours = 0;

  do {
    if (!daysOff.includes(date.getDate())) {
      workingHours += 8;
    }

    if (![0, 6].includes(date.getDay())) {
      standardWorkingHours += 8;
    }

    date.setDate(date.getDate() + 1);
  } while (date.getDate() !== 1);

  return [standardWorkingHours, workingHours - 32];
};

export const monthNames = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];

export const weekdays = [
  'Niedziela',
  'Poniedziałek',
  'Wtorek',
  'Środa',
  'Czwartek',
  'Piątek',
  'Sobota',
];
