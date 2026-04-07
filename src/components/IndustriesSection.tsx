"use client";

import React from "react";
import { FadeUp } from "./MotionWrappers";

const industries = [
  { name: "E-commerce", icon: "🛒" },
  { name: "Manufacturing", icon: "🏭" },
  { name: "Education", icon: "🎓" },
  { name: "Healthcare", icon: "🏥" },
  { name: "SaaS Platforms", icon: "🚀" },
  { name: "Banking & Finance", icon: "🏦" },



];

const IndustriesSection = () => {
  return (
    <section className="section-padding bg-slate-50 border-y border-slate-100">
      <div className="container">
        <FadeUp className="text-center mb-16">
          <h2 className="section-title">Industries We Serve</h2>
          <p className="section-subtitle">
            We deliver solutions across multiple industries with modern technology.
          </p>
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {industries.map((item, index) => (
            <FadeUp key={index} delay={index * 0.1}>
              <div className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center flex flex-col items-center justify-center h-full">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-800 tracking-tight leading-tight">
                  {item.name}
                </h3>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
