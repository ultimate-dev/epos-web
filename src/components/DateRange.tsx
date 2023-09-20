import { useState } from "react";
import DatePicker from "react-datepicker";

class DateRangeProps {
  startDate: Date;
  endDate: Date;
  maxDate?: Date;
  onChange: (startDate: Date, endDate: Date) => void;
}
const DateRange = ({
  startDate = new Date(),
  endDate = new Date(),
  onChange = () => {},
  maxDate = new Date(),
}: DateRangeProps) => {
  return (
    <div className="flex items-center">
      <i className="ri-calendar-todo-fill mr-2 text-gray-600" />
      <DatePicker
        selected={startDate}
        onChange={(date: Date) => onChange(date, endDate)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        className="border border-black border-opacity-10 rounded pt-1 px-3 h-10 text-gray-600 outline-none"
        calendarClassName="shadow border"
      />
      <span className="mx-2">-</span>
      <DatePicker
        selected={endDate}
        onChange={(date: Date) => onChange(startDate, date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        className="border border-black border-opacity-10 rounded pt-1 px-3 h-10 text-gray-600 outline-none"
        calendarClassName="shadow border"
        maxDate={maxDate}
      />
    </div>
  );
};
export default DateRange;
