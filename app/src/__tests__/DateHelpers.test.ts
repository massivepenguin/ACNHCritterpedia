import { convertDates, createAdjustedEndTime, isInTimeRange } from "../helpers/DateHelpers";

it('date conversion test (current date)', () => {
    const currentDate: Date = new Date();
    const [convertedCurrentStart, convertedCurrentEnd] = convertDates([18, 56], [20], currentDate);
    expect(convertedCurrentStart.getDate()).toEqual(currentDate.getDate());
    expect(convertedCurrentStart.getHours()).toEqual(18);
    expect(convertedCurrentStart.getMinutes()).toEqual(56);
    expect(convertedCurrentEnd.getHours()).toEqual(20);
    expect(convertedCurrentEnd.getMinutes()).toEqual(0);
    expect(convertedCurrentEnd.getDate()).toEqual(convertedCurrentStart.getDate());
});

it('date conversion test (fixed date)', () => {
    const setDate: Date = new Date(2020, 10, 27);
    const [convertedSetStart, convertedSetEnd] = convertDates([18, 56], [20], setDate);
    expect(convertedSetStart.getDate()).toEqual(27);
    expect(convertedSetStart.getHours()).toEqual(18);
    expect(convertedSetStart.getMinutes()).toEqual(56);
    expect(convertedSetEnd.getFullYear()).toEqual(2020);
    expect(convertedSetEnd.getMonth()).toEqual(10);
    expect(convertedSetEnd.getHours()).toEqual(20);
    expect(convertedSetEnd.getMinutes()).toEqual(0);
});

it('adjusted end time test (no month boundary)', () => {
    const setDate: Date = new Date(2020, 6, 17, 10, 36);
    const setMonths: number[] = [5,6,7,8];
    const adjustedEndDate = createAdjustedEndTime(setDate, setMonths);
    expect(adjustedEndDate.getMonth()).toEqual(6);
    expect(adjustedEndDate.getDate()).toEqual(18);
    expect(adjustedEndDate.getHours()).toEqual(10);
    expect(adjustedEndDate.getMinutes()).toEqual(36);
});

it('adjusted end time test (month boundary)', () => {
    const setDate: Date = new Date(2020, 6, 31, 10, 36);
    const setMonths: number[] = [5,6,7,8];
    const adjustedEndDate = createAdjustedEndTime(setDate, setMonths);
    expect(adjustedEndDate.getMonth()).toEqual(7);
    expect(adjustedEndDate.getDate()).toEqual(1);
    expect(adjustedEndDate.getHours()).toEqual(10);
    expect(adjustedEndDate.getMinutes()).toEqual(36);
});

it('adjusted end time test (with month boundary and availability boundary)', () => {
    const setDate: Date = new Date(2020, 6, 31, 10, 36);
    const setMonths: number[] = [5,6];
    const adjustedEndDate = createAdjustedEndTime(setDate, setMonths);
    expect(adjustedEndDate.getMonth()).toEqual(6);
    expect(adjustedEndDate.getDate()).toEqual(31);
    expect(adjustedEndDate.getHours()).toEqual(23);
    expect(adjustedEndDate.getMinutes()).toEqual(59);
    expect(adjustedEndDate.getSeconds()).toEqual(59);
});

it('time range check', () => {
    const startTime: Date = new Date(2020, 6, 15, 19); // 15th July 2020, 7pm
    const endTime: Date = new Date(2020, 6, 15, 4); // 15th July 2020, 4am
    const insideTime1: Date = new Date(2020, 6, 15, 20, 46); // 15th July 2020, 8:46pm
    const insideTime2: Date = new Date(2020, 6, 15, 3, 59, 59); // 15th July 2020, 3:59pm & 59 seconds
    const outsideTime1: Date = new Date(2020, 6, 15, 12, 15); // 15th July 2020, 15:15pm
    const outsideTime2: Date = new Date(2020, 6, 16, 18); // 16th July 2020, 6pm
    expect(isInTimeRange(insideTime1, startTime, endTime)).toEqual(true);
    expect(isInTimeRange(insideTime2, startTime, endTime)).toEqual(true);
    expect(isInTimeRange(outsideTime1, startTime, endTime)).toEqual(false);
    expect(isInTimeRange(outsideTime2, startTime, endTime)).toEqual(false);
});