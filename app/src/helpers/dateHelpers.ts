export function correctDates(startDate: string, endDate: string): Date[] {
    const startTime = setDateToCurrentDate(new Date(startDate));
    const endTime = setDateToCurrentDate(new Date(endDate));

    return [startTime, endTime];
}

export function setDateToCurrentDate(dateIn: Date): Date {
    const currentDate = new Date();
    currentDate.setHours(dateIn.getHours());
    currentDate.setMinutes(dateIn.getMinutes());
    currentDate.setSeconds(dateIn.getSeconds());
    return currentDate;
}
