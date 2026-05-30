import React from "react";

import MainHero from "../../../components/home/Hero/Hero.jsx";
import IphoneAir from "../../../components/home/Showcase2/Showcase2.jsx";
import Latest from "../../../components/home/Showcase1/Showcase1.jsx";
import Footer from "../../../components/layout/Footer/Footer.jsx";

import "./Home.css";

const Home = () => {
  return (
    <div className="home-page">
      <MainHero />

      <section className="home-showcase-section">
        <IphoneAir />
        <Latest />
      </section>

      <div className="home-footer-wrap">
        <Footer />
      </div>
    </div>
  );
};

export default Home;