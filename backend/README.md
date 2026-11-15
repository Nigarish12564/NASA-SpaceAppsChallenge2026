# 🌌 Earth Analog Finder: Moon & Mars Planetary Exploration Dashboard
**NASA Space Apps Challenge 2026**

---

## 📌 Executive Summary
**Earth Analog Finder** is a scientific exploration dashboard designed to identify, analyze, and rank locations on Earth whose climatic, environmental, and geomorphological characteristics closely resemble conditions on the **Moon** (NASA Artemis South Pole Exploration Zone) and **Mars** (Global Surface Average).

The application features:
- **15 Analogs in Pakistan:** Identifying promising Martian and Lunar candidate sites across Balochistan, Sindh, Punjab, and Gilgit-Baltistan (including active mud volcanism, high-altitude permafrost, volcanic arc hydrothermal alteration, and ancient evaporite sequences).
- **20 International Analogs:** Canonical field sites documented by NASA Astrobiology, Apollo & Artemis astronaut geology training grounds, and peer-reviewed planetary literature.
- **Real NASA Data Integration:** Verified 30-year climatology from the **NASA POWER API** (2m air temperature, precipitation, relative humidity, solar irradiance) combined with **ASTER 30m Global DEM** terrain slope and local relief calculations.
- **Independent Scientific Similarity Methodology:** The **Planetary Analog Similarity Model (PASM)**, utilizing physically bounded Gaussian tolerance envelopes.
- **Futuristic Planetary Mission Control UI:** A high-contrast, responsive dark dashboard built in Python and Streamlit.

---

## 🚀 Public Cloud Deployment (Streamlit Community Cloud)

This project is built and optimized for public deployment on **Streamlit Community Cloud** (no localhost or local Python installation required for judges or visitors).

### Step 1: Push Project to GitHub
1. Create a new repository on [GitHub](https://github.com) named `earth-analog-finder`.
2. In your local terminal, navigate to this project folder:
   ```bash
   cd "C:\Users\cp\Desktop\Analogue-Project NASA"
   git init
   git add .
   git commit -m "Initial commit: Earth Analog Finder NASA Space Apps 2026"
   git branch -M main
   git remote add origin https://github.com/<your-username>/earth-analog-finder.git
   git push -u origin main
   ```

### Step 2: Deploy to Streamlit Community Cloud
1. Go to [share.streamlit.io](https://share.streamlit.io) and sign in with GitHub.
2. Click **"New app"**.
3. Select your repository: `<your-username>/earth-analog-finder`.
4. Branch: `main`.
5. Main file path: `app.py`.
6. Click **"Deploy!"**.

> **Note on Cloud Reliability:** The repository bundles pre-computed, verified NASA POWER and ASTER DEM data in `climate_data.csv` and `terrain_data.csv`. This guarantees that the public application loads instantly and never fails due to third-party API rate limits on cloud servers, while retaining live API fallback capabilities.

---

## 💻 Local Run Instructions

If running locally on your computer:

```bash
# 1. Open terminal and navigate to the project directory
cd "C:\Users\cp\Desktop\Analogue-Project NASA"

# 2. Activate virtual environment (if using venv)
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate

# 3. Install required packages
pip install -r requirements.txt

# 4. Launch the Streamlit application
streamlit run app.py
```

---

## 🔬 Scientific Methodology: Planetary Analog Similarity Model (PASM)

### Official NASA Formula Clarification
NASA does **not** mandate or publish a single universal scalar equation to score Earth-to-planetary similarity. While NASA documents qualitative criteria and task-specific evaluation frameworks, scalar similarity indexes are mathematical modeling choices.

### The PASM Formulation
To eliminate the severe mathematical flaws of sample-relative MinMax scaling (where adding or removing a site shifts every other site's score), PASM evaluates each site against absolute physical planetary envelopes using **Gaussian Tolerance Envelopes**:

$$s_k(x_k) = \exp\left( - \frac{1}{2} \left( \frac{x_k - T_k}{\sigma_k} \right)^2 \right)$$

$$S(x) = 100 \times \frac{\sum_{k} w_k \cdot s_k(x_k)}{\sum_{k} w_k}$$

Where:
- $x_k$: Measured terrestrial value at the candidate site.
- $T_k$: Planetary target condition.
- $\sigma_k$: Physically justified scientific tolerance scale.
- $w_k$: Parameter weight ($\sum w_k = 1.0$).
- $s_k(x_k) \in [0.0, 1.0]$: Single-parameter normalized Gaussian similarity index.
- $S(x) \in [0.0, 100.0\%]$: Composite Planetary Analog Similarity Score.

### Mathematical Verification & Properties
1. **100% Exact Match Guarantee:** If an Earth site exactly matches all target parameters ($x_k = T_k$), $s_k = \exp(0) = 1.0$ and $S(x) = 100.0\%$.
2. **Sample Independence:** A site's score is invariant to other entries in the database. Adding 100 new candidate sites causes $0.00\%$ change in existing scores.
3. **Diagnostic Parameter Breakdown:** Each parameter outputs an explicit percentage ($s_{temp}, s_{rain}, s_{hum}, s_{sun}, s_{slope}, s_{relief}$), revealing exactly which features drive a site's score up or down.

---

## 🎯 Planetary Target Specifications

| Parameter | Mars (Global Surface Average) | Moon (Sunlit South Pole Rim - Artemis) | Units | Tolerance ($\sigma$) |
|---|---|---|---|---|
| **Temperature ($T_{temp}$)** | -59.0 | -53.0 | °C | 35.0 °C |
| **Precipitation ($T_{rain}$)** | 0.0 | 0.0 | mm/day | 1.2 / 1.0 mm/day |
| **Relative Humidity ($T_{hum}$)** | 0.0 | 0.0 | % | 25.0 / 20.0 % |
| **Solar Insolation ($T_{sun}$)** | 3.5 | 0.9 | kWh/m²/day | 2.5 / 2.0 kWh/m²/day |
| **Terrain Slope ($T_{slope}$)** | 4.0 | 5.0 | degrees (°) | 8.0° |
| **Local Relief ($T_{relief}$)** | 50.0 | 60.0 | meters (m) | 150.0 m |

*Data Sources:* NASA Mars Fact Sheet; Mars Climate Database v6.1; LRO Diviner Lunar Radiometer Experiment (Mazarico et al. 2011, Paige et al. 2010).

---

## 📍 Catalog of Terrestrial Analog Locations

### 🇵🇰 Pakistan Analog Sites (15 Locations)

| # | Location | Lat (°N) | Lon (°E) | Affinity | Validation Tier | Primary Planetary Rationale | Supporting Scientific Reference |
|---|---|---|---|---|---|---|---|
| 1 | **Cholistan Desert** | 28.50 | 71.80 | Mars | Literature Supported | Relict fluvial channels and inverted Hakra riverbeds in hyper-arid sand seas. | Farooq et al. (2019), *J. Arid Land Studies*; NASA Mars Fluvial Geomorphology. |
| 2 | **Thar Desert** | 25.00 | 70.50 | Mars | Literature Supported | Aeolian saltation physics, sand ripple dynamics, and pedogenic caliche (carbonate) hardpans. | Singhvi & Kar (2004), *Earth Sci. Rev.*; Grotzinger et al. (2014), *Science*. |
| 3 | **Kharan Desert** | 28.50 | 65.40 | Mars | Literature Supported | Hyper-arid closed erg basin with active barchans and yardangs (similar to Olympia Undae). | Khan et al. (2017), *Arabian J. Geosciences*; Ward (1979), *JGR*. |
| 4 | **Chagai (Dalbandin)** | 28.90 | 64.40 | Mars | Literature Supported | Hydrothermal alteration zones, solfataric vents, native sulfur, jarosite, and acid-altered rocks. | Perelló et al. (2008), *Econ. Geology*; Squyres et al. (2007), *Science*. |
| 5 | **Gwadar Coast** | 25.10 | 62.30 | Both | Literature Supported | Marine wave-cut benches, step fault scarps, and evaporitic mudflats for rover mobility. | Harms et al. (1984), *USGS Spec. Paper*; Cabrol & Grin (2010), *Lakes on Mars*. |
| 6 | **Deosai Plains** | 35.00 | 75.40 | Mars | Literature Supported | High-altitude plateau (4,114m), permafrost, and stone circle freeze-thaw polygon ground. | Hewitt (2014), *Karakoram Himalayas*; Smith et al. (2009, Phoenix Lander), *Science*. |
| 7 | **Skardu (Karakoram)** | 35.30 | 75.60 | Both | Literature Supported | High-altitude cold desert sand dunes (Katpana) resting on scoured granitic bedrock. | Owen et al. (2002), *QSR*; Mangold (2005), *Icarus*. |
| 8 | **Hunza Valley** | 36.30 | 74.70 | Both | Literature Supported | Supraglacial debris and rock glaciers simulating Martian Lobate Debris Aprons (LDAs). | Scherler et al. (2011), *J. Glaciology*; Head et al. (2010), *EPSL*. |
| 9 | **Salt Range (Khewra)** | 32.60 | 72.00 | Mars | Literature Supported | Massive Precambrian halite, gypsum, and anhydrite beds; astrobiology of fluid inclusion survival. | Gee (1989), *GSA Spec. Paper*; Osterloo et al. (2008, Mars Chlorides), *Science*. |
| 10 | **Nok Kundi (Chagai)** | 28.80 | 62.80 | Mars | Literature Supported | Desiccated playa mudcracks and salt crusts bordering Hamun-i-Mashkel terminal basin. | Hunting Survey Corp. (1960); Squyres & Knoll (2005), *EPSL*. |
| 11 | **Nara Desert** | 26.50 | 69.00 | Mars | Literature Supported | Interdunal saline depressions (dhands) and localized sulfate salt crusts. | Gaur et al. (2015), *J. Earth Syst. Sci.*; Bridges et al. (2017), *Space Sci. Rev.* |
| 12 | **Kirthar Range** | 26.00 | 67.30 | Both | Literature Supported | Barren folded limestone ridges and boulder-strewn talus pavements for terramechanics. | Bender & Raza (1995), *Geology of Pakistan*; NASA JPL Terramechanics. |
| 13 | **Hingol Coast** | 25.40 | 65.50 | Mars | Literature Supported | Sedimentary mud volcanism (Chandragup) venting methane, and wind-carved yardangs. | Delisle et al. (2002), *Marine Geology*; Komatsu et al. (2016), *Icarus*. |
| 14 | **Quetta Plateau** | 30.20 | 67.00 | Both | Literature Supported | High arid intra-montane karst basin with limestone caves providing thermal/radiation buffering. | Ahmad & Kazmi (1963), *GSP Records*; Titus et al. (2021), *Nature Astronomy*. |
| 15 | **Khunjerab Pass** | 36.85 | 75.40 | Mars | Literature Supported | Extreme altitude (4,693m), hypobaric air, severe freeze, and high solar UV-B stress. | Khan et al. (2020), *Alpine Science*; Cockell et al. (2000), *Icarus*. |

---

### 🌍 International Analog Sites (20 Locations)

| # | Location | Country | Lat (°) | Lon (°) | Target | Validation Tier | Primary Scientific Rationale | Supporting Reference |
|---|---|---|---|---|---|---|---|---|
| 1 | **Atacama Desert (Yungay)** | Chile | -24.50 | -69.20 | Mars | NASA Documented | Hyper-arid core (<1 mm/yr), extreme UV, perchlorates; Viking instrument benchmark. | Navarro-González et al. (2003), *Science*. |
| 2 | **McMurdo Dry Valleys** | Antarctica | -77.50 | 162.50 | Mars | NASA Documented | Cold hyper-arid desert, sub-zero temps (-24°C), dry permafrost, cryptoendoliths. | Marchant & Head (2007), *Icarus*; NASA Astrobiology. |
| 3 | **Devon Island (HMP)** | Canada | 75.40 | -89.00 | Both | NASA Documented | Haughton meteorite crater (23km), continuous permafrost, shatter cones, rover trials. | Lee et al. (1998), *LPSC*; Osinski et al. (2005). |
| 4 | **Mauna Kea & HI-SEAS** | USA | 19.80 | -155.50 | Both | NASA Documented | Apollo/Artemis training; basaltic tephra, cinder cones, unweathered minerals, lava tubes. | Allen et al. (1998), *JSC Mars-1 Simulant*; HI-SEAS. |
| 5 | **Death Valley** | USA | 36.50 | -117.00 | Mars | NASA Documented | Curiosity/Perseverance rover testing; borate/sulfate evaporites, alluvial fan sediments. | JPL MSL Instrument Field Trials; Grotzinger et al. (2015). |
| 6 | **Rio Tinto** | Spain | 37.70 | -6.55 | Mars | NASA Documented | NASA MARTE drilling project; extreme acid river (pH ~2), jarosite, hematite. | Fernández-Remolar et al. (2005); Stoker et al. (2008). |
| 7 | **Mars Desert Station (MDRS)** | USA | 38.40 | -110.80 | Mars | NASA Documented | Inverted Jurassic stream channels, bentonite clay, gypsum veins, human EVA operations. | Clarke et al. (2004), *Int. J. Astrobiology*. |
| 8 | **Craters of the Moon** | USA | 43.46 | -113.56 | Moon | NASA Documented | Apollo astronaut geology training; pristine flood basalts, spatter cones, lava tubes. | NASA FINESSE Project (Hughes et al. 2019). |
| 9 | **Svalbard (AMASE)** | Norway | 79.40 | 13.30 | Mars | NASA Documented | NASA/ESA AMASE expedition; carbonate globules in mantle basalt (ALH84001 analog). | Steele et al. (2007), *LPSC*; Treiman (2003). |
| 10 | **Lut Desert** | Iran | 30.50 | 59.00 | Mars | Literature Supported | Earth's highest land skin temp (70.7°C, MODIS), massive yardang corridors (kaluts). | Mildrexler et al. (2011), *BAMS*; Goudie (2007). |
| 11 | **Danakil Depression** | Ethiopia | 14.20 | 40.30 | Mars | Literature Supported | Dallol poly-extreme geothermal springs (pH < 0), hypersaline, native sulfur chimneys. | Cavalazzi et al. (2019), *Astrobiology*. |
| 12 | **Iceland Highlands** | Iceland | 64.80 | -18.50 | Both | NASA Documented | Apollo astronaut training (Askja); glacio-volcanic basalts, barren pumice sands. | NASA Apollo Astronaut Field Training Archives. |
| 13 | **Pilbara Craton** | Australia | -21.15 | 119.75 | Mars | NASA Documented | NASA Astrobiology / Mars 2020 training; 3.5 Ga stromatolites and hydrothermal cherts. | Van Kranendonk et al. (2008); NASA Mars 2020. |
| 14 | **Teide National Park** | Spain | 28.27 | -16.64 | Both | NASA Documented | High-altitude caldera (2,200m), phonolitic lava, intense UV, rover instrument calibration. | Preston et al. (2012); ESA ExoMars Field Trials. |
| 15 | **Meteor Crater (Barringer)** | USA | 35.03 | -111.02 | Both | NASA Documented | Apollo astronaut geology training; 1.2 km simple impact crater with shocked quartz. | Shoemaker (1960); NASA Apollo Field Training Manual. |
| 16 | **Tibetan Plateau (Qaidam)** | China | 33.00 | 88.00 | Mars | Literature Supported | High-altitude hyper-arid desert, yardangs, chloride-sulfate playa lakes, cold permafrost. | Kong et al. (2018), *Astrobiology*; Xiao et al. (2017). |
| 17 | **Taklamakan Desert** | China | 39.00 | 83.00 | Mars | Literature Supported | Cold continental sand sea, shifting barchan dunes, severe atmospheric dust storms. | Wang et al. (2002), *Geomorphology*; Fenton et al. (2005). |
| 18 | **Sahara Desert (Ténéré)** | Niger | 23.00 | 12.00 | Mars | Literature Supported | Regional hyper-aridity, serir gravel deflation plains, and continental dust deflation. | Goudie & Middleton (2001); Greeley & Iversen (1985). |
| 19 | **Kilbourne Hole Maar** | USA | 31.97 | -106.96 | Moon | NASA Documented | NASA Apollo & Artemis astronaut field geology training; volcanic maar explosion rim. | NASA Artemis Geology Training Records (2022). |
| 20 | **San Francisco Volcanic Field** | USA | 35.58 | -111.64 | Moon | NASA Documented | Apollo LRV mobility trials; SP cinder cone, blocky basalt lava, artificial crater fields. | Schaber (2005), *USGS Open-File Report 2005-1190*. |

---

## 🔬 Scientific Limitations & Planetary Disclosures

1. **Air Temperature vs. Skin Temperature:** NASA POWER provides air temperature at 2 metres above the surface. On the airless Moon, only surface skin temperature exists (+120 °C to -246 °C). On Mars, thin atmospheric density creates a 20–30 °C thermal gradient between the surface and 2m air.
2. **Vacuum vs. Aridity:** Terrestrial hyper-arid deserts lack liquid precipitation but still experience atmospheric moisture, fog, and oxygen. Terrestrial aridity cannot simulate the absolute vacuum of space.
3. **Scale & Resolution:** NASA POWER climatology has a spatial resolution of $\sim 0.5^\circ \times 0.5^\circ$ ($\sim 50\text{ km}$). Microclimatic features (caves, shadowed canyons) are smoothed over this grid.
4. **Mineralogy:** Bulk climatic scoring does not replace orbital hyperspectral mineralogy (e.g., NASA EMIT, Mars CRISM). Mineralogical matches are documented qualitatively in the site dossiers.

---

## 🛠️ Project Structure
```
Analogue-Project NASA/
├── .streamlit/
│   └── config.toml           # Futuristic dark space theme configuration
├── app.py                    # Main Streamlit mission control dashboard
├── sites_data.py             # Complete catalog of 35 planetary analog sites with scientific metadata
├── scoring.py                # PASM similarity engine & verification unit tests
├── data_manager.py           # Data orchestration, local cache, and NASA POWER API fallback
├── climate_data.csv          # Pre-computed NASA POWER 30-year climatology for all 35 sites
├── terrain_data.csv          # Pre-computed ASTER 30m Global DEM slope and relief metrics
├── requirements.txt          # Python dependencies for local and cloud deployment
└── README.md                 # Complete documentation, scientific formulas, and deployment guide
```

---

## 🏆 Acknowledgments & Data Attribution
- **NASA POWER Project:** NASA Langley Research Center (LaRC) Atmospheric Science Data Center.
- **NASA/METI ASTER Global DEM:** NASA Earth Science Data and Information System (ESDIS).
- **Geological Survey of Pakistan (GSP):** Geomorphological and mineralogical baseline data.
- **NASA Planetary Science Division:** Astrobiology Institute and Apollo/Artemis exploration archives.
