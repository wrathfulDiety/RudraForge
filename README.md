# RudraForge
RudraForge — A lightweight, browser-based username generator that creates culturally diverse usernames using structured name datasets and randomization logic.

# RudraForge

> Country-aware username wordlist generator for security testing and identity enumeration

**Live Tool:** https://wrathfuldiety.github.io/rudraforge/

Built by **Hasanka Amarasinghe**
GitHub: https://github.com/wrathfuldiety
LinkedIn: https://linkedin.com/in/hasanka-amarasinghe

---

## Overview

**RudraForge** generates realistic username permutations using culturally accurate first- and last-name datasets from multiple regions.

Many enterprise environments follow predictable username formats such as:

```
firstname.lastname
flastname
lastname.firstname
firstnamel
```

RudraForge automates the generation of these permutations at scale, enabling security professionals to create high-quality username wordlists for **identity enumeration, security testing, and lab environments**.

The project is named after **Rudra**, representing transformation and power — symbolizing the forging of identities from structured name data.

---

## Features

• Country-specific name datasets
• Generates realistic corporate username formats
• Supports **15 common enterprise naming conventions**
• Client-side processing (no server required)
• Instant export of generated wordlists
• Static deployment compatible with GitHub Pages
• Open dataset for community contribution

---

## Username Formats

| Format             | Example    |
| ------------------ | ---------- |
| firstname.lastname | john.smith |
| firstnamelastname  | johnsmith  |
| f.lastname         | j.smith    |
| flastname          | jsmith     |
| firstname.l        | john.s     |
| firstnamel         | johns      |
| lastname.firstname | smith.john |
| lastnamefirstname  | smithjohn  |
| lastname.f         | smith.j    |
| lastnamef          | smithj     |
| initials           | js         |
| firstname_lastname | john_smith |
| f_lastname         | j_smith    |
| lastname_firstname | smith_john |
| lastname_f         | smith_j    |

Selecting **ALL** will generate every permutation.

---

## Example Output

```
liam.murphy
lmurphy
murphy.liam
liamm
l.murphy
murphyl
```

---

## Typical Use Cases

RudraForge can be useful for:

• Security research environments
• Authorized penetration testing engagements
• Identity enumeration simulations
• Red-team lab exercises
• Training environments for authentication security testing
• Generating realistic datasets for defensive testing

---

## Running Locally

### Requirements

* Node.js (LTS recommended)

### Clone the repository

```
git clone https://github.com/wrathfuldiety/rudraforge.git
cd rudraforge
```

### Install dependencies

```
npm install
```

### Start development server

```
npm run dev
```

Then open:

```
http://localhost:5173
```

---

## Deployment

RudraForge is a static client-side application and can be deployed easily using:

• GitHub Pages
• Netlify
• Vercel
• Any static hosting provider

Current deployment:

```
https://wrathfuldiety.github.io/rudraforge/
```

---

## Contributing Name Data

All name datasets are stored in:

```
data/countries.json
```

Each entry follows the structure:

```json
{
  "Ireland": {
    "flag": "🇮🇪",
    "region": "British Isles",
    "first": ["liam", "sean", "aoife"],
    "last": ["murphy", "kelly", "obrien"]
  }
}
```

### Contribution Guidelines

• Names should be culturally accurate
• Use lowercase only
• Avoid spaces in names
• Remove apostrophes (e.g., `o'brien` → `obrien`)
• Avoid duplicate entries

Pull requests adding new countries or expanding name datasets are welcome.

---

## Project Structure

```
rudraforge/
├── data/
│   └── countries.json
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── components/
├── index.html
├── vite.config.js
└── README.md
```

---

## Security and Responsible Use

RudraForge is intended for **authorized security testing, research, and educational purposes**.

Users must ensure they have **explicit permission** before using generated wordlists against any systems, networks, or services.

The author assumes **no responsibility for misuse** of this software.

---

## License

MIT License
