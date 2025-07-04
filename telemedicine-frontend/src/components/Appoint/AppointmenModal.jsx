// AppointmentModal.jsx (Step-by-step, polished UI)
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./appointmentModal.css";

const stripePromise = loadStripe(
  "pk_test_51RgvdZ2exYP6TLMk5SlzdsKJdWBmJrgmqtdgq6X5tdn0ZXuhGFlo2ZVCPoZAxFGcl7a0SScgBLpb6pZvkqASZ7nC00HRqVrnQn"
);

const AppointmentModal = ({ doctorId, doctorName, onClose }) => {
  return (
    <Elements stripe={stripePromise}>
      <AppointmentModalInner
        doctorId={doctorId}
        doctorName={doctorName}
        onClose={onClose}
      />
    </Elements>
  );
};

const AppointmentModalInner = ({ doctorId, doctorName, onClose }) => {
  const [step, setStep] = useState(1);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [price, setPrice] = useState(null);
  const [confirmationMsg, setConfirmationMsg] = useState("");

  const stripe = useStripe();
  const elements = useElements();

  const formatDateForApi = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatHourMinute = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute] = timeStr.split(":");
    return `${hour}:${minute}`;
  };

  useEffect(() => {
    axios
      .get(
        `https://khamiyevbabek-001-site1.ktempurl.com/api/Schedule/available-dates/${doctorId}`
      )
      .then((res) => {
        const dates = res.data.map((d) => {
          const [y, m, day] = d.split("T")[0].split("-");
          return new Date(Number(y), Number(m) - 1, Number(day));
        });
        setAvailableDates(dates);
      });

    axios
      .get("https://khamiyevbabek-001-site1.ktempurl.com/api/Settings/price")
      .then((res) => setPrice(res.data));
  }, [doctorId]);

  useEffect(() => {
    if (!selectedDate) return;
    axios
      .get(
        "https://khamiyevbabek-001-site1.ktempurl.com/api/Schedule/available-slots",
        {
          params: {
            doctorId,
            date: formatDateForApi(selectedDate),
          },
        }
      )
      .then((res) => {
        const slots = res.data.map((s) => ({
          time: s.start,
          end: s.end,
          scheduleId: s.scheduleId,
        }));
        setAvailableSlots(slots);
      });
  }, [selectedDate, doctorId]);

  const formatDateDisplay = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const handlePayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.info("Zəhmət olmasa daxil olun");

    const { data } = await axios.post(
      "https://khamiyevbabek-001-site1.ktempurl.com/api/Payment/create-payment-intent"
    );
    const result = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { name: "Pasiyent" },
      },
    });

    if (result.error)
      return toast.error("Kart məlumatları düzgün daxil edilməyib.");
    if (result.paymentIntent?.status === "succeeded") {
      await axios.post(
        "https://khamiyevbabek-001-site1.ktempurl.com/api/Schedule/book",
        {
          doctorId,
          scheduleId: selectedSlot.scheduleId,
          notes: "",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const formatted = `${formatDateDisplay(
        selectedDate
      )} - ${formatHourMinute(selectedSlot.time)} - ${formatHourMinute(
        selectedSlot.end
      )}`;

      setConfirmationMsg(
        `✅ Siz ${doctorName} ilə ${formatted} görüş üçün ödəniş etdiniz.`
      );
      setStep(4);
    }
  };

  useEffect(() => {
  if (step === 4) {
    const timeout = setTimeout(() => {
      document.querySelector('.confirm-btn')?.focus();
    }, 5000);
    return () => clearTimeout(timeout);
  }
}, [step]);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ position: "static" }}>
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <ToastContainer />

        {step === 1 && (
          <>
            <h3>1. Tarixi seçin</h3>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setSelectedSlot(null);
              }}
              includeDates={availableDates}
              minDate={new Date()}
              placeholderText="Tarix seçin"
              dateFormat="dd/MM/yyyy" // AYAR BURDA
              portalId="root-datepicker-portal"
            />

            {selectedDate && availableSlots.length > 0 && (
              <div className="slots-container">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.scheduleId}
                    className={`slot-btn ${
                      selectedSlot?.scheduleId === slot.scheduleId
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {formatHourMinute(slot.time)} - {formatHourMinute(slot.end)}
                  </button>
                ))}
              </div>
            )}
            <button
              className="confirm-btn"
              onClick={() => selectedSlot && setStep(2)}
              disabled={!selectedSlot}
            >
              Davam et
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h3>2. Ödəniş məbləği</h3>
            <p className="price-label">
              Ödəniləcək məbləğ: <strong>{price} ₼</strong>
            </p>
            <button className="confirm-btn" onClick={() => setStep(3)}>
              Kartla ödəməyə keç
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h3>3. Kart məlumatları</h3>
            <div className="stripe-card">
              <CardElement options={{ hidePostalCode: true }} />
            </div>
            <button className="confirm-btn" onClick={handlePayment}>
              Ödə və görüşü təyin et
            </button>
          </>
        )}

        {step === 4 && (
  <div className="confirmation-message modern-success">
    <div className="circle-loader success">
      <div className="checkmark draw"></div>
    </div>
    <p>{confirmationMsg}</p>
    <button className="confirm-btn" onClick={onClose}>Bağla</button>
  </div>
)}
      </div>
    </div>
  );
};

export default AppointmentModal;
