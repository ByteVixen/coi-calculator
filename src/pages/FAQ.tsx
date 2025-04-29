import React, { useState } from "react";

const FAQ: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <section className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-extrabold mb-10 text-center text-green-700">Frequently Asked Questions</h2>

      {/* USING THE CALCULATOR */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold mb-8 text-green-600">Using the COI Calculator</h3>

        <div className="space-y-6">
          {/* How to use */}
          <div className="bg-gray-100 rounded-xl shadow p-4 transition hover:shadow-lg">
            <button
              onClick={() => toggleSection("how-use")}
              className="w-full text-left text-lg font-bold"
            >
              📋 How do I enter pedigree data?
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openSection === "how-use" ? "max-h-96 mt-2" : "max-h-0"}`}>
              {openSection === "how-use" && (
                <div className="mt-2 text-gray-700">
                  You can manually type each ancestor OR bulk paste them — one ancestor per line.
                  After pasting, click <b>Fill Fields</b> to auto-populate the pedigree fields!
                </div>
              )}
            </div>
          </div>

          {/* Bulk tips */}
          <div className="bg-gray-100 rounded-xl shadow p-4 transition hover:shadow-lg">
            <button
              onClick={() => toggleSection("bulk-tips")}
              className="w-full text-left text-lg font-bold"
            >
              🧹 Bulk Paste Tips
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openSection === "bulk-tips" ? "max-h-96 mt-2" : "max-h-0"}`}>
              {openSection === "bulk-tips" && (
                <div className="mt-2 text-gray-700">
                  Make sure each ancestor is on its own line.<br />
                  Format: Dog → Parents → Grandparents → Great-grandparents.<br />
                  Start from the main dog at the top!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ABOUT INBREEDING */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold mb-8 text-pink-600">Understanding Inbreeding and COI</h3>

        <div className="space-y-6">
          {/* What is inbreeding */}
          <div className="bg-gray-100 rounded-xl shadow p-4 transition hover:shadow-lg">
            <button
              onClick={() => toggleSection("what-inbreeding")}
              className="w-full text-left text-lg font-bold"
            >
              🧬 What is inbreeding?
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openSection === "what-inbreeding" ? "max-h-96 mt-2" : "max-h-0"}`}>
              {openSection === "what-inbreeding" && (
                <div className="mt-2 text-gray-700">
                  Inbreeding happens when related dogs are bred together. Higher inbreeding can lead to more inherited health problems, smaller litters, and reduced overall vitality.
                </div>
              )}
            </div>
          </div>

          {/* What does COI mean */}
          <div className="bg-gray-100 rounded-xl shadow p-4 transition hover:shadow-lg">
            <button
              onClick={() => toggleSection("coi-meaning")}
              className="w-full text-left text-lg font-bold"
            >
              🔍 What does the COI % mean?
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openSection === "coi-meaning" ? "max-h-96 mt-2" : "max-h-0"}`}>
              {openSection === "coi-meaning" && (
                <div className="mt-2 text-gray-700">
                  COI (Coefficient of Inbreeding) measures the chance that two genes are identical by descent.
                  A <b>lower</b> COI means more genetic diversity = better health outcomes!
                </div>
              )}
            </div>
          </div>

          {/* Good vs Bad COI */}
          <div className="bg-gray-100 rounded-xl shadow p-4 transition hover:shadow-lg">
            <button
              onClick={() => toggleSection("good-bad-scale")}
              className="w-full text-left text-lg font-bold"
            >
              📈 What does a "good" COI look like?
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openSection === "good-bad-scale" ? "max-h-96 mt-2" : "max-h-0"}`}>
              {openSection === "good-bad-scale" && (
                <div className="mt-2 text-gray-700">
                  <ul className="list-disc list-inside space-y-2">
                    <li><b>0% - 5%</b>: 🟢 Excellent! Very low inbreeding.</li>
                    <li><b>6% - 10%</b>: 🟡 Good. Acceptable.</li>
                    <li><b>11% - 20%</b>: 🟠 Moderate risk. Use caution.</li>
                    <li><b>21%+</b>: 🔴 High risk. Avoid if possible.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CALCULATION SCIENCE */}
      <div className="mb-16">
        <h3 className="text-2xl font-bold mb-8 text-purple-600">Behind the Scenes: How the COI Calculator Works</h3>

        <div className="space-y-6">
          {/* Formula */}
          <div className="bg-gray-100 rounded-xl shadow p-4 transition hover:shadow-lg">
            <button
              onClick={() => toggleSection("calculation-method")}
              className="w-full text-left text-lg font-bold"
            >
              🧠 How is the COI calculated?
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openSection === "calculation-method" ? "max-h-96 mt-2" : "max-h-0"}`}>
              {openSection === "calculation-method" && (
                <div className="mt-2 text-gray-700">
                  We calculate COI using the formula: <br />
                  <code>COI = Σ (0.5)<sup>n1 + n2 + 1</sup></code><br />
                  where n1 and n2 are the number of generations from sire and dam to the common ancestor.
                  Every shared ancestor adds to the total COI.
                </div>
              )}
            </div>
          </div>

          {/* Why 5 gens */}
          <div className="bg-gray-100 rounded-xl shadow p-4 transition hover:shadow-lg">
            <button
              onClick={() => toggleSection("why-5-generations")}
              className="w-full text-left text-lg font-bold"
            >
              🧬 Why use 5 generations instead of 3?
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openSection === "why-5-generations" ? "max-h-96 mt-2" : "max-h-0"}`}>
              {openSection === "why-5-generations" && (
                <div className="mt-2 text-gray-700">
                  Looking deeper into 5 generations allows better detection of shared ancestry.
                  Sometimes close relationships only show up in great-grandparents! More complete = more accurate COI.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
