import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./appointmentModal.css";
import axios from "axios";

const AppointmentModal = ({ doctorId, doctorName, onClose }) => {
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmationMsg, setConfirmationMsg] = useState("");

  // ✅ Saat formatlama (məsələn: 09:00)
  const formatHourMinute = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    return `${hour}:${minute}`;
  };

  // 1. Tarixləri yüklə
  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await axios.get(
          `https://khamiyevbabek-001-site1.ktempurl.com/api/Schedule/available-dates/${doctorId}`
        );

        const parsedDates = res.data.map((isoDate) => {
          const [year, month, day] = isoDate.split("T")[0].split("-");
          return new Date(Number(year), Number(month) - 1, Number(day));
        });

        setAvailableDates(parsedDates);
      } catch (error) {
        console.error("Tarixləri almaqda xəta:", error);
      }
    };

    fetchDates();
  }, [doctorId]);

  // 2. Seçilmiş günə uyğun boş saatları yüklə
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate) return;
      try {
        const res = await axios.get(
          "https://khamiyevbabek-001-site1.ktempurl.com/api/Schedule/available-slots",
          {
            params: {
              doctorId,
              date: selectedDate.toISOString().split("T")[0], // ✅ düz tarixi göndər
            },
          }
        );

        const mapped = res.data.map((slot) => ({
          time: slot.start,
          end: slot.end,
          scheduleId: slot.scheduleId,
        }));

        setAvailableSlots(mapped);
      } catch (error) {
        console.error("Boş saatları almaqda xəta:", error);
      }
    };

    fetchSlots();
  }, [selectedDate, doctorId]);

  // 3. Görüş təyin et
  const handleBook = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Zəhmət olmasa daxil olun.");
        return;
      }

      await axios.post(
        "https://khamiyevbabek-001-site1.ktempurl.com/api/Schedule/book",
        {
          doctorId,
          scheduleId: selectedSlot.scheduleId,
          notes: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dateObj = new Date(selectedDate);
      const day = dateObj.getDate().toString().padStart(2, "0");
      const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
      const year = dateObj.getFullYear();

      const formattedDate = `${day}.${month}.${year}`;
      const slotStart = formatHourMinute(selectedSlot.time);
      const slotEnd = formatHourMinute(selectedSlot.end);

      setConfirmationMsg(
        `✅ Siz ${doctorName} ilə ${formattedDate} tarixində, ${slotStart} - ${slotEnd} saatı üçün görüş təyin etdiniz.`
      );
    } catch (error) {
      console.error("Görüş təyin edilərkən xəta:", error);
      alert("Görüş təyin edilə bilmədi.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>

        {!confirmationMsg && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label htmlFor="datepicker" style={{ fontWeight: 600 }}>Tarixi seçin:</label>
              <DatePicker
                id="datepicker"
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                  setConfirmationMsg("");
                }}
                includeDates={availableDates}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                placeholderText="Tarix seçin"
              />
            </div>
          </>
        )}

        {selectedDate && !confirmationMsg && (
          <>
            <h4>Boş saatlar:</h4>
            <div className="slots-container">
              {availableSlots.length === 0 && <p>Boş saat yoxdur.</p>}
              {availableSlots.map((slot, i) => (
                <button
                  key={i}
                  className={`slot-btn ${selectedSlot?.scheduleId === slot.scheduleId ? "selected" : ""}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {formatHourMinute(slot.time)} - {formatHourMinute(slot.end)}
                </button>
              ))}
            </div>

            {selectedSlot && (
              <div className="confirm-wrapper">
                <button className="confirm-btn" onClick={handleBook}>Təsdiqlə</button>
              </div>
            )}
          </>
        )}

        {confirmationMsg && (
          <div className="confirmation-message">
            <p>{confirmationMsg}</p>
            <button className="confirm-btn" onClick={onClose}>Bağla</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentModal;
