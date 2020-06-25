export function correctDates(startDate: string, endDate: string): Date[] {
    const setDate = (dateIn: Date):Date => {
        const currentDate = new Date();
        currentDate.setHours(dateIn.getHours());
        currentDate.setMinutes(dateIn.getMinutes());
        currentDate.setSeconds(dateIn.getSeconds());
        return currentDate;
    }

    const startTime = setDate(new Date(startDate));
    const endTime = setDate(new Date(endDate));

    if(startTime.getHours() > endTime.getHours()) {
        endTime.setDate(endTime.getDate() + 1);
    }

    return [startTime, endTime];
}