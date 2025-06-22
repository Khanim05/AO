import Main from '../../components/main/Main'
import Service from '../../components/service/Service'
import About from '../../components/about/About'
import Doctors from '../../components/doctors/Doctors'
import Contact from '../../components/contact/Contact'


const Home = () => {
  return (
    <div className='home-page'>
      <Main/>
      <Service/>
      <About/>
      <Doctors/>
      <Contact/>
    </div>
  )
}

export default Home
