import { useState } from "react";
import "./doctorSeans.css";
import ManageSession from "./manage/ManageSession";
import AddSession from "./addSession/AddSession";

const DoctorSeans = () => {
  const [activeModal, setActiveModal] = useState(null); // "add", "manage", "restore"

  return (
    <div className="doctor-seans-container">
      <div className="doctor-seans-header">
        <h2>Seans Növlərini İdarə Et</h2>
        <p>Sistemə yeni seans növü əlavə edə, mövcudları silə və ya əvvəl silinmişləri bərpa edə bilərsiniz.</p>
      </div>

      <div className="doctor-seans-grid">
        <div className="seans-card add" onClick={() => setActiveModal("add")}>Yeni Seans Növü Əlavə Et</div>
        <div className="seans-card manage" onClick={() => setActiveModal("manage")}>Seans Növünü Sil</div>
        {/* <div className="seans-card restore" onClick={() => setActiveModal("restore")}>Seans Növünü Bərpa Et</div> */}
      </div>

      {/* Modal komponentləri */}
      {activeModal === "add" && <AddSession onClose={() => setActiveModal(null)} />}
      {activeModal === "manage" && <ManageSession onClose={() => setActiveModal(null)} />}
      {/* {activeModal === "restore" && <RestoreSession onClose={() => setActiveModal(null)} />} */}
    </div>
  );
};

export default DoctorSeans;
