import React from "react";
import StarField from "./components/StarField";
import ScrollProgress from "./components/ScrollProgress";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import WhatIDo from "./components/WhatIDo";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import "./App.css";

export default function App() {
  return (
    <>
      <StarField />
      <ScrollProgress />
      <Nav />
      <main className="page">
        <Hero />
        <WhatIDo />
        <Experience />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
