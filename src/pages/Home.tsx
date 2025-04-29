import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "/logocoi.png";
import BuyMeACoffee from '../components/BuyMeACoffee';

const Home: React.FC = () => {
  const [generation, setGeneration] = useState<number>(5);
  const [sireNames, setSireNames] = useState<{ [key: string]: string }>({});
  const [damNames, setDamNames] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [bulkSireData, setBulkSireData] = useState<string>("");
  const [bulkDamData, setBulkDamData] = useState<string>("");
  const [sireInputMode, setSireInputMode] = useState<"manual" | "bulk">("manual");
  const [damInputMode, setDamInputMode] = useState<"manual" | "bulk">("manual");
  const resultRef = useRef<HTMLDivElement | null>(null);

  const handleGenerationChange = (gen: number) => {
    setGeneration(gen);
    setSireNames({});
    setDamNames({});
    setResult("");
    setBulkSireData("");
    setBulkDamData("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, side: "sire" | "dam") => {
    const { name, value } = e.target;
    if (side === "sire") {
      setSireNames((prev) => ({ ...prev, [name]: value }));
    } else {
      setDamNames((prev) => ({ ...prev, [name]: value }));
    }
  };

  const parseBulkSireData = () => {
    const lines = bulkSireData.split("\n").map(line => line.trim()).filter(Boolean);
    const newSireData: { [key: string]: string } = {};
    lines.forEach((name, index) => {
      newSireData[`sire${index + 1}`] = name;
    });
    setSireNames(newSireData);
    setSireInputMode("manual");
  };

  const parseBulkDamData = () => {
    const lines = bulkDamData.split("\n").map(line => line.trim()).filter(Boolean);
    const newDamData: { [key: string]: string } = {};
    lines.forEach((name, index) => {
      newDamData[`dam${index + 1}`] = name;
    });
    setDamNames(newDamData);
    setDamInputMode("manual");
  };

  const calculateCOI = () => {
    const generationMap: { [key: string]: number } = {
      // Sire side
      sire1: 0,
      sire2: 1, sire3: 1,
      sire4: 2, sire5: 2, sire6: 2, sire7: 2,
      sire8: 3, sire9: 3, sire10: 3, sire11: 3, sire12: 3, sire13: 3, sire14: 3, sire15: 3,
      // Dam side
      dam1: 0,
      dam2: 1, dam3: 1,
      dam4: 2, dam5: 2, dam6: 2, dam7: 2,
      dam8: 3, dam9: 3, dam10: 3, dam11: 3, dam12: 3, dam13: 3, dam14: 3, dam15: 3,
    };
  
    let ancestorsSeen: { [key: string]: number } = {};
  
    const processSide = (sideNames: { [key: string]: string }) => {
      Object.entries(sideNames).forEach(([key, name]) => {
        if (!name) return;
        let ancestorsSeen: { [key: string]: string } = {};
      });
    };
  
    processSide(sireNames);
    processSide(damNames);
  
    let coi = 0;
  
    Object.keys(ancestorsSeen).forEach((ancestor) => {
      const sireFields = Object.entries(sireNames).filter(([, v]) => v === ancestor).map(([k]) => k);
      const damFields = Object.entries(damNames).filter(([, v]) => v === ancestor).map(([k]) => k);
  
      if (sireFields.length > 0 && damFields.length > 0) {
        const n1 = generationMap[sireFields[0]] ?? 0;
        const n2 = generationMap[damFields[0]] ?? 0;
        coi += Math.pow(0.5, n1 + n2 + 1);
      }
    });
  
    return coi;
  };
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (Object.keys(sireNames).length === 0 || Object.keys(damNames).length === 0) {
      alert("Please fill both Sire and Dam fields before calculating!");
      return;
    }
  
    setLoading(true);
  
    setTimeout(() => {
      const coiDecimal = calculateCOI();
      const coiPercentage = (coiDecimal * 100).toFixed(2);
  
      let label = "";
      if (coiDecimal < 0.0625) label = "Excellent - Very low inbreeding.";
      else if (coiDecimal < 0.125) label = "Good - Acceptable.";
      else if (coiDecimal < 0.20) label = "Moderate risk - Caution.";
      else label = "High risk - Avoid if possible.";
  
      setResult(`Inbreeding: ${coiDecimal.toFixed(2)} (${coiPercentage}%)`);
      setLoading(false);
  
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 2000);
  };
  
  const downloadResult = async () => {
    if (!result) return;
  
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    const doc = new jsPDF();
  
    // Load logo
    const logoUrl = "/logocoi.png"; // Assuming it's inside /public
    const logoImage = await new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.src = logoUrl;
      img.onload = () => resolve(img);
    });
  
    // --- HEADER ---
    doc.setFillColor(230, 255, 230); // Light green background
    doc.rect(0, 0, 210, 30, "F");
    doc.setDrawColor(180); // Light grey
doc.rect(5, 5, 200, 287); // Small margins (5px in from edges)
  
    if (logoImage) {
      doc.addImage(logoImage, "PNG", 10, 7, 16, 16); // logo left
    }
  
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 100, 0);
    doc.text("COI Report", 105, 18, { align: "center" });
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`Generated on: ${dateStr}`, 160, 25, { align: "right" });
  
    // --- RESULT SECTION ---
    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text("Calculation Result:", 14, 45);
  
    doc.setFontSize(14);
    doc.setTextColor(34, 34, 34);
  
    const resultLines = result.split("\n");
    let currentY = 55;
    resultLines.forEach((line) => {
      doc.text(line, 20, currentY);
      currentY += 10;
    });
  
    // --- INTERPRETATION TEXT ---
    doc.setFontSize(12);
    doc.setTextColor(70);
    doc.text(
      "Lower COI indicates higher genetic diversity and lower risk of inherited conditions. Higher COI values suggest greater genetic similarity and higher potential risks. Breeders should aim for the lowest possible COI.",
      20,
      currentY + 5,
      { maxWidth: 170 }
    );
  
    currentY += 30; // Space down a bit
  
    // --- RISK SCALE ---
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("COI Risk Scale:", 14, currentY);
  
    const scaleData = [
      { color: [0, 200, 0], label: "0% - 6.25% = Excellent" },
      { color: [255, 215, 0], label: "6.25% - 12.5% = Good" },
      { color: [255, 140, 0], label: "12.5% - 20% = Moderate Risk" },
      { color: [255, 0, 0], label: "20%+ = High Risk" },
    ];
  
    let graphY = currentY + 10;
    scaleData.forEach((item) => {
      doc.setFillColor(item.color[0], item.color[1], item.color[2]);
      doc.rect(20, graphY - 5, 5, 5, "F"); // colored box
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(item.label, 30, graphY);
      graphY += 8;
    });
  
    graphY += 10; // small extra gap before the table
  
    // --- PEDIGREE TABLE ---
    const maxLength = Math.max(
        Object.keys(sireNames).length,
        Object.keys(damNames).length
      );
      
      const tableBody = Array.from({ length: maxLength }).map((_, idx) => [
        (sireNames[`sire${idx + 1}`] && sireNames[`sire${idx + 1}`].trim()) || "-",
        (damNames[`dam${idx + 1}`] && damNames[`dam${idx + 1}`].trim()) || "-",
      ]);
  
      autoTable(doc, {
        head: [["Sire Line", "Dam Line"]],
        body: tableBody,
        startY: graphY,
        theme: "grid", // <- "grid" gives nice clean borders
        headStyles: {
          fillColor: [100, 200, 100],
          textColor: 0,
          halign: "center",
          fontSize: 12,
        },
        bodyStyles: {
          fontSize: 11,
          halign: "center",
          cellPadding: 2,
        },
        styles: { lineWidth: 0.2, lineColor: 180 },
        margin: { left: 10, right: 10 },
        tableWidth: "auto",
      });
      
  
// --- FOOTER ---
doc.setFontSize(9);
doc.setTextColor(150);

// Disclaimer
doc.text(
  "This COI report is for informational purposes only and is not veterinary advice.",
  105,
  285, // moved a little higher
  { align: "center" }
);

// Bonus branding line
doc.text(
  "© 2025 ByteVixen. All rights reserved.",
  105,
  291, // placed underneath nicely
  { align: "center" }
);

    // --- SAVE ---
    doc.save(`coi-report-${dateStr}.pdf`);
  };
  
  
  const renderInputs = (side: "sire" | "dam") => {
    const labels = [
      { section: "Main", entries: [`${side === "sire" ? "Sire" : "Dam"}`] },
      { section: "Parents", entries: ["Father", "Mother"] },
      { section: "Grandparents", entries: [
        "Paternal Grandfather", "Paternal Grandmother",
        "Maternal Grandfather", "Maternal Grandmother",
      ]}
    ];

    if (generation === 5) {
      labels.push({
        section: "Great-Grandparents",
        entries: [
          "Paternal Great-Grandfather", "Paternal Great-Grandmother",
          "Paternal Great-Grandfather", "Paternal Great-Grandmother",
          "Maternal Great-Grandfather", "Maternal Great-Grandmother",
          "Maternal Great-Grandfather", "Maternal Great-Grandmother",
        ],
      });
    }

    let count = 1;
    return labels.map((group, idx) => (
      <div key={idx} className="mb-10 relative">
        <h4 className="text-lg font-semibold mb-2 mt-4 text-center">{group.section}</h4>
        <div className="space-y-4">
          {group.entries.map((label) => (
            <div key={count} className="mb-2">
              <label className="block mb-1 font-semibold">{label}:</label>
              <input
                type="text"
                name={`${side}${count}`}
                value={side === "sire" ? sireNames[`sire${count}`] || "" : damNames[`dam${count}`] || ""}
                onChange={(e) => handleInputChange(e, side)}
                className="w-full p-2 border rounded"
                required
              />
              {count++}
            </div>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <section className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Enter Pedigree Information</h2>

      <div className="flex justify-center mb-6 space-x-2">
        <button onClick={() => handleGenerationChange(3)} className={`px-4 py-2 rounded-l ${generation === 3 ? "bg-green-600 text-white" : "bg-gray-200"}`}>
          3 Generations
        </button>
        <button onClick={() => handleGenerationChange(5)} className={`px-4 py-2 rounded-r ${generation === 5 ? "bg-green-600 text-white" : "bg-gray-200"}`}>
          5 Generations
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-6 space-y-6 md:space-y-0">
          {/* Sire Line */}
          <div className="bg-green-100 p-6 rounded-2xl shadow-lg group">
            <h3 className="text-2xl font-bold mb-4 text-green-800 text-center">Sire Line</h3>
            <div className="flex justify-center mb-4 space-x-2">
              <button
                type="button"
                onClick={() => setSireInputMode("manual")}
                className={`px-4 py-2 rounded-l ${sireInputMode === "manual" ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                Manual
              </button>
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => setSireInputMode("bulk")}
                  className={`px-4 py-2 rounded-r ${sireInputMode === "bulk" ? "bg-green-600 text-white" : "bg-gray-200"}`}
                >
                  Bulk Paste
                </button>
                <div className="absolute bottom-full mb-2 w-56 bg-black text-white text-xs text-center rounded py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  Paste one ancestor per line
                </div>
              </div>
            </div>
            {sireInputMode === "manual" ? renderInputs("sire") : (
              <>
                <textarea
                  value={bulkSireData}
                  onChange={(e) => setBulkSireData(e.target.value)}
                  className="w-full h-40 p-3 border border-green-300 rounded resize-none"
                  placeholder="Paste ancestors here..."
                />
                <button
                  type="button"
                  onClick={parseBulkSireData}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
                >
                  Fill Sire Fields
                </button>
              </>
            )}
          </div>

          {/* Dam Line */}
          <div className="bg-pink-100 p-6 rounded-2xl shadow-lg group">
            <h3 className="text-2xl font-bold mb-4 text-pink-800 text-center">Dam Line</h3>
            <div className="flex justify-center mb-4 space-x-2">
              <button
                type="button"
                onClick={() => setDamInputMode("manual")}
                className={`px-4 py-2 rounded-l ${damInputMode === "manual" ? "bg-pink-500 text-white" : "bg-gray-200"}`}
              >
                Manual
              </button>
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => setDamInputMode("bulk")}
                  className={`px-4 py-2 rounded-r ${damInputMode === "bulk" ? "bg-pink-500 text-white" : "bg-gray-200"}`}
                >
                  Bulk Paste
                </button>
                <div className="absolute bottom-full mb-2 w-56 bg-black text-white text-xs text-center rounded py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  Paste one ancestor per line
                </div>
              </div>
            </div>
            {damInputMode === "manual" ? renderInputs("dam") : (
              <>
                <textarea
                  value={bulkDamData}
                  onChange={(e) => setBulkDamData(e.target.value)}
                  className="w-full h-40 p-3 border border-pink-300 rounded resize-none"
                  placeholder="Paste ancestors here..."
                />
                <button
                  type="button"
                  onClick={parseBulkDamData}
                  className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded"
                >
                  Fill Dam Fields
                </button>
              </>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-6 space-x-4">
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded">Calculate COI</button>
          <button type="button" onClick={() => { setSireNames({}); setDamNames({}); setResult(""); }}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded">
            Reset
          </button>
          <button type="button" onClick={downloadResult} disabled={!result}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded disabled:opacity-50">
            Download
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center mt-8">
            <img src="/dog-loading.svg" alt="Loading..." className="w-24 animate-run" />
          </div>
        )}

        {/* Result */}
        {!loading && result && (
  <div
    ref={resultRef}
    className="mt-8 p-6 bg-green-100 text-green-800 rounded shadow text-center text-xl font-semibold animate-fade-glow whitespace-pre-line"
  >
            {result}
          </div>
        )}

      </form>
      <BuyMeACoffee />
    </section>
  );
};

export default Home;
