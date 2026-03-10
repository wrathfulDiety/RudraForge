import { useState } from "react";
import countriesData from "../data/countries.json";

const COUNTRIES = countriesData;
const REGIONS = [...new Set(Object.values(COUNTRIES).map(c => c.region))];

const FORMATS = [
  { id: "dot",        label: "firstname.lastname",   example: "john.smith",   fn: (f,l) => `${f}.${l}` },
  { id: "nodot",      label: "firstnamelastname",    example: "johnsmith",    fn: (f,l) => `${f}${l}` },
  { id: "f_dot_last", label: "f.lastname",           example: "j.smith",      fn: (f,l) => `${f[0]}.${l}` },
  { id: "flast",      label: "flastname",            example: "jsmith",       fn: (f,l) => `${f[0]}${l}` },
  { id: "first_li",   label: "firstname.l",          example: "john.s",       fn: (f,l) => `${f}.${l[0]}` },
  { id: "firstl",     label: "firstnamel",           example: "johns",        fn: (f,l) => `${f}${l[0]}` },
  { id: "rev_dot",    label: "lastname.firstname",   example: "smith.john",   fn: (f,l) => `${l}.${f}` },
  { id: "rev_nodot",  label: "lastnamefirstname",    example: "smithjohn",    fn: (f,l) => `${l}${f}` },
  { id: "rev_init",   label: "lastname.f",           example: "smith.j",      fn: (f,l) => `${l}.${f[0]}` },
  { id: "rev_init2",  label: "lastnamef",            example: "smithj",       fn: (f,l) => `${l}${f[0]}` },
  { id: "initials",   label: "fl (initials)",        example: "js",           fn: (f,l) => `${f[0]}${l[0]}` },
  { id: "us",         label: "firstname_lastname",   example: "john_smith",   fn: (f,l) => `${f}_${l}` },
  { id: "us_init",    label: "f_lastname",           example: "j_smith",      fn: (f,l) => `${f[0]}_${l}` },
  { id: "rev_us",     label: "lastname_firstname",   example: "smith_john",   fn: (f,l) => `${l}_${f}` },
  { id: "rev_us_i",   label: "lastname_f",           example: "smith_j",      fn: (f,l) => `${l}_${f[0]}` },
  { id: "all",        label: "★ ALL FORMATS",        example: "all above",    fn: null },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Orbitron:wght@700;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { font-size: 16px; }

  body {
    background: #060a06;
    color: #d4e8d4;
    font-family: 'JetBrains Mono', monospace;
    -webkit-text-size-adjust: 100%;
  }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: #0a0f0a; }
  ::-webkit-scrollbar-thumb { background: #1a4a1a; border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: #00ff41; }

  /* ── PAGE ── */
  .page {
    min-height: 100vh;
    background: #060a06;
    background-image:
      linear-gradient(rgba(0,255,65,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,255,65,0.025) 1px, transparent 1px),
      radial-gradient(ellipse at 15% 15%, rgba(0,60,0,0.35) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 85%, rgba(0,20,40,0.35) 0%, transparent 55%);
    background-size: 40px 40px, 40px 40px, 100% 100%, 100% 100%;
    padding: 1.5rem 1.5rem;
  }

  /* ── HEADER ── */
  .header {
    border-bottom: 1px solid rgba(0,255,65,0.2);
    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .title {
    font-family: 'Orbitron', monospace;
    font-size: clamp(1.4rem, 5vw, 2.1rem);
    font-weight: 900;
    letter-spacing: 0.06em;
    background: linear-gradient(90deg, #00ff41 0%, #00dd35 50%, #00ffaa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 16px rgba(0,255,65,0.35));
  }

  .subtitle {
    color: #4a8a4a;
    font-size: clamp(0.7rem, 2.5vw, 0.82rem);
    margin-top: 0.35rem;
    letter-spacing: 0.03em;
  }

  .subtitle span { color: #00cc33; }

  .entries-ready {
    font-family: 'Orbitron', monospace;
    color: #00ff41;
    font-size: clamp(0.75rem, 2.5vw, 0.9rem);
    filter: drop-shadow(0 0 8px rgba(0,255,65,0.5));
    white-space: nowrap;
  }

  /* ── DESKTOP 3-COL GRID ── */
  .grid {
    display: grid;
    grid-template-columns: 200px 245px 1fr;
    gap: 1.5rem;
  }

  .col { display: flex; flex-direction: column; gap: 1.1rem; }

  /* ── SECTION LABEL ── */
  .section-label {
    color: #00ff41;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(0,255,65,0.3), transparent);
  }

  /* ── ACCORDION (mobile only) ── */
  .accordion-header {
    display: none;
    width: 100%;
    background: rgba(0,255,65,0.04);
    border: 1px solid rgba(0,255,65,0.2);
    border-radius: 3px;
    color: #00ff41;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.88rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    padding: 0.75rem 1rem;
    cursor: pointer;
    text-align: left;
    justify-content: space-between;
    align-items: center;
    transition: all 0.15s;
  }

  .accordion-header:hover { background: rgba(0,255,65,0.08); }
  .accordion-header .chevron { transition: transform 0.2s; font-size: 0.75rem; }
  .accordion-header.open .chevron { transform: rotate(180deg); }
  .accordion-content { display: block; }

  /* ── BUTTONS ── */
  .btn-list { display: flex; flex-direction: column; gap: 0.25rem; }

  .btn {
    background: transparent;
    border: 1px solid rgba(0,255,65,0.1);
    color: #6aaa6a;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.84rem;
    text-align: left;
    transition: all 0.15s;
    width: 100%;
    border-radius: 2px;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .btn:hover { background: rgba(0,255,65,0.05); border-color: rgba(0,255,65,0.3); color: #aaeeaa; }

  .btn.active {
    background: rgba(0,255,65,0.08);
    border-color: #00ff41;
    color: #00ff41;
    box-shadow: 0 0 10px rgba(0,255,65,0.12), inset 0 0 10px rgba(0,255,65,0.04);
  }

  .btn-indicator { color: #00ff41; font-size: 0.6rem; width: 10px; flex-shrink: 0; }

  .fmt-btn {
    background: transparent;
    border: 1px solid rgba(0,255,65,0.1);
    color: #6aaa6a;
    padding: 0.45rem 0.75rem;
    cursor: pointer;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.82rem;
    text-align: left;
    transition: all 0.15s;
    width: 100%;
    border-radius: 2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .fmt-btn:hover { background: rgba(0,255,65,0.05); border-color: rgba(0,255,65,0.3); color: #aaeeaa; }

  .fmt-btn.active {
    background: rgba(0,255,65,0.08);
    border-color: #00ff41;
    color: #00ff41;
    box-shadow: 0 0 10px rgba(0,255,65,0.12), inset 0 0 10px rgba(0,255,65,0.04);
  }

  .fmt-example { font-size: 0.68rem; opacity: 0.45; }
  .fmt-btn.active .fmt-example { opacity: 0.65; color: #00cc33; }

  /* ── COUNTRY LIST ── */
  .country-list {
    display: flex;
    flex-direction: column;
    gap: 0.22rem;
    max-height: 260px;
    overflow-y: auto;
    padding-right: 2px;
  }

  /* ── DOMAIN INPUT ── */
  .domain-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(0,255,65,0.03);
    border: 1px solid rgba(0,255,65,0.15);
    padding: 0.1rem 0.75rem 0.1rem 0.6rem;
    border-radius: 2px;
  }

  .at-sign { color: #00ff41; font-size: 1.1rem; font-weight: 700; flex-shrink: 0; }

  .domain-input {
    background: transparent;
    border: none;
    color: #00ff41;
    padding: 0.6rem 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 1rem;
    width: 100%;
    outline: none;
    letter-spacing: 0.03em;
  }

  .domain-input::placeholder { color: #2a5a2a; }

  /* ── STATS ── */
  .stats-box {
    background: rgba(0,8,0,0.7);
    border: 1px solid rgba(0,255,65,0.12);
    padding: 0.85rem 1rem;
    border-radius: 2px;
  }

  .stat-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.82rem;
    color: #4a7a4a;
    padding: 0.15rem 0;
  }

  .stat-row span { color: #00cc33; font-weight: 600; }

  .stat-row.highlight {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(0,255,65,0.1);
  }

  .stat-row.highlight span {
    color: #00ff41;
    font-size: 0.95rem;
    filter: drop-shadow(0 0 5px rgba(0,255,65,0.45));
  }

  /* ── GENERATE BUTTON ── */
  .gen-btn {
    background: linear-gradient(135deg, rgba(0,255,65,0.1), rgba(0,180,40,0.07));
    border: 1px solid #00ff41;
    color: #00ff41;
    padding: 1rem;
    cursor: pointer;
    font-family: 'Orbitron', monospace;
    font-size: 0.88rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    width: 100%;
    border-radius: 2px;
    transition: all 0.2s;
    box-shadow: 0 0 18px rgba(0,255,65,0.12);
    touch-action: manipulation;
  }

  .gen-btn:hover {
    background: linear-gradient(135deg, rgba(0,255,65,0.17), rgba(0,200,50,0.13));
    box-shadow: 0 0 28px rgba(0,255,65,0.28);
    transform: translateY(-1px);
  }

  .gen-btn:active { transform: translateY(0); }
  .gen-btn:disabled { opacity: 0.5; cursor: wait; transform: none; }

  /* ── PREVIEW ── */
  .preview-box {
    background: rgba(0,6,0,0.85);
    border: 1px solid rgba(0,255,65,0.15);
    height: 460px;
    overflow-y: auto;
    padding: 1rem;
    font-size: 0.86rem;
    line-height: 1.8;
    border-radius: 2px;
  }

  .preview-empty { color: #1a3a1a; margin-top: 5rem; text-align: center; }
  .preview-empty .empty-icon { font-size: 2.2rem; margin-bottom: 0.75rem; opacity: 0.35; }
  .preview-empty p { font-size: 0.84rem; letter-spacing: 0.04em; }

  .entry { transition: color 0.1s; }
  .entry.top { color: #00ff41; }
  .entry.mid { color: #00cc33; }
  .entry.rest { color: #3a7a3a; }
  .entry.more { color: #1a4a1a; margin-top: 0.5rem; font-size: 0.78rem; }

  /* ── ACTION BUTTONS ── */
  .action-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }

  .copy-btn {
    background: transparent;
    border: 1px solid rgba(0,255,65,0.2);
    color: #6aaa6a;
    padding: 0.7rem 0.5rem;
    cursor: pointer;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.04em;
    border-radius: 2px;
    transition: all 0.15s;
    touch-action: manipulation;
  }

  .copy-btn:hover { border-color: rgba(0,255,65,0.45); color: #aaeeaa; }
  .copy-btn.copied { color: #00ff41; border-color: #00ff41; }

  .dl-btn {
    background: rgba(0,255,65,0.08);
    border: 1px solid #00ff41;
    color: #00ff41;
    padding: 0.7rem 0.5rem;
    cursor: pointer;
    font-family: 'Orbitron', monospace;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    border-radius: 2px;
    transition: all 0.15s;
    box-shadow: 0 0 10px rgba(0,255,65,0.1);
    touch-action: manipulation;
  }

  .dl-btn:hover { background: rgba(0,255,65,0.14); box-shadow: 0 0 18px rgba(0,255,65,0.22); }

  /* ── CMD BOX ── */
  .cmd-box {
    background: rgba(0,4,0,0.9);
    border: 1px solid rgba(0,255,65,0.1);
    border-left: 3px solid rgba(0,255,65,0.4);
    padding: 0.75rem 1rem;
    font-size: 0.78rem;
    color: #2a5a2a;
    border-radius: 0 2px 2px 0;
    line-height: 1.75;
    overflow-x: auto;
    white-space: nowrap;
  }

  .cmd-box .cmd-label { color: #3a7a3a; margin-bottom: 0.3rem; font-size: 0.72rem; }

  /* ── FOOTER ── */
  .footer {
    border-top: 1px solid rgba(0,255,65,0.1);
    margin-top: 2.5rem;
    padding-top: 1.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .footer-left { font-size: 0.78rem; color: #3a6a3a; }
  .footer-left strong { color: #00ff41; }
  .footer-left a { color: #3a7a3a; text-decoration: none; }
  .footer-left a:hover { color: #00ff41; }

  .footer-links { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }
  .built-by { font-size: 0.75rem; color: #3a6a3a; }

  .footer-link {
    color: #00ff41;
    font-size: 0.78rem;
    text-decoration: none;
    border: 1px solid rgba(0,255,65,0.22);
    padding: 0.3rem 0.75rem;
    border-radius: 2px;
    transition: all 0.15s;
    font-family: 'JetBrains Mono', monospace;
  }

  .footer-link:hover { border-color: #00ff41; background: rgba(0,255,65,0.06); box-shadow: 0 0 10px rgba(0,255,65,0.12); }

  .footer-link.li { color: #00ddaa; border-color: rgba(0,221,170,0.22); }
  .footer-link.li:hover { border-color: #00ddaa; background: rgba(0,221,170,0.06); }

  /* ═══════════════════════════════════
     TABLET — 2 col layout
  ═══════════════════════════════════ */
  @media (max-width: 900px) {
    .page { padding: 1.2rem; }

    .grid {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
    }

    /* col1 (region+country) spans left */
    .col:nth-child(1) { grid-column: 1; grid-row: 1; }
    /* col2 (format+domain+stats+gen) spans right */
    .col:nth-child(2) { grid-column: 2; grid-row: 1; }
    /* col3 (output) spans full width on row 2 */
    .col:nth-child(3) { grid-column: 1 / -1; grid-row: 2; }

    .preview-box { height: 360px; }
  }

  /* ═══════════════════════════════════
     MOBILE — single col with accordions
  ═══════════════════════════════════ */
  @media (max-width: 600px) {
    .page { padding: 1rem; }

    .grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    /* Show accordion toggles on mobile */
    .accordion-header { display: flex; }

    /* Hide static section labels on mobile (accordion replaces them) */
    .mobile-hide { display: none; }

    /* Collapse accordion content by default */
    .accordion-content { display: none; padding-top: 0.6rem; }
    .accordion-content.open { display: block; }

    .country-list { max-height: 220px; }

    /* Format list: 2-column grid on mobile to save space */
    .fmt-list-mobile {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.25rem;
    }

    .fmt-btn { font-size: 0.75rem; padding: 0.4rem 0.5rem; }
    .fmt-example { display: none; }

    .preview-box { height: 320px; font-size: 0.8rem; }

    .cmd-box { font-size: 0.72rem; }

    .action-row { grid-template-columns: 1fr 1fr; }

    .footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .footer-links { gap: 0.5rem; }
    .footer-link { font-size: 0.72rem; padding: 0.3rem 0.6rem; }
  }
`;

export default function RudraForge() {
  const [region, setRegion] = useState("British Isles");
  const [country, setCountry] = useState("Ireland");
  const [format, setFormat] = useState("dot");
  const [domain, setDomain] = useState("test.thm");
  const [generated, setGenerated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mobile accordion state
  const [openSection, setOpenSection] = useState("region");

  const toggle = (id) => setOpenSection(prev => prev === id ? null : id);

  const regionCountries = Object.entries(COUNTRIES).filter(([, v]) => v.region === region);
  const selectedCountry = COUNTRIES[country];

  const estCount = () => {
    if (!selectedCountry) return 0;
    const fmtCount = format === "all" ? FORMATS.length - 1 : 1;
    return selectedCountry.first.length * selectedCountry.last.length * fmtCount;
  };

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      const { first, last } = selectedCountry;
      const entries = new Set();
      const fmts = format === "all"
        ? FORMATS.filter(f => f.id !== "all")
        : FORMATS.filter(f => f.id === format);
      for (const fn of first) {
        for (const ln of last) {
          for (const fmt of fmts) {
            entries.add(`${fmt.fn(fn, ln)}@${domain}`);
          }
        }
      }
      setGenerated(Array.from(entries).sort());
      setLoading(false);
    }, 20);
  };

  const download = () => {
    const blob = new Blob([generated.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${country.toLowerCase().replace(/ /g, "_")}_${format}_${domain}.txt`;
    a.click();
  };

  const copyPreview = () => {
    navigator.clipboard.writeText(generated.slice(0, 20).join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{css}</style>
      <div className="page">

        {/* HEADER */}
        <div className="header">
          <div>
            <div className="title">⚡ RUDRAFORGE</div>
            <div className="subtitle">
              <span>{Object.keys(COUNTRIES).length} countries</span> · <span>15 formats</span> · pentest username generator
            </div>
          </div>
          {generated.length > 0 && (
            <div className="entries-ready">{generated.length.toLocaleString()} entries ready</div>
          )}
        </div>

        <div className="grid">

          {/* ── COL 1: Region + Country ── */}
          <div className="col">

            {/* REGION */}
            <div>
              <button className={`accordion-header ${openSection === "region" ? "open" : ""}`} onClick={() => toggle("region")}>
                <span>▸ REGION — {region}</span>
                <span className="chevron">▼</span>
              </button>
              <div className={`accordion-content ${openSection === "region" ? "open" : ""}`}>
                <div className="section-label mobile-hide">REGION</div>
                <div className="btn-list">
                  {REGIONS.map(r => (
                    <button key={r} className={`btn ${region === r ? "active" : ""}`} onClick={() => {
                      setRegion(r);
                      const first = Object.entries(COUNTRIES).find(([, v]) => v.region === r);
                      if (first) setCountry(first[0]);
                      setOpenSection("country");
                    }}>
                      <span className="btn-indicator">{region === r ? "▶" : ""}</span>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* COUNTRY */}
            <div>
              <button className={`accordion-header ${openSection === "country" ? "open" : ""}`} onClick={() => toggle("country")}>
                <span>▸ COUNTRY — {selectedCountry?.flag} {country}</span>
                <span className="chevron">▼</span>
              </button>
              <div className={`accordion-content ${openSection === "country" ? "open" : ""}`}>
                <div className="section-label mobile-hide">
                  COUNTRY &nbsp;<span style={{color:"#3a6a3a",fontWeight:400}}>({regionCountries.length})</span>
                </div>
                <div className="country-list">
                  {regionCountries.map(([name, data]) => (
                    <button key={name} className={`btn ${country === name ? "active" : ""}`} onClick={() => {
                      setCountry(name);
                      setOpenSection(null);
                    }}>
                      <span className="btn-indicator">{country === name ? "▶" : ""}</span>
                      <span style={{fontSize:"1rem"}}>{data.flag}</span> {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ── COL 2: Format + Domain + Stats + Generate ── */}
          <div className="col">

            {/* FORMAT */}
            <div>
              <button className={`accordion-header ${openSection === "format" ? "open" : ""}`} onClick={() => toggle("format")}>
                <span>▸ FORMAT — {FORMATS.find(f => f.id === format)?.label}</span>
                <span className="chevron">▼</span>
              </button>
              <div className={`accordion-content ${openSection === "format" ? "open" : ""}`}>
                <div className="section-label mobile-hide">EMAIL FORMAT</div>
                <div className="btn-list fmt-list-mobile">
                  {FORMATS.map(f => (
                    <button key={f.id} className={`fmt-btn ${format === f.id ? "active" : ""}`} onClick={() => {
                      setFormat(f.id);
                      setOpenSection(null);
                    }}>
                      <span>
                        <span className="btn-indicator" style={{marginRight:"0.25rem"}}>{format === f.id ? "▶" : ""}</span>
                        {f.label}
                      </span>
                      <span className="fmt-example">{f.example}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* DOMAIN */}
            <div>
              <div className="section-label">TARGET DOMAIN</div>
              <div className="domain-row">
                <span className="at-sign">@</span>
                <input
                  className="domain-input"
                  value={domain}
                  onChange={e => setDomain(e.target.value.replace("@", ""))}
                  placeholder="target.com"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                />
              </div>
            </div>

            {/* STATS */}
            <div className="stats-box">
              <div className="stat-row">
                <span>country</span>
                <span>{country} {selectedCountry?.flag}</span>
              </div>
              <div className="stat-row">
                <span>first names</span>
                <span>{selectedCountry?.first.length}</span>
              </div>
              <div className="stat-row">
                <span>last names</span>
                <span>{selectedCountry?.last.length}</span>
              </div>
              <div className="stat-row highlight">
                <span>est. entries</span>
                <span>{estCount().toLocaleString()}</span>
              </div>
            </div>

            {/* GENERATE */}
            <button className="gen-btn" onClick={generate} disabled={loading}>
              {loading ? "GENERATING..." : "▶  GENERATE LIST"}
            </button>

          </div>

          {/* ── COL 3: Output ── */}
          <div className="col">
            <div className="section-label">OUTPUT PREVIEW</div>

            <div className="preview-box">
              {generated.length === 0 ? (
                <div className="preview-empty">
                  <div className="empty-icon">[ _ ]</div>
                  <p>select options and press GENERATE</p>
                </div>
              ) : (
                <>
                  {generated.slice(0, 300).map((e, i) => (
                    <div key={i} className={`entry ${i < 3 ? "top" : i < 10 ? "mid" : "rest"}`}>{e}</div>
                  ))}
                  {generated.length > 300 && (
                    <div className="entry more">
                      ... +{(generated.length - 300).toLocaleString()} more — download for full list
                    </div>
                  )}
                </>
              )}
            </div>

            {generated.length > 0 && (
              <>
                <div className="action-row">
                  <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={copyPreview}>
                    {copied ? "✓ COPIED" : "⎘ COPY (20)"}
                  </button>
                  <button className="dl-btn" onClick={download}>
                    ↓ DOWNLOAD .TXT
                  </button>
                </div>
                <div className="cmd-box">
                  <div className="cmd-label"># pipe into:</div>
                  <div>smtp-user-enum -M VRFY -U list.txt -t IP</div>
                  <div>kerbrute userenum list.txt --domain {domain}</div>
                  <div>hydra -L list.txt -P pass.txt smb://IP</div>
                </div>
              </>
            )}
          </div>

        </div>

        {/* FOOTER */}
        <div className="footer">
          <div className="footer-left">
            <strong>RudraForge v1.0</strong> — built for authorised pentest enumeration ·{" "}
            <a href="https://github.com/wrathfuldiety/RudraForge/blob/main/README.md" target="_blank" rel="noopener noreferrer">
              contribute names ↗
            </a>
          </div>
          <div className="footer-links">
            <span className="built-by">built by</span>
            <a className="footer-link" href="https://github.com/wrathfuldiety" target="_blank" rel="noopener noreferrer">
              ⌥ github/wrathfuldiety
            </a>
            <a className="footer-link li" href="https://linkedin.com/in/hasanka-amarasinghe" target="_blank" rel="noopener noreferrer">
              ⌗ hasanka amarasinghe
            </a>
          </div>
        </div>

      </div>
    </>
  );
}
