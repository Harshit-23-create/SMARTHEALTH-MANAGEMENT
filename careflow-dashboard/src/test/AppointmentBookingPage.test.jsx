import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { NotificationProvider } from "@/context/NotificationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "@/i18n";
import AppointmentBookingPage, {
  normalizeTime,
  normalizeDate,
  isSameSlot,
  checkAppointmentConflict,
  initialAppointments
} from "@/pages/AppointmentBookingPage";

const renderWithProviders = (ui) => {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <NotificationProvider>
          {ui}
        </NotificationProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
};

describe("Appointment Rescheduling Unit Logic", () => {
  it("normalizes times correctly across formats", () => {
    expect(normalizeTime("10:00 AM")).toBe("10:00");
    expect(normalizeTime("10:00")).toBe("10:00");
    expect(normalizeTime("02:00 PM")).toBe("14:00");
    expect(normalizeTime("2:00 PM")).toBe("14:00");
    expect(normalizeTime("14:00")).toBe("14:00");
  });

  it("identifies matching slots accurately", () => {
    expect(isSameSlot("Today", "10:00 AM", "Today", "10:00")).toBe(true);
    expect(isSameSlot("2026-11-01", "14:00", "2026-11-01", "02:00 PM")).toBe(true);
    expect(isSameSlot("Today", "10:00 AM", "Tomorrow", "10:00 AM")).toBe(false);
  });

  it("detects conflicting slot for same doctor with active appointment", () => {
    const appointments = [
      { id: 1, doctor: "Dr. Smith", date: "Today", time: "10:00 AM", status: "Confirmed" },
      { id: 2, doctor: "Dr. Smith", date: "Today", time: "03:45 PM", status: "Confirmed" }
    ];

    // Rescheduling appt 2 to appt 1's slot should conflict
    const result = checkAppointmentConflict(appointments, 2, "Today", "10:00 AM");
    expect(result.hasConflict).toBe(true);
    expect(result.message).toMatch(/already has another active appointment/i);
  });

  it("allows reschedule if conflicting slot belongs to a cancelled appointment", () => {
    const appointments = [
      { id: 1, doctor: "Dr. Lee", date: "Tomorrow", time: "09:15 AM", status: "Cancelled" },
      { id: 2, doctor: "Dr. Lee", date: "Today", time: "11:00 AM", status: "Confirmed" }
    ];

    // Rescheduling appt 2 to Dr. Lee's cancelled slot (appt 1) should be allowed
    const result = checkAppointmentConflict(appointments, 2, "Tomorrow", "09:15 AM");
    expect(result.hasConflict).toBe(false);
  });

  it("allows reschedule if slot is taken by a different doctor", () => {
    const appointments = [
      { id: 1, doctor: "Dr. Smith", date: "Today", time: "10:00 AM", status: "Confirmed" },
      { id: 2, doctor: "Dr. Williams", date: "Today", time: "02:00 PM", status: "Confirmed" }
    ];

    // Dr. Williams can take 10:00 AM Today because Dr. Smith is a different doctor
    const result = checkAppointmentConflict(appointments, 2, "Today", "10:00 AM");
    expect(result.hasConflict).toBe(false);
  });

  it("rejects rescheduling a cancelled appointment", () => {
    const appointments = [
      { id: 4, doctor: "Dr. Lee", date: "Tomorrow", time: "09:15 AM", status: "Cancelled" }
    ];

    const result = checkAppointmentConflict(appointments, 4, "Tomorrow", "11:00 AM");
    expect(result.hasConflict).toBe(true);
    expect(result.message).toMatch(/cancelled/i);
  });
});

describe("AppointmentBookingPage Reschedule UI & Acceptance Criteria", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders appointments and displays reschedule buttons", () => {
    renderWithProviders(<AppointmentBookingPage />);

    // John Doe should be displayed
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Active appointments have enabled reschedule buttons
    const johnRescheduleBtn = screen.getByTestId("reschedule-btn-1");
    expect(johnRescheduleBtn).not.toBeDisabled();

    // Cancelled appointment (id 4, Rachel Zane) has a disabled reschedule button
    const cancelledBtn = screen.getByTestId("reschedule-btn-4");
    expect(cancelledBtn).toBeDisabled();
  });

  it("staff can choose a new date and time, and change appears in the appointment list immediately", () => {
    renderWithProviders(<AppointmentBookingPage />);

    // Open reschedule modal for Mike Ross (id: 3, Dr. Williams)
    const rescheduleBtn = screen.getByTestId("reschedule-btn-3");
    fireEvent.click(rescheduleBtn);

    // Modal opens
    expect(screen.getByRole("heading", { name: /reschedule appointment/i })).toBeInTheDocument();

    // Fill in new date and time
    const dateInput = screen.getByLabelText(/new date/i);
    const timeInput = screen.getByLabelText(/new time/i);

    fireEvent.change(dateInput, { target: { value: "2026-11-20" } });
    fireEvent.change(timeInput, { target: { value: "15:30" } });

    // Submit reschedule form
    const submitBtn = screen.getByTestId("confirm-reschedule-button");
    fireEvent.click(submitBtn);

    // Modal closes and updated time and date appear immediately
    expect(screen.queryByRole("heading", { name: /reschedule appointment/i })).not.toBeInTheDocument();
    expect(screen.getByText(/15:30 • 2026-11-20/)).toBeInTheDocument();

    // Patient, doctor, department, and type remain unchanged
    expect(screen.getByText("Mike Ross")).toBeInTheDocument();
    expect(screen.getByText("Dr. Williams")).toBeInTheDocument();
    expect(screen.getByText("General")).toBeInTheDocument();
    expect(screen.getByText("Routine Check")).toBeInTheDocument();
    expect(screen.getByText("555-0103")).toBeInTheDocument();
  });

  it("rejects a conflicting new slot with a clear message when doctor already has active appointment", () => {
    renderWithProviders(<AppointmentBookingPage />);

    // Dr. Smith has appointment 1 at 10:00 AM Today (Confirmed)
    // Harvey Specter (id: 5) also has Dr. Smith at 03:45 PM Today (Confirmed)
    const harveyRescheduleBtn = screen.getByTestId("reschedule-btn-5");
    fireEvent.click(harveyRescheduleBtn);

    // Try to reschedule Harvey to Dr. Smith's appointment 1 slot
    const dateInput = screen.getByLabelText(/new date/i);
    const timeInput = screen.getByLabelText(/new time/i);

    // Select the conflicting slot
    fireEvent.change(dateInput, { target: { value: normalizeDate("Today") } });
    fireEvent.change(timeInput, { target: { value: "10:00" } });

    const submitBtn = screen.getByTestId("confirm-reschedule-button");
    fireEvent.click(submitBtn);

    // Modal stays open and clear error message is shown
    const errorAlert = screen.getByRole("alert");
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent(/already has another active appointment/i);

    // Close modal without saving
    fireEvent.click(screen.getByTestId("cancel-reschedule-button"));

    // Harvey's appointment remains at 03:45 PM • Today
    expect(screen.getByText(/03:45 PM • Today/)).toBeInTheDocument();
  });

  it("does not allow rescheduling a cancelled appointment", () => {
    renderWithProviders(<AppointmentBookingPage />);

    // Rachel Zane (id: 4) is cancelled
    const cancelledBtn = screen.getByTestId("reschedule-btn-4");
    expect(cancelledBtn).toBeDisabled();

    // Clicking disabled button should not open reschedule modal
    fireEvent.click(cancelledBtn);
    expect(screen.queryByRole("heading", { name: /reschedule appointment/i })).not.toBeInTheDocument();
  });
});
