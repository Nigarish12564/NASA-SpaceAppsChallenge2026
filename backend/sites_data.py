"""
sites_data.py - Scientific Catalog & Planetary Metadata for 35 Analog Sites
Part of NASA Space Apps Challenge: Earth Analog Finder
"""

SITES_CATALOG = {
    # ---------------------------------------------------------
    # 15 PAKISTAN ANALOG CANDIDATE SITES
    # ---------------------------------------------------------
    "Cholistan Desert": {
        "country": "Pakistan",
        "region": "Pakistan",
        "target_affinity": "Mars",
        "category": "Literature Supported",
        "primary_features": ["Fluvial Inversion", "Hakra Paleochannel", "Aeolian Sand Sea", "Oxidized Dunes"],
        "geological_summary": "Extensive hyper-arid sand sea preserving dried relic branches of the ancient Hakra River system.",
        "scientific_reason": "Relict inverted fluvial channels and winding paleoriver ridges directly model exhumed Martian river channels observed in Aeolis Dorsa and Eberswalde Crater.",
        "citation": "Farooq et al. (2019), J. Arid Land Studies; NASA Mars Fluvial Geomorphology."
    },
    "Thar Desert": {
        "country": "Pakistan",
        "region": "Pakistan",
        "target_affinity": "Mars",
        "category": "Literature Supported",
        "primary_features": ["Aeolian Saltation", "Barchan Sand Ripples", "Pedogenic Caliche", "Evaporite Hardpans"],
        "geological_summary": "Subtropical arid basin characterized by wind-driven longitudinal sand ripples and pedogenic caliche carbonate crusts.",
        "scientific_reason": "Provides a terrestrial testbed for active aeolian saltation mechanics, trans-verse aeolian ridges (TARs), and subsurface carbonate cementation akin to Gale Crater.",
        "citation": "Singhvi & Kar (2004), Earth Sci. Rev.; Grotzinger et al. (2014), Science."
    },
    "Kharan Desert": {
        "country": "Pakistan",
        "region": "Pakistan",
        "target_affinity": "Mars",
        "category": "Literature Supported",
        "primary_features": ["Hyper-Arid Closed Basin", "Active Yardangs", "Mega-Dunes", "Slickenside Clays"],
        "geological_summary": "Enclosed endorheic desert basin in western Balochistan with extreme diurnal temperature extremes and migrating sand sheets.",
        "scientific_reason": "Closed-basin sand deflation dynamics, mega-ripples, and abrasive yardang fields simulate circumpolar Martian erg fields like Olympia Undae.",
        "citation": "Khan et al. (2017), Arabian J. Geosciences; Ward (1979), JGR Mars."
    },
    "Chagai (Dalbandin)": {
        "country": "Pakistan",
        "region": "Pakistan",
        "target_affinity": "Mars",
        "category": "Literature Supported",
        "primary_features": ["Hydrothermal Alteration", "Solfataric Vents", "Jarosite & Native Sulfur", "Acid Sulfate Weathering"],
        "geological_summary": "Neogene calc-alkaline magmatic arc displaying epithermal alteration, hydrothermal breccias, and native sulfur deposits.",
        "scientific_reason": "Hydrothermal solfataras and jarosite-bearing acidic alteration halos match the mineralogical fingerprints discovered by the Spirit and Opportunity rovers on Mars.",
        "citation": "Perello et al. (2008), Econ. Geology; Squyres et al. (2007), Science."
    },
    "Gwadar Coast": {
        "country": "Pakistan",
        "region": "Pakistan",
        "target_affinity": "Both",
        "category": "Literature Supported",
        "primary_features": ["Wave-Cut Structural Benches", "Step Fault Scarps", "Saline Mudflats", "Terramechanics Testing"],
        "geological_summary": "Makran subduction margin featuring uplifted marine terraces, fault-line scarps, and desiccated coastal sabkhas.",
        "scientific_reason": "Stepped bench geometry, fractured sandstone caprocks, and saline mudflats provide a rigorous obstacle ground for rover chassis traversability trials.",
        "citation": "Harms et al. (1984), USGS Spec. Paper; Cabrol & Grin (2010), Lakes on Mars."
    },
    "Deosai Plains": {
        "country": "Pakistan",
        "region": "Pakistan",
        "target_affinity": "Mars",
        "category": "Literature Supported",
        "primary_features": ["High-Altitude Permafrost", "Cryoturbation", "Stone Circles", "Polygon Ground"],
        "geological_summary": "One of the world's highest alpine plateaus (avg 4,114 m) characterized by continuous permafrost and patterned polygon grounds.",
        "scientific_reason": "Freeze-thaw cryoturbation polygons and sub-zero regolith temperatures reproduce periglacial patterned ground photographed by the NASA Phoenix Mars Lander.",
        "citation": "Hewitt (2014), Karakoram Himalayas; Smith et al. (2009, Phoenix Lander), Science."
    },
    "Skardu (Karakoram)": {
        "country": "Pakistan",
        "region": "Pakistan",
        "target_affinity": "Both",
        "category": "Literature Supported",
        "primary_features": ["Katpana Cold Dunes", "Glacial Bedrock Scouring", "Dry High-Altitude Air", "Regolith Simulant"],
        "geological_summary": "Intermontane valley hosting cold-climate sand dunes (Katpana) resting directly on glacio-fluvial scoured granitic basement.",
        "scientific_reason": "Juxtaposition of windblown sand sheets against bare scoured crystalline basement mirrors polar erg borders and lunar highland boundary terrain.",
        "citation": "Owen et al. (2002), QSR; Mangold (2005), Icarus."
    },
    "Hunza Valley": {
        "country": "Pakistan",
        "region": "Pakistan",
        "target_affinity": "Both",
        "category": "Literature Supported",
        "primary_features": ["Lobate Debris Aprons (LDAs)", "Rock Glaciers", "Supraglacial Debris", "Steep Wall Slopes"],
        "geological_summary": "Steep Karakoram gorge featuring massive debris-covered glaciers and active paraglacial rockfall aprons.",
        "scientific_reason": "Supraglacial debris mantles insulating relict ice cores provide exact terrestrial analogues for Martian Lobate Debris Aprons (LDAs) and buried ice reserves.",
        "citation": "Scherler et al. (2011), J. Glaciology; Head et al. (2010), EPSL."
    },
    "Salt Range": {
        "country": "Pakistan",
        "region": "Pakistan",
        "target_affinity": "Mars",
        "category": "Literature Supported",
        "primary_features": ["Precambrian Halite", "Thick Gypsum & Anhydrite", "Evaporite Fluid Inclusions", "Astrobiology"],
        "geological_summary": "Ancient thrust belt exposing massive Neoproterozoic evaporite sequences, halite salt beds, and red marl formations.",
        "scientific_reason": "Bedded sulfates, halite fluid inclusions, and subsurface brine preservation conditions match orbital CRISM chloride/sulfate detections across Martian terrae.",
        "citation": "Gee (1989), GSA Spec. Paper; Osterloo et al. (2008, Mars Chlorides), Science."
    },
    "Nok Kundi (Chagai)": {
        "country": "Pakistan",
        "region": "Pakistan",
        "target_affinity": "Mars",
        "category": "Literature Supported",
        "primary_features": ["Terminal Playa Mudcracks", "Hamun-i-Mashkel Basin", "Saline Crust Deflation", "Extreme Aridity"],
        "geological_summary": "Hyper-arid terminus of the Hamun-i-Mashkel playa lake surrounded by expansive cracked claypans and salt flats.",
        "scientific_reason": "Desiccated polygonal mudcracks and dry evaporite playa surfaces replicate ancient desiccating paleolake basins such as Jezero and Meridiani Planum.",
        "citation": "Hunting Survey Corp. (1960); Squyres & Knoll (2005), EPSL."
    },
    "Nara Desert": {
        "country": "Pakistan",
        "region": "Pakistan",
        "target_affinity": "Mars",
        "category": "Literature Supported",
        "primary_features": ["Saline Dhands (Playa Lakes)", "Interdunal Sulfate Crusts", "High Evaporation Deficit", "Iron-Oxide Sands"],
        "geological_summary": "Hyper-arid dune corridor in eastern Sindh featuring seasonal hypersaline depressions (dhands) with alkaline sulfate salts.",
        "scientific_reason": "Interdune playa crystallization and sulfate salt crust dynamics mirror the evaporative playa sedimentary cycle documented in Burns Formation sediments.",
        "citation": "Gaur et al. (2015), J. Earth Syst. Sci.; Bridges et al. (2017), Space Sci. Rev."
    },
    "Kirthar Range": {
        "country": "Pakistan",
        "region": "Pakistan",
        "target_affinity": "Both",
        "category": "Literature Supported",
        "primary_features": ["Folded Carbonate Ridges", "Boulder-Strewn Talus", "Erosional Escarpments", "Terramechanics"],
        "geological_summary": "North-south trending folded mountain range exposing weathered tertiary limestone cliffs, talus aprons, and skeletal gravel soils.",
        "scientific_reason": "Barren angular limestone scree and sharp bedrock scarps create ideal testing conditions for planetary rover suspension and wheel abrasion analysis.",
        "citation": "Bender & Raza (1995), Geology of Pakistan; NASA JPL Terramechanics."
    },
    "Hingol Coast": {
        "country": "Pakistan",
        "region": "Pakistan",
        "target_affinity": "Mars",
        "category": "Literature Supported",
        "primary_features": ["Sedimentary Mud Volcanism", "Chandragup Cones", "Methane Gas Venting", "Wind-Carved Yardangs"],
        "geological_summary": "Coastal Makran zone with world-class active mud volcanoes (Chandragup) erupting cold pressurized slurry, alongside sculpted mudstone yardangs.",
        "scientific_reason": "Mud volcano morphology and sub-surface methane venting provide direct analogs for putative sedimentary volcanism observed in Chryse and Acidalia Planitiae.",
        "citation": "Delisle et al. (2002), Marine Geology; Komatsu et al. (2016), Icarus."
    },
    "Quetta Plateau": {
        "country": "Pakistan",
        "region": "Pakistan",
        "target_affinity": "Both",
        "category": "Literature Supported",
        "primary_features": ["High Intermontane Karst", "Limestone Caves", "Microclimatic Shelters", "Diurnal Temp Extremes"],
        "geological_summary": "Elevated tectonic basin (1,800 m) flanked by Mesozoic limestone massifs hosting karst caves and semi-arid scrublands.",
        "scientific_reason": "Natural subterranean limestone caves provide thermal stability and radiation shielding analogs for planetary lava tube habitat exploration.",
        "citation": "Ahmad & Kazmi (1963), GSP Records; Titus et al. (2021), Nature Astronomy."
    },
    "Khunjerab Pass": {
        "country": "Pakistan",
        "region": "Pakistan",
        "target_affinity": "Mars",
        "category": "Literature Supported",
        "primary_features": ["Extreme Altitude (4693m)", "Hypobaric Atmosphere", "Intense Solar UV-B", "Sub-Zero Permafrost"],
        "geological_summary": "High mountain pass on the Pakistan-China border at 4,693 meters altitude with thin air, intense UV radiation, and perpetual cold.",
        "scientific_reason": "Hypobaric atmospheric pressure (approx 55 kPa) combined with high flux solar UV-B stress creates biological survival constraints approaching Martian conditions.",
        "citation": "Khan et al. (2020), Alpine Science; Cockell et al. (2000), Icarus."
    },

    # ---------------------------------------------------------
    # 20 INTERNATIONAL BENCHMARK ANALOG SITES
    # ---------------------------------------------------------
    "Atacama Desert (Chile)": {
        "country": "Chile",
        "region": "International",
        "target_affinity": "Mars",
        "category": "NASA Documented",
        "primary_features": ["Hyper-Arid Core (<1 mm/yr)", "Perchlorate Salts", "Solar UV-B Bombardment", "Viking Benchmark"],
        "geological_summary": "Oldest and driest non-polar desert on Earth, characterized by nitrate-perchlorate crusts and near-zero organic matter.",
        "scientific_reason": "Gold-standard Mars analog used by NASA to benchmark Viking, Phoenix, and Mars 2020 life-detection instrumentation and soil perchlorate chemistry.",
        "citation": "Navarro-Gonzalez et al. (2003), Science; NASA Astrobiology Institute."
    },
    "Dry Valleys (Antarctica)": {
        "country": "Antarctica",
        "region": "International",
        "target_affinity": "Mars",
        "category": "NASA Documented",
        "primary_features": ["Cold Hyper-Aridity", "Mean Temp -24.6C", "Endolithic Cyanobacteria", "Dry Permafrost Regolith"],
        "geological_summary": "Ice-free polar valleys kept snowless by fierce katabatic winds, exhibiting dry permafrost and sand-wedge polygons.",
        "scientific_reason": "Coldest and driest environment on Earth; primary model for cryptoendolithic life survival in porous sandstone under intense cold and desiccation.",
        "citation": "Marchant & Head (2007), Icarus; NASA Astrobiology Roadmap."
    },
    "Death Valley (USA)": {
        "country": "USA",
        "region": "International",
        "target_affinity": "Mars",
        "category": "NASA Documented",
        "primary_features": ["Alluvial Fan Sediments", "Borate/Sulfate Crusts", "Badlands Erosion", "MSL Rover Testing"],
        "geological_summary": "Deep extensional rift basin containing hyper-saline salt pans, layered alluvial gravel fans, and eroded mudstone badlands.",
        "scientific_reason": "Field testing ground for NASA Curiosity and Perseverance rovers to evaluate wheel wear on ventifacts and decipher mudstone-sulfate stratigraphy.",
        "citation": "JPL MSL Instrument Field Trials; Grotzinger et al. (2015), Science."
    },
    "Lut Desert (Iran)": {
        "country": "Iran",
        "region": "International",
        "target_affinity": "Mars",
        "category": "Literature Supported",
        "primary_features": ["Record Land Skin Temp (70.7C)", "Massive Kalut Yardangs", "Total Biological Sterility", "Deflation Plains"],
        "geological_summary": "Tectonic depression featuring giant wind-carved yardang ridges (kaluts) and the highest satellite-measured surface skin temperatures on Earth.",
        "scientific_reason": "Colossal yardang megastructures and absolute abiotic abiotic desert corridors provide direct morphometric analogues to Martian yardangs in Medusae Fossae.",
        "citation": "Mildrexler et al. (2011), BAMS; Goudie (2007), Geography Compass."
    },
    "Mars Desert Station (Utah)": {
        "country": "USA",
        "region": "International",
        "target_affinity": "Mars",
        "category": "NASA Documented",
        "primary_features": ["Inverted River Channels", "Smectite Clays & Gypsum", "Human EVA Simulation", "MDRS Research Habitat"],
        "geological_summary": "Mesozoic Morrison Formation exposure exhibiting exhumed inverted river sandstones, swelling bentonite clays, and desert varnish.",
        "scientific_reason": "Operational base for human planetary EVA exploration simulations; geomorphology closely mirrors inverted fluvial channels in Jezero Crater.",
        "citation": "Clarke et al. (2004), Int. J. Astrobiology; Mars Society MDRS Archives."
    },
    "Devon Island (Canada)": {
        "country": "Canada",
        "region": "International",
        "target_affinity": "Both",
        "category": "NASA Documented",
        "primary_features": ["Haughton Impact Crater (23km)", "Shatter Cones & Impact Melt", "Polar Desert Permafrost", "HMP Base"],
        "geological_summary": "High-Arctic polar desert hosting the 23-km Haughton meteorite impact structure carved into Ordovician carbonates.",
        "scientific_reason": "Primary joint NASA/SETI Haughton-Mars Project (HMP) testbed for rover robotics, impact breccia petrology, and lunar/Martian crater traverses.",
        "citation": "Lee et al. (1998), LPSC; Osinski et al. (2005), Meteoritics & Planetary Sci."
    },
    "Mauna Kea (Hawaii)": {
        "country": "USA",
        "region": "International",
        "target_affinity": "Both",
        "category": "NASA Documented",
        "primary_features": ["Basaltic Tephra Cones", "NASA JSC-1 Simulant", "Apollo Geology Training", "Lava Tube Analog"],
        "geological_summary": "Dormant oceanic shield volcano whose summit cone fields expose unweathered basaltic cinder, palagonitized ash, and volcanic bombs.",
        "scientific_reason": "Historic training ground for Apollo lunar astronauts; source material for NASA JSC-1 lunar and JSC Mars-1 regolith simulant standards.",
        "citation": "Allen et al. (1998), Space 98; Apollo Astronaut Field Training Archives."
    },
    "Danakil Depression (Ethiopia)": {
        "country": "Ethiopia",
        "region": "International",
        "target_affinity": "Mars",
        "category": "Literature Supported",
        "primary_features": ["Poly-Extreme Dallol Vents", "Negative pH (Acidic Brines)", "Native Sulfur Chimneys", "Hydrothermal Silica"],
        "geological_summary": "Rift depression 125 meters below sea level with boiling hypersaline acidic hydro-thermal pools, iron crusts, and toxic chlorine/sulfur gas vents.",
        "scientific_reason": "Poly-extreme thermodynamic limit for habitability, testing biosignature preservation in hot hyper-acidic iron-sulfate hydrothermal chimneys.",
        "citation": "Cavalazzi et al. (2019), Astrobiology; Kotopoulou et al. (2019)."
    },
    "Iceland Highlands": {
        "country": "Iceland",
        "region": "International",
        "target_affinity": "Both",
        "category": "NASA Documented",
        "primary_features": ["Askja Caldera Basalts", "Glacio-Volcanic Palagonite", "Apollo Astronaut Training", "Barren Pumice Plains"],
        "geological_summary": "Volcanic plateau dominated by subglacial tindar ridges, basaltic lava flows, and desolate pumice deflation plains.",
        "scientific_reason": "Apollo astronauts Neil Armstrong and Buzz Aldrin trained at Askja in 1965 and 1967 to master field geology on fresh, unweathered basaltic tephra.",
        "citation": "NASA Apollo Astronaut Field Training Archives; Mangold et al. (2004)."
    },
    "Tibetan Plateau": {
        "country": "China",
        "region": "International",
        "target_affinity": "Mars",
        "category": "Literature Supported",
        "primary_features": ["High-Altitude Cold Desert", "Qaidam Basin Yardangs", "Permafrost Deflation", "Sulfate Playa Lakes"],
        "geological_summary": "Highest plateau on Earth hosting the hyper-arid Qaidam Basin with dense yardang fields, saline playa crusts, and thin atmosphere.",
        "scientific_reason": "High altitude, extreme evaporation-to-precipitation deficit, and continuous permafrost mimic Martian mid-latitude cold desert processes.",
        "citation": "Kong et al. (2018), Astrobiology; Xiao et al. (2017), Earth-Sci. Rev."
    },
    "Taklamakan Desert (China)": {
        "country": "China",
        "region": "International",
        "target_affinity": "Mars",
        "category": "Literature Supported",
        "primary_features": ["Cold Continental Sand Sea", "Shifting Barchan Dunes", "Severe Dust Storms", "Atmospheric Aerosols"],
        "geological_summary": "Hyper-arid cold winter sand desert surrounded by rugged mountain barriers, prone to sustained atmospheric dust storms.",
        "scientific_reason": "Large-scale dust lifting, suspension dynamics, and thermal eddy circulation provide terrestrial physics benchmarks for Martian global dust storms.",
        "citation": "Wang et al. (2002), Geomorphology; Fenton et al. (2005), JGR Planets."
    },
    "Sahara Desert": {
        "country": "Niger / Chad",
        "region": "International",
        "target_affinity": "Mars",
        "category": "Literature Supported",
        "primary_features": ["Tenere Deflation Plains", "Desert Varnish Coatings", "Stony Serir Pavements", "Aeolian Abrasion"],
        "geological_summary": "Expansive central Saharan hyper-arid gravel plains (serir) polished by intense aeolian abrasion and coated with manganese desert varnish.",
        "scientific_reason": "Pebble-deflation desert pavements and rock varnish accretion rates directly match surface rock coatings analyzed by Spirit and Opportunity rovers.",
        "citation": "Goudie & Middleton (2001); Greeley & Iversen (1985), Wind as a Geological Process."
    },
    "Rio Tinto (Spain)": {
        "country": "Spain",
        "region": "International",
        "target_affinity": "Mars",
        "category": "NASA Documented",
        "primary_features": ["Extreme Acid River (pH ~2)", "Jarosite & Goethite", "NASA MARTE Drilling", "Chemolithoautotrophs"],
        "geological_summary": "River system draining the Iberian Pyrite Belt characterized by intensely acidic waters (pH 1.7-2.5) saturated with ferric iron and sulfates.",
        "scientific_reason": "Key field site for the NASA MARTE deep drilling project; models the formation and biosignature preservation of Martian jarosite and hematite spherules.",
        "citation": "Fernandez-Remolar et al. (2005); Stoker et al. (2008), Astrobiology."
    },
    "Craters of the Moon (USA)": {
        "country": "USA",
        "region": "International",
        "target_affinity": "Moon",
        "category": "NASA Documented",
        "primary_features": ["Apollo Astronaut Training", "Pristine Flood Basalts", "Spatter Cones & Rifts", "NASA FINESSE Project"],
        "geological_summary": "Holocene flood basalt field in Idaho displaying fissures, lava tubes, spatter ramparts, and aa/pahoehoe flows.",
        "scientific_reason": "Apollo astronaut geology training destination in 1969; currently utilized by NASA FINESSE and SUBX teams for volcanic terrain exploration concepts.",
        "citation": "Hughes et al. (2019), Planetary & Space Science; NASA FINESSE Project."
    },
    "Svalbard AMASE (Norway)": {
        "country": "Norway",
        "region": "International",
        "target_affinity": "Mars",
        "category": "NASA Documented",
        "primary_features": ["Carbonate Mantle Globules", "Bockfjorden Hydrothermal Vents", "AMASE Field Expeditions", "ALH84001 Analog"],
        "geological_summary": "High-Arctic volcanic setting in Svalbard featuring quaternary basaltic volcanic centers cutting through permafrost and mantle xenoliths.",
        "scientific_reason": "Home of the NASA/ESA Arctic Mars Analog Svalbard Expedition (AMASE); hosts carbonate globules identical in texture to those in Martian meteorite ALH84001.",
        "citation": "Steele et al. (2007), LPSC; Treiman (2003), Astrobiology."
    },
    "Pilbara Craton (Australia)": {
        "country": "Australia",
        "region": "International",
        "target_affinity": "Mars",
        "category": "NASA Documented",
        "primary_features": ["3.5 Ga Apex Chert", "Archean Stromatolites", "Earliest Evidence of Life", "Mars 2020 Training"],
        "geological_summary": "Ancient Archean continental block preserving pristine 3.48 billion-year-old bedded barite, hydro-thermal cherts, and fossilized stromatolite structures.",
        "scientific_reason": "NASA Astrobiology and Mars 2020 science team primary training ground for identifying ancient microscopic life biosignatures in silicified rocks.",
        "citation": "Van Kranendonk et al. (2008); NASA Mars 2020 Science Team Field Guide."
    },
    "Teide National Park (Spain)": {
        "country": "Spain",
        "region": "International",
        "target_affinity": "Both",
        "category": "NASA Documented",
        "primary_features": ["High Caldera (2200m)", "Phonolitic Lava Fields", "Intense Solar UV", "ExoMars Instrument Testing"],
        "geological_summary": "High-elevation volcanic caldera in Tenerife featuring phonolitic blocky lavas, pumice slopes, and sparse xerophytic vegetation.",
        "scientific_reason": "ESA and NASA field test site for Raman spectroscopy, panoramic camera calibration, and rover autonomous drive algorithms under high UV flux.",
        "citation": "Preston et al. (2012); ESA ExoMars Field Trials Team."
    },
    "Meteor Crater (USA)": {
        "country": "USA",
        "region": "International",
        "target_affinity": "Both",
        "category": "NASA Documented",
        "primary_features": ["1.2 km Impact Structure", "Shocked Quartz & Coesite", "Inverted Flap Ejecta", "Apollo & Artemis Training"],
        "geological_summary": "Best-preserved simple meteorite impact crater on Earth (Barringer Crater, Arizona), 1.2 km in diameter, in layered sedimentary sandstone/dolomite.",
        "scientific_reason": "Canonical training site for all Apollo lunar moonwalkers (1960s) and Artemis astronauts (2020-present) to study impact cratering mechanics and ejecta blankets.",
        "citation": "Shoemaker (1960); NASA Artemis Astronaut Field Geology Training Manual."
    },
    "Kilbourne Hole Maar (USA)": {
        "country": "USA",
        "region": "International",
        "target_affinity": "Moon",
        "category": "NASA Documented",
        "primary_features": ["Maar Volcanic Explosion", "Mantle Xenoliths (Peridotite)", "Apollo Training Ground", "Artemis Geology Training"],
        "geological_summary": "Phreatomagmatic maar crater in southern New Mexico exposing explosive ejecta rims embedded with green mantle peridotite xenoliths.",
        "scientific_reason": "NASA selected Kilbourne Hole for Apollo and Artemis astronaut field geology classes to simulate lunar crater ejecta sampling and rim traversing.",
        "citation": "NASA Artemis Geology Training Records (2022); Schaber (2005)."
    },
    "San Francisco Volcanic Field (USA)": {
        "country": "USA",
        "region": "International",
        "target_affinity": "Moon",
        "category": "NASA Documented",
        "primary_features": ["SP Cinder Cone", "Apollo LRV Mobility Trials", "Artificial Cinder Lakes", "Artemis Rover Testing"],
        "geological_summary": "Extensive volcanic field in northern Arizona with over 600 cinder cones, blocky basalt flows, and artificial Apollo test crater fields.",
        "scientific_reason": "Historic testing site for the Apollo Lunar Roving Vehicle (LRV) and astronaut field geology, including the USGS-dynamited Cinder Lake lunar field.",
        "citation": "Schaber (2005), USGS Open-File Report 2005-1190; NASA Desert RATS."
    }
}
