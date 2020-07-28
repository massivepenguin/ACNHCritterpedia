import { convertDates, createAdjustedEndTime, isInTimeRange } from "../helpers/dateHelpers";

describe('date conversion test (current date)', () => {
    const currentDate: Date = new Date();
    const [convertedCurrentStart, convertedCurrentEnd] = convertDates([18, 56], [20], currentDate);

    it('should match if convertedCurrentStart date is equal to today\'s date', () => {
        expect(convertedCurrentStart.getDate()).toEqual(currentDate.getDate());
    });
    it('should match if convertedCurrentStart\'s hours and minutes have been preserved in the conversion', () => {
        expect(convertedCurrentStart.getHours()).toEqual(18);
        expect(convertedCurrentStart.getMinutes()).toEqual(56);
    });
    it('should match if currentEndDate\'s hours have been preserved', () => {
        expect(convertedCurrentEnd.getHours()).toEqual(20);
    });
    it('should match if convertedCurrentEnd\'s minutes are zero, even though they were not explicitly set', () => {
        expect(convertedCurrentEnd.getMinutes()).toEqual(0);
    });
    it('should match if convertedCurrentEnd\'s date matches convertedCurrentStart\'s date', () => {
        expect(convertedCurrentEnd.getDate()).toEqual(convertedCurrentStart.getDate());
    });
});

describe('date conversion test (fixed date)', () => {
    const fixedDate: Date = new Date(2020, 10, 27);
    const [convertedSetStart, convertedSetEnd] = convertDates([18, 56], [20], fixedDate);

    it('should match if convertedSetEnd\'s date is equal to the specified date', () => {
        expect(convertedSetStart.getDate()).toEqual(27);
    });
    it('should match if convertedSetStart\'s hours and minutes have been preserved', () => {
        expect(convertedSetStart.getHours()).toEqual(18);
        expect(convertedSetStart.getMinutes()).toEqual(56);
    });
    it('should match if convertedSetEnd\'s year is equal to that of fixedDate\'s', () => {
        expect(convertedSetEnd.getFullYear()).toEqual(2020);
    });
    it('should match if convertedSetEnd\'s month is equal to fixedDate\'s', () => {
        expect(convertedSetEnd.getMonth()).toEqual(10);
    });
    it('should match if convertedSetEnd\'s hours and minutes have been preserved', () => {
        expect(convertedSetEnd.getHours()).toEqual(20);
        expect(convertedSetEnd.getMinutes()).toEqual(0);
    });
});

describe('adjusted end time test (no month boundary)', () => {
    const setDate: Date = new Date(2020, 6, 17, 10, 36);
    const setMonths: number[] = [5,6,7,8];
    const adjustedEndDate = createAdjustedEndTime(setDate, setMonths);

    it('should match if the adjustedEndDate\'s day has been advanced by 1', () => {
        expect(adjustedEndDate.getDate()).toEqual(18);
    });
    it('should match if adjustedEndDate\'s month, hour and minutes have been preserved', () => {
        expect(adjustedEndDate.getMonth()).toEqual(6);
        expect(adjustedEndDate.getHours()).toEqual(10);
        expect(adjustedEndDate.getMinutes()).toEqual(36);
    });
});

describe('adjusted end time test (month boundary)', () => {
    const setDate: Date = new Date(2020, 6, 31, 10, 36);
    const setMonths: number[] = [5,6,7,8];
    const adjustedEndDate = createAdjustedEndTime(setDate, setMonths);

    it('should match if the adjustedEndDate\s month has been advanced by 1', () => {
        expect(adjustedEndDate.getMonth()).toEqual(7);
    });
    it('should match if the adjustedEndDate\'s date has been set to the 1st of the month', () => {
        expect(adjustedEndDate.getDate()).toEqual(1);
    });
    it('should match if the adjustedEndDate\'s hours and minutes have been preserved', () =>{
        expect(adjustedEndDate.getHours()).toEqual(10);
        expect(adjustedEndDate.getMinutes()).toEqual(36);
    });
});

describe('adjusted end time test (with month boundary and availability boundary)', () => {
    const setDate: Date = new Date(2020, 6, 31, 10, 36);
    const setMonths: number[] = [5,6];
    const adjustedEndDate = createAdjustedEndTime(setDate, setMonths);

    it('should match if the adjustedEndDate\'s month has been preserved', () => {
        expect(adjustedEndDate.getMonth()).toEqual(6);
    });
    it('should match if the adjustedEndDate\'s day has been preserved, as it\'s at the end of the month and availability boundary', () =>{
        expect(adjustedEndDate.getDate()).toEqual(31);
    });
    it('should match if the adjustedEndDate\'s hours, minutes and seconds have been set to 23:59:59', () => {
        expect(adjustedEndDate.getHours()).toEqual(23);
        expect(adjustedEndDate.getMinutes()).toEqual(59);
        expect(adjustedEndDate.getSeconds()).toEqual(59);
    });
});

describe('time range check', () => {
    const startTime: Date = new Date(2020, 6, 15, 19); // 15th July 2020, 7pm
    const endTime: Date = new Date(2020, 6, 15, 4); // 15th July 2020, 4am
    const insideTime1: Date = new Date(2020, 6, 15, 20, 46); // 15th July 2020, 8:46pm
    const insideTime2: Date = new Date(2020, 6, 15, 3, 59, 59); // 15th July 2020, 3:59pm & 59 seconds
    const outsideTime1: Date = new Date(2020, 6, 15, 12, 15); // 15th July 2020, 15:15pm
    const outsideTime2: Date = new Date(2020, 6, 16, 18); // 16th July 2020, 6pm

    it('should match as the time is inside the specified time range (latter part of day)', () => {
        expect(isInTimeRange(insideTime1, startTime, endTime)).toEqual(true);
    });
    it('should match as the time is inside the specified time range (early part of day)', () => {
        expect(isInTimeRange(insideTime2, startTime, endTime)).toEqual(true);
    });
    it('should match as the time is outside the specified time range (latter part of day)', () => {
        expect(isInTimeRange(outsideTime1, startTime, endTime)).toEqual(false);
    });
    it('should match as the time is outside the specified time range (early part of day, different date)', () => {
        expect(isInTimeRange(outsideTime2, startTime, endTime)).toEqual(false);
    });
});