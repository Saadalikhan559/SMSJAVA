import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { fetchCalendar, importHolidays, createEvent } from "../services/api/Api";

function HolidayCalendar() {
  const [date, setDate] = useState(new Date());
  const [calendar, setCalendar] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [importYear, setImportYear] = useState(new Date().getFullYear());
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start_date: "",
    end_date: "",
    description: ""
  });
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
const [userRole, setUserRole] = useState(null);

 useEffect(() => {
    const role = localStorage.getItem("userRole"); // ya API call
    setUserRole(role);
  }, []);

  const getCalendar = async () => {
    try {
      const data = await fetchCalendar(month, year);
      setCalendar(data);
    } catch (error) {
      console.log("Failed to get calendar data", error);
    }
  };

  useEffect(() => {
    if (year && month) {
      getCalendar();
    }
  }, [year, month]);

  const calendarData = calendar;

  const handleImportHolidays = async () => {
    setIsImporting(true);
    setImportMessage(null);
    try {
      const response = await importHolidays(importYear);
      setImportMessage({
        type: "success",
        text: `Holidays for ${importYear} imported successfully!`,
      });
      getCalendar();
    } catch (error) {
      setImportMessage({
        type: "error",
        text: error.message || "Failed to import holidays",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleCreateEvent = async () => {
    setIsCreatingEvent(true);
    try {
      await createEvent(newEvent);
      setImportMessage({
        type: "success",
        text: "Event created successfully!",
      });
      getCalendar();
      // Reset form
      setNewEvent({
        title: "",
        start_date: "",
        end_date: "",
        description: "",
        category: ""
      });
      // Close dialog after a short delay
      setTimeout(() => setIsEventDialogOpen(false), 1000);
    } catch (error) {
      setImportMessage({
        type: "error",
        text: error.message || "Failed to create event",
      });
    } finally {
      setIsCreatingEvent(false);
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const parseAPIDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
  };

  const isHoliday = (date) => {
    return calendarData?.holidays?.some((holiday) => {
      const holidayDate = parseAPIDate(holiday.date);
      const compareDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      return holidayDate.getTime() === compareDate.getTime();
    });
  };

  const hasEvent = (date) => {
    return calendarData?.events?.some((event) => {
      const startDate = parseAPIDate(event.start_date);
      const endDate = parseAPIDate(event.end_date);
      const compareDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );

      return compareDate >= startDate && compareDate <= endDate;
    });
  };

  const getEventsForDate = (date) => {
    return (
      calendarData?.events?.filter((event) => {
        const startDate = parseAPIDate(event.start_date);
        const endDate = parseAPIDate(event.end_date);
        const compareDate = new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        );

        return compareDate >= startDate && compareDate <= endDate;
      }) || []
    );
  };

  const getHolidaysForDate = (date) => {
    return (
      calendarData?.holidays?.filter((holiday) => {
        const holidayDate = parseAPIDate(holiday.date);
        const compareDate = new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        );

        return holidayDate.getTime() === compareDate.getTime();
      }) || []
    );
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const events = getEventsForDate(date);
      const holidays = getHolidaysForDate(date);
      return (
        <div className="relative h-full">
          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
            {holidays.length > 0 && (
              <span className="inline-block w-2 h-3 bg-amber-500 rounded-full shadow-md"></span>
            )}
            {events.length > 0 && (
              <span className="inline-block w-2 h-3 bg-indigo-500 rounded-full shadow-md"></span>
            )}
          </div>
        </div>
      );
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      let classes = [];
      if (isHoliday(date)) {
        classes.push("bg-gradient-to-b from-amber-50 to-amber-100");
      }
      if (hasEvent(date)) {
        classes.push("bg-gradient-to-b from-blue-50 to-blue-100");
      }
      if (date.toDateString() === new Date().toDateString()) {
        classes.push(
          "relative after:absolute after:inset-0 after:border-2 after:border-blue-500 after:rounded-md"
        );
      }
      return classes.join(" ");
    }
  };

  const getEventCategoryColor = (category) => {
    switch (category) {
      case "academic":
        return "bg-purple-100 text-purple-800";
      case "meeting":
        return "bg-teal-100 text-teal-800";
      case "sports":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getHolidayTypeColor = (type) => {
    switch (type) {
      case "national":
        return "bg-red-100 text-red-800";
      case "religious":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bgTheme px-8 py-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Academic Calendar
                  </h1>
                  <p className="text-white   font-medium">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-amber-400 rounded-full mr-2 shadow-inner"></span>
                    <span className="text-sm font-medium text-white">
                      Holiday
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-blue-400 rounded-full mr-2 shadow-inner"></span>
                    <span className="text-sm font-medium text-white">
                      Event
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Import Holidays Dialog */}
          {isHolidayDialogOpen && (
            <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Import Holidays
                  </h3>
                  <button
                    onClick={() => {
                      setIsHolidayDialogOpen(false);
                      setImportMessage(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="year"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Year
                    </label>
                    <input
                      type="number"
                      id="year"
                      value={importYear}
                      onChange={(e) =>
                        setImportYear(
                          parseInt(e.target.value) || new Date().getFullYear()
                        )
                      }
                      min="2000"
                      max="2100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5E35B1] focus:border-[#5E35B1]"
                    />
                  </div>

                  {importMessage && (
                    <div
                      className={`p-3 rounded-md ${
                        importMessage.type === "success"
                          ? "bg-green-50 text-green-800"
                          : "bg-red-50 text-red-800"
                      }`}
                    >
                      {importMessage.text}
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      onClick={() => {
                        setIsHolidayDialogOpen(false);
                        setImportMessage(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleImportHolidays}
                      disabled={isImporting}
                      className={`px-4 py-2 rounded-md text-sm font-medium text-white w-30 ${
                        isImporting
                          ? "bgTheme cursor-not-allowed"
                          : "bgTheme hover:bg-[#4e1bb3]"
                      }`}
                    >
                      {isImporting ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : "Import"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Create Event Dialog */}
          {isEventDialogOpen && (
            <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Create New Event
                  </h3>
                  <button
                    onClick={() => {
                      setIsEventDialogOpen(false);
                      setImportMessage(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="event-title"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Event Title
                    </label>
                    <input
                      type="text"
                      id="event-title"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5E35B1] focus:border-[#5E35B1]"
                      placeholder="Enter event title"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="start-date"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Start Date
                      </label>
                      <input
                        type="date"
                        id="start-date"
                        value={newEvent.start_date}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, start_date: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5E35B1] focus:border-[#5E35B1]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="end-date"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        End Date
                      </label>
                      <input
                        type="date"
                        id="end-date"
                        value={newEvent.end_date}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, end_date: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5E35B1] focus:border-[#5E35B1]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label
                      htmlFor="event-description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description (Optional)
                    </label>
                    <textarea
                      id="event-description"
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, description: e.target.value })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#5E35B1] focus:border-[#5E35B1]"
                      placeholder="Enter event description"
                    />
                  </div>

                  {importMessage && (
                    <div
                      className={`p-3 rounded-md ${
                        importMessage.type === "success"
                          ? "bg-green-50 text-green-800"
                          : "bg-red-50 text-red-800"
                      }`}
                    >
                      {importMessage.text}
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      onClick={() => {
                        setIsEventDialogOpen(false);
                        setImportMessage(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateEvent}
                      disabled={isCreatingEvent}
                      className={`px-4 py-2 rounded-md text-sm font-medium text-white w-30 ${
                        isCreatingEvent
                          ? "bgTheme cursor-not-allowed"
                          : "bgTheme hover:bg-[#4410ad]"
                      }`}
                    >
                      {isCreatingEvent ? <i className="fa-solid fa-spinner fa-spin mr-2"></i> : "Create Event"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Calendar */}
              <div className="flex-1">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <Calendar
                    onChange={handleDateChange}
                    value={date}
                    tileContent={tileContent}
                    tileClassName={tileClassName}
                    className="border-0 p-5"
                    view="month"
                    next2Label={null}
                    prev2Label={null}
                    onActiveStartDateChange={({ activeStartDate }) => {
                      setYear(activeStartDate.getFullYear());
                      setMonth(activeStartDate.getMonth() + 1);
                    }}
                    navigationLabel={({ date }) => (
                      <span className="text-gray-800 font-semibold">
                        {date.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    formatShortWeekday={(locale, date) =>
                      ["S", "M", "T", "W", "T", "F", "S"][date.getDay()]
                    }
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      {date.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </h2>
                    <p className="text-gray-500">{date.getFullYear()}</p>
                  </div>

                  <div className="space-y-6">
                    {/* Holidays */}
                    {getHolidaysForDate(date).length > 0 && (
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="bg-amber-100 p-2 rounded-lg mr-3">
                            <svg
                              className="w-5 h-5 text-amber-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            Holidays
                          </h3>
                        </div>
                        <ul className="space-y-3">
                          {getHolidaysForDate(date).map((holiday) => (
                            <li
                              key={holiday.id}
                              className="bg-gray-50 p-4 rounded-lg border-l-4 border-amber-500"
                            >
                              <div className="flex justify-between items-start">
                                <p className="font-semibold text-gray-800">
                                  {holiday.title}
                                </p>
                                {holiday.type && (
                                  <span
                                    className={`text-xs px-2 py-1 rounded ${getHolidayTypeColor(
                                      holiday.type
                                    )}`}
                                  >
                                    {holiday.type}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-2">
                                {holiday.description}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Events */}
                    {getEventsForDate(date).length > 0 && (
                      <div>
                        <div className="flex items-center mb-4">
                          <div className="bg-blue-100 p-2 rounded-lg mr-3">
                            <svg
                              className="w-5 h-5 textTheme"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            Events
                          </h3>
                        </div>
                        <ul className="space-y-3">
                          {getEventsForDate(date).map((event) => (
                            <li
                              key={event.id}
                              className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#5E35B1]"
                            >
                              <div className="flex justify-between items-start">
                                <p className="font-semibold text-gray-800">
                                  {event.title}
                                </p>
                                <div className="flex items-center space-x-2">
                                  {event.category && (
                                    <span
                                      className={`text-xs px-2 py-1 rounded ${getEventCategoryColor(
                                        event.category
                                      )}`}
                                    >
                                      {event.category}
                                    </span>
                                  )}
                                  <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                    {parseAPIDate(
                                      event.start_date
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })}{" "}
                                    -{" "}
                                    {parseAPIDate(
                                      event.end_date
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </span>
                                </div>
                              </div>
                              {event.description && (
                                <p className="text-sm text-gray-600 mt-2">
                                  {event.description}
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* No Events or Holidays */}
                    {getHolidaysForDate(date).length === 0 &&
                      getEventsForDate(date).length === 0 && (
                        <div className="text-center py-12">
                          <div className="mx-auto bg-gray-100 p-4 rounded-full inline-block mb-4">
                            <svg
                              className="w-6 h-6 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-medium text-gray-700">
                            No scheduled activities
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Select a date with events or holidays
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
{(userRole === "office staff" || userRole === "director") && (
          <div className="flex justify-end m-4 space-x-4">
            <button
              onClick={() => setIsEventDialogOpen(true)}
              className="bgTheme text-white px-4 py-3 rounded-sm text-sm font-medium transition-colors shadow-sm flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>Create Event</span>
            </button>
            <button
              onClick={() => setIsHolidayDialogOpen(true)}
              className="bgTheme text-white px-4 py-3 rounded-sm text-sm font-medium transition-colors shadow-sm flex items-center space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span>Import Holidays</span>
            </button>
          </div>
)}
        </div>
      </div>
    </div>
  );
}

export default HolidayCalendar;