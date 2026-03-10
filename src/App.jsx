import { useState, useEffect } from "react";
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
  { id: "all",        label: "★ ALL formats",        example: "all above",    fn: null },
];

export default function UsernameGenerator() {
  const [region, setRegion] = useState("British Isles");
  const [country, setCountry] = useState("Ireland");
  const [format, setFormat] = useState("dot");
  const [domain, setDomain] = useState("test.thm");
  const [generated, setGenerated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const S = {
    page: { minHeight: "100vh", background: "#080c08", color: "#c8d8c8", fontFamily: "'Courier New',monospace", padding: "1.2rem", backgroundImage: "radial-gradient(ellipse at 10% 10%,#0a1a0a 0%,transparent 60%),radial-gradient(ellipse at 90% 90%,#080c10 0%,transparent 60%)" },
    header: { borderBottom: "1px solid #1a2e1a", paddingBottom: "0.7rem", marginBottom: "1.2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" },
    title: { fontSize: "1.3rem", fontWeight: "bold", background: "linear-gradient(90deg,#00ff41,#00cc33)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "0.12em" },
    sub: { color: "#2a5a2a", fontSize: "0.65rem", marginTop: "0.15rem" },
    grid: { display: "grid", gridTemplateColumns: "190px 220px 1fr", gap: "1.2rem" },
    label: { color: "#00ff41", fontSize: "0.62rem", letterSpacing: "0.18em", marginBottom: "0.4rem" },
    col: { display: "flex", flexDirection: "column", gap: "0.9rem" },
    btn: (active) => ({ background: active ? "#0a2010" : "transparent", border: active ? "1px solid #00ff41" : "1px solid #152015", color: active ? "#00ff41" : "#3a5a3a", padding: "0.3rem 0.55rem", cursor: "pointer", fontFamily: "'Courier New',monospace", fontSize: "0.7rem", textAlign: "left", transition: "all 0.1s", width: "100%" }),
    fmtBtn: (active) => ({ background: active ? "#0a2010" : "transparent", border: active ? "1px solid #00ff41" : "1px solid #152015", color: active ? "#00ff41" : "#3a5a3a", padding: "0.26rem 0.55rem", cursor: "pointer", fontFamily: "'Courier New',monospace", fontSize: "0.68rem", textAlign: "left", transition: "all 0.1s", display: "flex", justifyContent: "space-between", width: "100%" }),
    statsBox: { background: "#050a05", border: "1px solid #0a1e0a", padding: "0.55rem 0.7rem", fontSize: "0.68rem", color: "#2a5a2a" },
    genBtn: { background: loading ? "#0a1a0a" : "linear-gradient(135deg,#0a2e0a,#0a1e0a)", border: "1px solid #00ff41", color: "#00ff41", padding: "0.7rem", cursor: loading ? "wait" : "pointer", fontFamily: "'Courier New',monospace", fontSize: "0.8rem", letterSpacing: "0.15em", fontWeight: "bold", width: "100%" },
    preview: { background: "#050a05", border: "1px solid #0a1e0a", height: "480px", overflowY: "auto", padding: "0.6rem", fontSize: "0.67rem", lineHeight: "1.75", color: "#2a5a2a" },
    input: { background: "#050a05", border: "1px solid #1a2e1a", color: "#00ff41", padding: "0.42rem 0.6rem", fontFamily: "'Courier New',monospace", fontSize: "0.82rem", width: "100%", outline: "none", boxSizing: "border-box" },
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div>
          <div style={S.title}>█ RudraForge v1.0</div>
          <div style={S.sub}>&gt; {Object.keys(COUNTRIES).length} countries · 15 formats · pentest wordlist generator</div>
        </div>
        {generated.length > 0 && <div style={{ color: "#00ff41", fontSize: "0.78rem" }}>{generated.length.toLocaleString()} entries ready</div>}
      </div>

      <div style={S.grid}>
        {/* COL 1: Region + Country */}
        <div style={S.col}>
          <div>
            <div style={S.label}>▸ REGION</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              {REGIONS.map(r => (
                <button key={r} style={S.btn(region === r)} onClick={() => {
                  setRegion(r);
                  const first = Object.entries(COUNTRIES).find(([, v]) => v.region === r);
                  if (first) setCountry(first[0]);
                }}>
                  {region === r ? "▶ " : "  "}{r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={S.label}>▸ COUNTRY ({regionCountries.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.18rem", maxHeight: "300px", overflowY: "auto" }}>
              {regionCountries.map(([name, data]) => (
                <button key={name} style={S.btn(country === name)} onClick={() => setCountry(name)}>
                  {data.flag} {country === name ? "▶ " : ""}{name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COL 2: Format + Domain + Stats + Generate */}
        <div style={S.col}>
          <div>
            <div style={S.label}>▸ EMAIL FORMAT</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.18rem" }}>
              {FORMATS.map(f => (
                <button key={f.id} style={S.fmtBtn(format === f.id)} onClick={() => setFormat(f.id)}>
                  <span>{format === f.id ? "▶ " : "  "}{f.label}</span>
                  <span style={{ color: format === f.id ? "#007a20" : "#1a3a1a", fontSize: "0.6rem" }}>{f.example}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={S.label}>▸ TARGET DOMAIN</div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ color: "#2a5a2a" }}>@</span>
              <input value={domain} onChange={e => setDomain(e.target.value.replace("@", ""))} style={S.input} placeholder="test.thm" />
            </div>
          </div>
          <div style={S.statsBox}>
            <div>country:&nbsp;&nbsp; <span style={{ color: "#00aa2a" }}>{country} {selectedCountry?.flag}</span></div>
            <div>firstnames: <span style={{ color: "#00aa2a" }}>{selectedCountry?.first.length}</span></div>
            <div>lastnames:&nbsp; <span style={{ color: "#00aa2a" }}>{selectedCountry?.last.length}</span></div>
            <div style={{ marginTop: "0.3rem" }}>est. entries: <span style={{ color: "#00ff41", fontWeight: "bold" }}>{estCount().toLocaleString()}</span></div>
          </div>
          <button style={S.genBtn} onClick={generate} disabled={loading}>
            {loading ? "▓▓▓ GENERATING..." : "▶ GENERATE LIST"}
          </button>
        </div>

        {/* COL 3: Output */}
        <div style={S.col}>
          <div style={S.label}>▸ OUTPUT PREVIEW</div>
          <div style={S.preview}>
            {generated.length === 0 ? (
              <div style={{ color: "#152515", marginTop: "5rem", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>[ ]</div>
                <div>configure and press GENERATE</div>
              </div>
            ) : (
              <>
                {generated.slice(0, 300).map((e, i) => (
                  <div key={i} style={{ color: i < 3 ? "#00ff41" : i < 10 ? "#00aa2a" : "#2a5a2a" }}>{e}</div>
                ))}
                {generated.length > 300 && (
                  <div style={{ color: "#1a3a1a", marginTop: "0.5rem" }}>... +{(generated.length - 300).toLocaleString()} more (download for full list)</div>
                )}
              </>
            )}
          </div>
          {generated.length > 0 && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
                <button onClick={copyPreview} style={{ background: "transparent", border: "1px solid #1a2e1a", color: copied ? "#00ff41" : "#3a5a3a", padding: "0.48rem", cursor: "pointer", fontFamily: "inherit", fontSize: "0.68rem", letterSpacing: "0.08em" }}>
                  {copied ? "✓ COPIED" : "⎘ COPY (20)"}
                </button>
                <button onClick={download} style={{ background: "#0a2010", border: "1px solid #00ff41", color: "#00ff41", padding: "0.48rem", cursor: "pointer", fontFamily: "inherit", fontSize: "0.68rem", letterSpacing: "0.08em", fontWeight: "bold" }}>
                  ↓ DOWNLOAD .TXT
                </button>
              </div>
              <div style={{ background: "#050a05", border: "1px solid #0a1200", padding: "0.55rem 0.7rem", fontSize: "0.63rem", color: "#1a3a1a" }}>
                <div style={{ color: "#2a4a2a", marginBottom: "0.25rem" }}># pipe into:</div>
                <div>smtp-user-enum -M VRFY -U list.txt -t IP</div>
                <div>kerbrute rudraforge list.txt --domain {domain}</div>
                <div>hydra -L list.txt -P pass.txt smb://IP</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid #1a2e1a", marginTop: "2rem", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "0.65rem", color: "#2a5a2a" }}>
          <span style={{ color: "#00ff41" }}>RudraForge v1.0</span> — built for pentest enumeration · <a href="https://github.com/wrathfuldiety/rudraforge/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" style={{ color: "#2a5a2a" }}>contribute names ↗</a>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.65rem", color: "#2a5a2a" }}>built by</span>
          <a href="https://github.com/wrathfuldiety" target="_blank" rel="noopener noreferrer"
            style={{ color: "#00ff41", fontSize: "0.7rem", textDecoration: "none", border: "1px solid #1a2e1a", padding: "0.25rem 0.6rem", fontFamily: "'Courier New',monospace" }}>
            ⌥ github/wrathfuldiety
          </a>
          <a href="https://linkedin.com/in/hasanka-amarasinghe" target="_blank" rel="noopener noreferrer"
            style={{ color: "#00cc33", fontSize: "0.7rem", textDecoration: "none", border: "1px solid #1a2e1a", padding: "0.25rem 0.6rem", fontFamily: "'Courier New',monospace" }}>
            ⌗ linkedin/hasanka-amarasinghe
          </a>
        </div>
      </div>
    </div>
  );
}
