// Fonction pour charger les données GeoJSON
async function loadGeoJSONData(url) {
    return fetch(url).then(function (response) {
        if (!response.ok) {
            throw new Error('Erreur réseau lors du chargement du GeoJSON');
        }
        return response.json();
    });
}

async function loadFeaturesStats(layer, year, rubrique) {

    if ((featuresStats == {}) || (featuresStats?.[`${layer}.${year}.${rubrique}`] == undefined)) {
        console.log("cache miss features stats")
        response = await fetch(`/stats/icpe/${layer}/${year}/${rubrique}`);
        data = await response.json();
        featuresStats[`${layer}.${year}.${rubrique}`] = data["data"];
    }

}

// Fonctions pour le zoom
function zoomToPolygon(e) {
    map.fitBounds(e.target.getBounds(), { padding: [100, 100] });
}

function zoomToPoint(e) {
    map.flyTo(e.target.getLatLng(), 9)
}

// D3.js
// Configuration de D3 pour le formatage des nombres
var locale = d3.formatLocale({
    decimal: ".",
    thousands: " ",
    grouping: [3],
    currency: ["", "€"]
});
var formatInt = locale.format(",.2s");
var formatFloat = locale.format(",.2f");
var formatPercentage = locale.format(",.2%");
// Échelle de couleur D3 pour les styles des régions/départements
var colorScale = d3.scaleSequential(d3.interpolateOranges);

// Affiche les informations d'une région/département/installation dans une div
function showRegionInfo(event, rubrique, featureType) {

    key = (featureType == "installation") ? event.target.options.code : event.target.feature.properties.code;
    layer = (featureType == "installation") ? "installations" : selectedLayer;
    var stats = featuresStats[`${layer}.${selectedYear}.${selectedRubrique}`][key];

    var regionInfoDiv = document.getElementById("region-info");
    regionInfoDiv.replaceChildren();

    var processedQuantity_key = "moyenne_quantite_journaliere_traitee";
    var unit = "t/j";
    var processedQuantityPrefix = "Quantité journalière traitée en moyenne :";
    var usedQuantityPrefix = "Quantité journalière consommée en moyenne :";
    if (rubrique == "2760-1") {
        processedQuantity_key = "cumul_quantite_traitee";
        unit = "t/an";
        processedQuantityPrefix = "Quantité traitée en cummulé :"
        usedQuantityPrefix = "Quantité consommée sur l'année :"
    }

    if (featureType == "installation") {
        e = document.createElement("h2")
        e.textContent = stats.raison_sociale
        regionInfoDiv.append(e)

        adresseDiv = document.createElement("div")
        adresseDiv.id = "address-info"
        e = document.createElement("p")
        e.textContent = `${stats.adresse1 ?? ""}`
        adresseDiv.append(e)
        e = document.createElement("p")
        e.textContent = `${stats.adresse2 ?? ""}`
        adresseDiv.append(e)
        e = document.createElement("p")
        e.textContent = `${stats.code_postal ?? ""} ${stats.commune ?? ""}`
        adresseDiv.append(e)
        regionInfoDiv.append(adresseDiv)

        e = document.createElement("p")
        e.textContent = `Code AIOT : ${stats.code_aiot}`
        regionInfoDiv.append(e)

        e = document.createElement("p")
        e.textContent = `SIRET : ${stats.siret}`
        regionInfoDiv.append(e)


        e = document.createElement("p")
        var authorizedQuantity = stats.quantite_autorisee != null ? formatInt(stats.quantite_autorisee) : "N/A";
        e.textContent = `Quantité autorisée : ${authorizedQuantity} ${unit}`
        regionInfoDiv.append(e)

        e = document.createElement("p")
        var processedQuantity = stats[processedQuantity_key]
        e.textContent = `${processedQuantityPrefix} ${formatFloat(processedQuantity)} ${unit}`
        regionInfoDiv.append(e)

        e = document.createElement("p")
        var usedQuantity = stats.taux_consommation != null ? formatPercentage(stats.taux_consommation) : "N/A";
        e.textContent = `${usedQuantityPrefix} ${usedQuantity}`
        regionInfoDiv.append(e)
    } else {
        e = document.createElement("h2")
        e.textContent = event.target.feature.properties.nom
        regionInfoDiv.append(e)

        if (stats) {
            e = document.createElement("p")
            e.textContent = `Nombre d'installations : ${stats.nombre_installations}`
            regionInfoDiv.append(e)

            e = document.createElement("p")
            var authorizedQuantity = stats.quantite_autorisee != null ? formatInt(stats.quantite_autorisee) : "N/A";
            e.textContent = `Quantité autorisée : ${authorizedQuantity} ${unit}`
            regionInfoDiv.append(e)

            e = document.createElement("p")
            var processedQuantity = stats[processedQuantity_key]
            e.textContent = `${processedQuantityPrefix} ${formatFloat(processedQuantity)} ${unit}`
            regionInfoDiv.append(e)

            e = document.createElement("p")
            var usedQuantity = stats.taux_consommation != null ? formatPercentage(stats.taux_consommation) : "N/A";
            e.textContent = `${usedQuantityPrefix} ${usedQuantity}`
            regionInfoDiv.append(e)
        } else {
            e = document.createElement("p")
            e.textContent = "Nombre d'installations : N/A"
            regionInfoDiv.append(e)

            e = document.createElement("p")
            e.textContent = "Quantité autorisée : N/A"
            regionInfoDiv.append(e)

        }

    }

    idDivGraph = "graph"
    Plotly.purge(idDivGraph);

    if (stats && stats.graph) {
        var plotData = JSON.parse(stats.graph)
        Plotly.newPlot(
            idDivGraph,
            plotData.data,
            plotData.layout);
    }

}


// Mettre en surbrillance la région ou le département sélectionné
function styleSelected(e) {

    if (currentSelectedLayer) {
        currentSelectedLayer.setStyle({
            color: '#2f3640',
            weight: 1,
        });
    }

    currentSelectedLayer = e.target;

    e.target.setStyle({
        color: '#2c3e50',
        weight: 4,
        opacity: 1,
    })
}

// Gestionnaires d'événements pour interagir avec les polygones et les points
function clickOnPolygonHandler(e, rubrique) {
    zoomToPolygon(e);
    showRegionInfo(e, rubrique, "region");
    styleSelected(e);
}

function onEachPolygonFeature(feature, layer, rubrique) {
    layer.on({
        click: (e) => { clickOnPolygonHandler(e, rubrique) }
    });

}

function clickOnPointHandler(e, rubrique) {
    zoomToPoint(e);
    showRegionInfo(e, rubrique, "installation");
}

function onEachPointFeature(feature, layer, rubrique) {
    layer.on({
        click: (e) => { clickOnPointHandler(e, rubrique) }
    });

}



// Ajoute ou enlève une couche
function setLayer(layerName) {
    if (currentLayer) {
        map.removeLayer(currentLayer);
    }

    if (layerName === 'regions') {
        currentLayer = geojsonRegions;
    } else if (layerName === 'departements') {
        currentLayer = geojsonDepartements;
    }
    else {
        currentLayer = null;
    }

    if (currentLayer) {
        map.addLayer(currentLayer);
    }
}

// Ajoute ou enlève la couche contenant les installations
async function loadInstallations(year, rubrique) {

    await loadFeaturesStats('installations', year, rubrique);

    markers = []
    for (const [key, value] of Object.entries(featuresStats[`installations.${selectedYear}.${selectedRubrique}`])) {
        markers.push(
            L.marker([value.latitude, value.longitude], { "title": value.raison_sociale, "code": key }).on('click',
                (e) => {
                    clickOnPointHandler(e, selectedRubrique);
                    showRegionInfo(e, selectedRubrique, "installation");
                }
            )
        );
    }

    installationsLayer = L.layerGroup(markers);
}

async function loadRegionalGeojsons() {
    if (!regionsGeojson) {
        console.log("Cache miss for regions");
        await loadGeoJSONData(regionsGeoJSONUrl).then((data) => {
            regionsGeojson = data;
        });
    };

    if (!departementsGeojson) {
        console.log("Cache miss for regions");
        await loadGeoJSONData(departementsGeoJSONUrl).then((data) => {
            departementsGeojson = data;
        });
    };

}

// Crée et configure les couches GeoJSON en fonction des données sélectionnées
async function prepareMap(layer_name, rubrique, year) {

    // Si les couches existent déjà sur la carte, il faut les retirer
    if (regionsLayer) map.removeLayer(regionsLayer);
    if (departementsLayer) map.removeLayer(departementsLayer);
    if (installationsLayer) map.removeLayer(installationsLayer);

    await loadRegionalGeojsons();


    await loadFeaturesStats(layer_name, year, rubrique);
    if (layer_name == "regions") {
        regionsLayer = L.geoJSON(regionsGeojson,
            {
                style: stylePolygon,
                onEachFeature: (feature, layer) => { onEachPolygonFeature(feature, layer, rubrique) }
            });
        map.addLayer(regionsLayer);
        console.log("layer added");
    }

    if (layer_name == "departements") {
        departementsLayer = L.geoJSON(departementsGeojson,
            {
                style: stylePolygon,
                onEachFeature: (feature, layer) => { onEachPolygonFeature(feature, layer, rubrique) }
            });
        map.addLayer(departementsLayer);
        console.log("layer added");
    }

    await loadInstallations(year, rubrique);

    if (installationsToggled) {
        map.addLayer(installationsLayer);
    }

}

// Gestionnaire d'événements pour le sélecteur de couche
document.getElementById('layer-select').addEventListener('change', function (e) {

    selectedLayer = e.target.value;
    prepareMap(selectedLayer, selectedRubrique, selectedYear);

});

// Gestionnaire d'événements pour le sélecteur d'année'e
document.getElementById('year-select').addEventListener('change', function (e) {

    selectedYear = e.target.value;
    prepareMap(selectedLayer, selectedRubrique, selectedYear);

});

// Gestionnaire d'événements pour le sélecteur de rubrique
document.getElementById('rubrique-select').addEventListener('change', function (e) {
    selectedRubrique = e.target.value;
    prepareMap(selectedLayer, selectedRubrique, selectedYear);

});

// Gestionnaire d'événements pour le bouton toggle des installations
document.getElementById('toggle-installations').addEventListener('change', function (e) {
    installationsToggled = e.target.checked;

    if (installationsToggled) {
        map.addLayer(installationsLayer);
    } else {
        map.removeLayer(installationsLayer);
    }


});



// Styles pour les régions/départements
function stylePolygon(feature) {
    // Extract the relevant properties
    console.log("styling feature", feature)
    featureId = feature.properties.code
    featureStats = featuresStats[`${selectedLayer}.${selectedYear}.${selectedRubrique}`][featureId];

    var processedQuantityKey = "moyenne_quantite_journaliere_traitee";
    if (selectedRubrique == "2760-1") {
        processedQuantityKey = "cumul_quantite_traitee";
    }
    var processedQuantity = featureStats ? featureStats[processedQuantityKey] : null;

    var ratio = featureStats ? featureStats.taux_consommation : null;

    console.log(feature.properties, ratio)
    // Calcul de la couleur
    var fillColor;
    var fillOpacity;

    if ((ratio == null) && (processedQuantity == null)) {
        console.log("Bug")
        fillColor = '#2f3640';
        fillOpacity = 0.6;
    } else if (((ratio == null) && (processedQuantity > 0)) || (ratio > 1)) {
        console.log("stripes")
        fillColor = 'url(#stripes)';
        fillOpacity = 1;
    } else {
        console.log("Normal")
        fillColor = colorScale(ratio);
        fillOpacity = 0.6;
    }

    return {
        fillColor: fillColor,
        weight: 1,
        opacity: 0.6,
        color: '#2f3640', // couleur des bordures
        fillOpacity: 0.6
    }
}


// Style pour les points des installations (à modifier)
function stylePoint(geoJsonPoint, latlng) {

    return L.marker(latlng);
}