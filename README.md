# 🌍 Earth Analogue Explorer
### Finding Places on Earth That Are Similar to the Moon and Mars

<p align="center">
  <img src="https://img.shields.io/badge/NASA-Space%20Apps%20Challenge-0B3D91?style=for-the-badge&logo=nasa&logoColor=white" />
  <img src="https://img.shields.io/badge/Earth%20Locations-35-2E8B57?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Planetary%20Targets-Moon%20%26%20Mars-C1440E?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Deployment-GitHub%20Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white" />
</p>

<p align="center">
  <a href="https://nigarish12564.github.io/NASA-SpaceAppsChallege/#overview">
    <img src="https://img.shields.io/badge/🚀_Explore_Live_Application-Visit_Website-blue?style=for-the-badge" />
  </a>
</p>

## 🚀 Live Web Version

🌐 **Explore Earth Analogue Explorer:**  
[Click here to open the live website](https://nigarish12564.github.io/NASA-SpaceAppsChallege/#overview)

**Earth Analogue Explorer** is an interactive web application developed for the NASA Space Apps Challenge.

- 🌎 Explore 35 locations on Earth.
- 🇵🇰 Discover 15 locations across Pakistan.
- 🌐 Explore 20 international locations.
- 🌕 Compare Earth locations with the Moon.
- 🔴 Compare Earth locations with Mars.
- ⚖️ Adjust environmental weights and explore similarity percentages.

---

## 🪐 Explore the Moon & Mars

<table>
  <tr>
    <td align="center" width="50%">
      <img src="https://assets.science.nasa.gov/dynamicimage/assets/science/cds/general/images/2024/05/christmas2015fullmoon.jpg?crop=faces%2Cfocalpoint&fit=clip&h=3240&w=3240" width="100%" alt="The Moon"/>
      <h3>🌕 The Moon</h3>
    </td>
    <td align="center" width="50%">
      <img src="https://assets.science.nasa.gov/dynamicimage/assets/science/psd/mars/downloadable_items/3/9/39175_global-color-views-mars-PIA00407.jpg?crop=faces%2Cfocalpoint&fit=clip&h=6787&w=6787" width="100%" alt="Mars"/>
      <h3>🔴 Mars</h3>
    </td>
  </tr>
</table>

---

## 🎯 The Problem

Finding places on Earth that have environmental and geographical conditions similar to the Moon and Mars is challenging.

- 🌡️ Different planetary environments have different temperature conditions.
- 💧 Rainfall and humidity affect the characteristics of Earth locations.
- 🏔️ Terrain features such as slope and elevation also matter.
- 🔍 Comparing many locations and environmental factors manually takes time.

Our goal is to make these comparisons easier through one interactive platform.

## 💡 Our Solution

We developed Earth Analogue Explorer to help users explore and compare selected Earth locations with Moon and Mars conditions.

- 📍 Evaluate 35 selected Earth locations.
- 🌍 Explore locations through an interactive 3D globe.
- 📊 Compare environmental and terrain characteristics.
- 🧮 Calculate similarity percentages using our Planetary Analog Similarity Model (PASM).
- ⚖️ Adjust environmental weights to explore different comparison results.

---

## ✨ Key Features

### 🌎 1. Interactive 3D Earth Globe

- Explore a rotating 3D globe.
- Select locations directly through the globe.
- View the geographical position of selected sites.
- Explore different locations around the world.

### 🇵🇰 2. Pakistan's 15 Locations

Explore 15 selected locations across four regions of Pakistan.

| Region | Number of Locations |
|:---|---:|
| Balochistan | 6 |
| Gilgit-Baltistan | 4 |
| Sindh | 3 |
| Punjab | 2 |
| **Total** | **15** |

**Available filters:**
- View all 15 locations.
- Filter locations by region.

### 🌐 3. Global 20 Locations

Explore 20 international locations using different categories.

**Available filters:**

- 🌍 **All Global 20:** View all international locations.
- 🛰️ **NASA Documented:** Explore 13 locations marked as NASA documented.
- 🔴 **Mars Affinity:** Explore locations grouped by their Mars affinity.
- 🌕 **Moon Affinity:** Explore locations grouped by their Moon affinity.

### 🌕 4. Moon Comparison

- Compare selected Earth locations with lunar target conditions.
- View similarity percentages.
- Open full location details.
- Examine individual environmental parameters.

### 🔴 5. Mars Comparison

- Compare selected Earth locations with Martian target conditions.
- View similarity percentages.
- Explore detailed environmental comparisons.
- Examine individual parameter results.

### ⚖️ 6. Adjustable Environmental Weights

Different environmental factors can have different levels of importance.

Users can:

- Increase or decrease the weight of ambient temperature.
- Adjust the importance of precipitation.
- Change the weights of other environmental and terrain parameters.
- Recalculate similarity results using the selected weights.

### 📊 7. Detailed Location Analysis

- View the full details of selected locations.
- Examine ambient temperature and precipitation.
- Explore humidity, solar insolation, and terrain characteristics.
- Understand how individual parameters contribute to the comparison.

### 📁 8. Dataset & Methodology

- Explore the datasets used in the application.
- Understand the environmental parameters.
- Learn how the Planetary Analog Similarity Model works.

---

## 🔬 Environmental Parameters

Our model uses six environmental and geographical parameters to compare Earth locations with Moon and Mars conditions.

| Parameter | What It Measures |
|:---|:---|
| 🌡️ Ambient Temperature | Temperature of the surrounding air |
| 🌧️ Precipitation | Amount of rainfall |
| 💧 Relative Humidity | Moisture present in the air |
| ☀️ Solar Insolation | Solar energy received at the surface |
| 🏔️ Terrain Slope | Steepness of the land |
| ⛰️ Local Relief | Variation in elevation across an area |

---

## 🧮 Planetary Analog Similarity Model (PASM)

Our application uses the **Planetary Analog Similarity Model (PASM)** to calculate how closely an Earth location matches the selected Moon or Mars target conditions.

### ⚙️ How It Works

1. **Data Collection:** Gather environmental and terrain information for the selected locations.
2. **Parameter Evaluation:** Examine all six environmental and geographical parameters.
3. **Similarity Calculation:** Calculate how closely each parameter matches the target conditions.
4. **Weight Adjustment:** Apply user-selected weights to the parameters.
5. **Final Calculation:** Combine the weighted parameter similarities into an overall score.
6. **Results:** Display similarity percentages and detailed comparisons.

**The main idea:** Users can change the importance of environmental factors and see how the similarity results change.

---

## 🏗️ Application Architecture

The following diagram shows the main components of our application and the flow of information through the analysis process.

```mermaid
flowchart TD
    A["NASA POWER Climate Data"] --> C["Environmental Dataset"]
    B["Terrain Elevation Data"] --> D["Terrain Dataset"]

    C --> E["Data Processing"]
    D --> E

    E --> F["35 Selected Earth Locations"]
    F --> G["Planetary Analog Similarity Model (PASM)"]

    G --> H["Parameter Similarity"]
    H --> I["Adjustable Environmental Weights"]
    I --> J["Similarity Percentages"]

    J --> K["Earth Analogue Explorer"]

    K --> L["Interactive 3D Globe"]
    K --> M["Pakistan 15"]
    K --> N["Global 20"]
    K --> O["Moon Comparison"]
    K --> P["Mars Comparison"]
    K --> Q["Dataset & Methodology"]
```

---

## 🛰️ Data Sources

Our project uses environmental and geographical information from the following sources:

| Data Source | Data Used |
|:---|:---|
| [NASA POWER](https://power.larc.nasa.gov/) | Temperature, precipitation, relative humidity, and solar insolation |
| [ASTER Global DEM](https://asterweb.jpl.nasa.gov/gdem.asp) | Elevation data for terrain analysis |
| [OpenTopoData](https://www.opentopodata.org/) | Elevation data access for terrain calculations |

These datasets help us examine the environmental and geographical conditions of the selected locations.

---

## 🛠️ Technologies Used

<p>
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/Three.js-black?style=flat-square&logo=threedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/Pandas-150458?style=flat-square&logo=pandas&logoColor=white"/>
  <img src="https://img.shields.io/badge/NumPy-013243?style=flat-square&logo=numpy&logoColor=white"/>
  <img src="https://img.shields.io/badge/Plotly-3F4F75?style=flat-square&logo=plotly&logoColor=white"/>
  <img src="https://img.shields.io/badge/Streamlit-FF4B4B?style=flat-square&logo=streamlit&logoColor=white"/>
</p>

| Category | Technologies |
|:---|:---|
| Frontend | React, TypeScript, Vite |
| 3D Visualization | Three.js, React Three Fiber, Drei |
| Styling | Tailwind CSS |
| Data Processing | Python, Pandas, NumPy |
| Visualization | Plotly |
| Dashboard | Streamlit |
| Data Access | NASA POWER API, OpenTopoData |
| Deployment | GitHub Pages |
| Version Control | Git, GitHub |

---

## 🧭 Application Navigation

| Section | Features |
|:---|:---|
| 🏠 Overview | Project introduction and main exploration options |
| 🌎 3D Globe | Rotating interactive Earth globe |
| 🇵🇰 Pakistan 15 | Explore and filter Pakistan locations |
| 🌐 Global 20 | Explore international locations |
| 🌕🔴 Comparison | Separate Moon and Mars comparisons |
| ⚖️ Weights | Adjust environmental parameter weights |
| 📊 Dataset | Explore the datasets |
| 📖 Methodology | Understand the similarity model |

---

## 👩‍💻 Meet Our Team

We developed Earth Analogue Explorer as a team for the NASA Space Apps Challenge.

<table>
  <tr>
    <td align="center" width="33%">
      <a href="https://github.com/MaryamArif17">
        <img src="https://github.com/MaryamArif17.png" width="100" alt="Maryam Arif"/>
        <br/>
        <strong>Maryam Arif</strong>
      </a>
      <br/>
     <img src="https://img.shields.io/badge/Role-Team%20Lead%20%26%20Backend%20Development-3776AB?style=flat-square"/>
    </td>
    <td align="center" width="33%">
      <a href="https://github.com/Nigarish12564">
        <img src="https://github.com/Nigarish12564.png" width="100" alt="Nigarish"/>
        <br/>
        <strong>Nigarish</strong>
      </a>
      <br/>
      <img src="https://img.shields.io/badge/Role-Frontend%20%26%20UI-61DAFB?style=flat-square"/>
    </td>
    <td align="center" width="33%">
      <a href="https://github.com/ZA709">
        <img src="https://github.com/ZA709.png" width="100" alt="ZA709"/>
        <br/>
        <strong>ZA709</strong>
      </a>
      <br/>
      <img src="https://img.shields.io/badge/Role-UI%2FUX%20%26%20Research-9B59B6?style=flat-square"/>
    </td>
  </tr>
</table>

---

## 🌌 Our Goal

- 🌍 Make planetary analogue exploration easier to understand.
- 🔬 Bring environmental and geographical data together.
- 🌕 Explore possible Earth analogues for lunar environments.
- 🔴 Explore possible Earth analogues for Martian environments.
- 🚀 Support learning and research related to future space exploration.

---

## 🙏 Acknowledgements

We would like to thank:

- 🛰️ **NASA Space Apps Challenge** for the opportunity to work on a real-world space exploration challenge.
- 🌎 **NASA POWER** for providing environmental and climate data.
- 🏔️ **ASTER Global DEM** for terrain elevation data.
- 📡 **OpenTopoData** for elevation data access.
- 🔭 **NASA and the scientific community** for their planetary research and resources.

---

<p align="center">
  <strong>🌍 Exploring Earth to Understand Other Worlds 🚀</strong>
  <br/>
  Made with teamwork for the NASA Space Apps Challenge.
</p>
