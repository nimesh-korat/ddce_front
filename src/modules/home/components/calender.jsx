import { useEffect, useState } from "react";

// Helper function to get the number of days in a month
const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

// Helper function to get the first day of the month (0 = Sunday, 1 = Monday, etc.)
const getFirstDayOfMonth = (month, year) => {
  return new Date(year, month - 1, 1).getDay();
};

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // Track selected date

  const currentMonth = currentDate.getMonth(); // Get the month (0-11)
  const currentYear = currentDate.getFullYear(); // Get the year (4 digits)

  const [displayMonth, setDisplayMonth] = useState(currentMonth);
  const [displayYear, setDisplayYear] = useState(currentYear);

  useEffect(() => {
    setDisplayMonth(currentMonth);
    setDisplayYear(currentYear);
    // eslint-disable-next-line
  }, [currentDate]);

  // Generate days for the current month
  const daysInMonth = getDaysInMonth(displayMonth + 1, displayYear);
  const firstDayOfMonth = getFirstDayOfMonth(displayMonth + 1, displayYear);

  // Handle previous and next month navigation
  const handlePrevMonth = () => {
    const newDate = new Date(displayYear, displayMonth - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(displayYear, displayMonth + 1);
    setCurrentDate(newDate);
  };

  // Handle date selection
  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  // Render the days of the month in the calendar grid
  const renderDays = () => {
    const daysArray = [];
    // Add empty days for the first row (before the 1st day)
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(
        <div className="calendar__day empty" key={`empty-${i}`} />
      );
    }
    // Add the actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        day === currentDate.getDate() &&
        displayMonth === currentMonth &&
        displayYear === currentYear;
      const isSelected = day === selectedDate;

      let dayClass = "calendar__day";
      if (isToday) dayClass += " today";
      if (isSelected) dayClass += " selected";

      daysArray.push(
        <div
          className={dayClass}
          key={`day-${day}`}
          onClick={() => handleDateClick(day)}
          style={{
            backgroundColor: isSelected ? "red" : isToday ? "#3e80f9" : "",
            color: isSelected || isToday ? "#fff" : "",
          }}
        >
          {day}
        </div>
      );
    }
    return daysArray;
  };

  return (
    <div className="calendar">
      <div className="calendar__header">
        <button
          type="button"
          className="calendar__arrow left"
          onClick={handlePrevMonth}
        >
          <i className="ph ph-caret-left" />
        </button>
        <p className="display h6 mb-0">
          {`${currentDate.toLocaleString("default", {
            month: "long",
          })} ${displayYear}`}
        </p>
        <button
          type="button"
          className="calendar__arrow right"
          onClick={handleNextMonth}
        >
          <i className="ph ph-caret-right" />
        </button>
      </div>
      <div className="calendar__week week">
        <div className="calendar__week-text">Su</div>
        <div className="calendar__week-text">Mo</div>
        <div className="calendar__week-text">Tu</div>
        <div className="calendar__week-text">We</div>
        <div className="calendar__week-text">Th</div>
        <div className="calendar__week-text">Fr</div>
        <div className="calendar__week-text">Sa</div>
      </div>
      <div className="days">{renderDays()}</div>
    </div>
  );
}

export default Calendar;
