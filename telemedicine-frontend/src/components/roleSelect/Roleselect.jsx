import './roleSelect.css'
const Roleselect = ({handleSelect}) => {
 
    return (
   <div className="role-select">
  <h2>Necə qeydiyyatdan keçmək istəyirsiniz?</h2>
  <div className="role-options">
    <div className="role-card" onClick={() => handleSelect('doctor')}>
      <i className="fa-solid fa-user-doctor icon"></i>
      <h3>Həkim kimi</h3>
    </div>
    <div className="role-card" onClick={() => handleSelect('patient')}>
      <i className="fa-solid fa-user icon"></i>
      <h3>Pasiyent kimi</h3>
    </div>
  </div>
</div>

  )
}

export default Roleselect
