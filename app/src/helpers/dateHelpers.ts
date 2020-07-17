export const convertDates = (startDate: number[], endDate: number[], comparisonDate = new Date()): Date[] => {
    const startTime = new Date(comparisonDate.getFullYear(), comparisonDate.getMonth(), comparisonDate.getDate(), ...startDate);
    const endTime = new Date(comparisonDate.getFullYear(), comparisonDate.getMonth(), comparisonDate.getDate(), ...endDate);

    return [startTime, endTime];
}

export const createAdjustedEndTime = (dateIn: Date, critterMonths: number[]): Date => {
    const adjustedEndTime = new Date(dateIn);
    adjustedEndTime.setDate(dateIn.getDate() + 1);
    // if we've tripped over into a new month, and that new month is not part of the critter's availability...
    if(adjustedEndTime.getMonth() !== dateIn.getMonth() && critterMonths.indexOf(adjustedEndTime.getMonth() + 1) === -1) { // we're adding 1 because the availability months are noi zero-indexed
        // we readjust the end time to expire at midnight
        adjustedEndTime.setDate(dateIn.getDate());
        adjustedEndTime.setMonth(dateIn.getMonth());
        adjustedEndTime.setHours(23);
        adjustedEndTime.setMinutes(59);
        adjustedEndTime.setSeconds(59);
    }
    return adjustedEndTime;
}

export const isInTimeRange = (timeToCheck: Date, startTime: Date, endTime: Date): boolean => {
    return (startTime < endTime ? 
        timeToCheck >= startTime && timeToCheck < endTime : // check if the time is between the start and end
        (!(timeToCheck > endTime && timeToCheck < startTime) && timeToCheck.getDate() === startTime.getDate())); // the time crosses a date boundary. Check if it's NOT in between the end and start times, and that it is in fact on the same date
}
