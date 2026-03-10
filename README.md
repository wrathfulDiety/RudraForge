</div>
<img src="https://komarev.com/ghpvc/?username=wrathfulDiety&style=flat-square&color=blue" alt=""/>
<br>

# RudraForge
> Country-aware username wordlist generator for pentest enumeration

**Live tool:** https://wrathfuldiety.github.io/rudraforge/

Built by [Hasanka Amarasinghe](https://linkedin.com/in/hasanka-amarasinghe) · [GitHub](https://github.com/wrathfuldiety)

---

## What it does
Generates realistic username wordlists based on country-specific first and last names, across 15 email formats — ready to pipe into `kerbrute`, `smtp-user-enum`, `hydra`, or any enumeration tool.

```
john.smith@target.com
jsmith@target.com
smith.john@target.com
j.smith@target.com
... and 11 more formats
```

---

## Supported formats
| Format | Example |
|---|---|
| firstname.lastname | john.smith |
| firstnamelastname | johnsmith |
| f.lastname | j.smith |
| flastname | jsmith |
| firstname.l | john.s |
| firstnamel | johns |
| lastname.firstname | smith.john |
| lastnamefirstname | smithjohn |
| lastname.f | smith.j |
| lastnamef | smithj |
| fl (initials) | js |
| firstname_lastname | john_smith |
| f_lastname | j_smith |
| lastname_firstname | smith_john |
| lastname_f | smith_j |
| ★ ALL | all of the above |

---

## Usage (after generating)
```bash
# SMTP enumeration
smtp-user-enum -M VRFY -U wordlist.txt -t TARGET_IP

# Active Directory / Kerberos
kerbrute rudraforge wordlist.txt --domain target.com

# Brute force
hydra -L wordlist.txt -P passwords.txt smb://TARGET_IP
```

---

## Running locally

**Requirements:** Node.js (download from nodejs.org — LTS version)

```bash
git clone https://github.com/wrathfuldiety/rudraforge.git
cd rudraforge
npm install
npm run dev
```
Open http://localhost:5173

---

## Contributing names

All name data lives in one file: **`data/countries.json`**

No coding knowledge needed — it's just a list of names.

### Structure
```json
{
  "Ireland": {
    "flag": "🇮🇪",
    "region": "British Isles",
    "first": ["liam", "sean", "aoife", "..."],
    "last":  ["murphy", "kelly", "twohig", "..."]
  }
}
```

### How to contribute

**Option A — Edit directly on GitHub (easiest, no coding needed):**
1. Go to [`data/countries.json`](https://github.com/wrathfuldiety/rudraforge/blob/main/data/countries.json) on GitHub
2. Click the **pencil icon** (top right of the file)
3. Find your country and add names to the `first` or `last` arrays
4. Scroll down and click **Propose changes**
5. Click **Create pull request**
6. Done — I'll review and merge it ✅

**Option B — Fork and PR (standard open source flow):**
```bash
# 1. Fork the repo on GitHub (click Fork button top right)
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/rudraforge.git
cd rudraforge

# 3. Edit data/countries.json

# 4. Commit and push
git add data/countries.json
git commit -m "add more Irish surnames"
git push

# 5. Open a Pull Request on GitHub
```

### Contribution guidelines
- Names should be **realistic and culturally accurate** for that country
- **Lowercase only** — the tool handles capitalisation
- No spaces in names — use hyphens for hyphenated names e.g. `jean-pierre`
- Remove apostrophes — `o'brien` becomes `obrien`
- No duplicates
- Adding a new country? Copy the structure exactly from an existing entry and add it in the correct region

### Adding a new country
```json
"Nepal": {
  "flag": "🇳🇵",
  "region": "South Asia",
  "first": ["bikram", "krishna", "sita", "..."],
  "last":  ["sharma", "thapa", "tamang", "..."]
}
```

Regions available:
- `British Isles`
- `Western Europe`
- `Northern Europe`
- `Eastern Europe`
- `Southern Europe`
- `North America`
- `South America`
- `Middle East`
- `South Asia`
- `East Asia`
- `Southeast Asia`
- `Central Asia`
- `Africa`
- `Oceania`

---

## Project structure
```
rudraforge/
├── data/
│   └── countries.json   ← all name data lives here (contribute here!)
├── src/
│   ├── App.jsx          ← the tool UI
│   └── main.jsx         ← entry point
├── index.html
├── vite.config.js
├── CONTRIBUTING.md
└── README.md
```

---

## Disclaimer
This tool is intended for **authorised penetration testing and security research only**. Use responsibly and only against systems you have explicit permission to test.
