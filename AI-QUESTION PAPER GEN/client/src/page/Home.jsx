import React from 'react'
import AiTools from '../components/AiTools'
import Navbar from '../components/Navbar'
import Role from '../components/Role'
import Features from '../components/Feature'
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer'

const Home = () => {

  let token = localStorage.getItem("token");



  return (
    <div>
      <Navbar />
      <AiTools />
      {!token && <Role />}
      <Features />
      <Testimonials />
      <Footer />
    </div>
  )
}

export default Home
