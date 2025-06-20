import React from 'react'
import Main from '../../components/main/Main'
import Service from '../../components/service/Service'
import About from '../../components/about/About'
import Doctors from '../../components/doctors/Doctors'

const Home = () => {
  return (
    <div className='home-page'>
      <Main/>
      <Service/>
      <About/>
      <Doctors/>
    </div>
  )
}

export default Home
