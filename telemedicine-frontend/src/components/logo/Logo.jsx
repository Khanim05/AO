import logoImg from '../../images/medicine.png'
import './logo.css'
const Logo = () => {
  return (
    <div id='logo-area'>
        <div className="logo-box">
        <img src={logoImg} alt="Telemedicine Logo" className='image' />
        <h1>Telemedicine</h1>
      </div>
    </div>
  )
}

export default Logo
