var map;
var directionsDisplay = null;
var directionsService;
var polylinePath;

var nodes = [];
var prevNodes = [];
var markers = [];
var durations = [];


var markData = [];

 markData[0] = {phos : 991.814 , merc : 913.438 , ecoli : 1277.26 , lead : 991.814 };
 markData[1] = {phos : 1289.92 , merc : 969.811 , ecoli : 1414.52 , lead : 1490.83 };
 markData[2] = {phos : 1579.41 , merc : 965.585 , ecoli : 1913.49 , lead : 1606.34 };
 markData[3] = {phos : 11376.9 , merc : 6861.38 , ecoli : 2420.89 , lead : 1836.31 };
 markData[4] = {phos : 20850.6 , merc : 8613.67 , ecoli : 3997.79 , lead : 1356.94 };
 markData[5] = {phos : 26921.4 , merc : 17786.9 , ecoli : 5265.56 , lead : 2287.83 };
 markData[6] = {phos : 34555.7 , merc : 44412.6 , ecoli : 7090.26 , lead : 122742.33 };
 markData[7] = {phos : 91552 , merc : 343730 , ecoli : 16115.2 , lead : 10002.4   };
 markData[8] = {phos : 44385.5 , merc : 86475.1 , ecoli : 9168.67 , lead : 2326.27  };
 markData[9] = {phos : 22355.5 , merc : 9570.63 , ecoli : 4246.69 , lead : 1480.19  };
 markData[10] = {phos : 25209.6 , merc : 7969.39 , ecoli : 4820.08 , lead : 2859.9  };
 markData[11] = {phos : 39974.79 , merc : 3160.94 , ecoli : 1356.94 , lead : 1620.1 };
 markData[12] = {phos : 74237.7 , merc : 241884 , ecoli : 13989.1 , lead : 8810.86 };
 markData[13] = {phos : 61505.9 , merc : 12180.1 , ecoli : 7763.79 , lead : 7212.3  };
 markData[14] = {phos : 44385.5 , merc : 7090.26 , ecoli : 6723.61 , lead : 5170.8 };

var thresholds =
	{
		phos: {e0: 60000 , e1: 70000}, 
		merc: {e0: 100000 , e1: 200000},
		ecoli: {e0: 8000 , e1: 16000},
		lead: {e0: 100000 , e1: 12000}
	};

//google map custom marker icon - .png fallback for IE11
	var marker_url = 'img/cd-icon-location.svg';
	var marker_url_0 = 'img/pass.png';
	var marker_url_1 = 'img/warning.png';
	var marker_url_2 = 'img/skull.png';


function addInfoWindow(marker, message) {

            var infoWindow = new google.maps.InfoWindow({
                content: message
            });

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open(map, marker);
            });
        }


// Initialize google maps
function initializeMap() {
	
	
		
	//define the basic color of your map, plus a value for saturation and brightness
	var	main_color = '#2d313f',
		saturation_value= -20,
		brightness_value= 5;

	//we define here the style of the map
	var style= [ 
		{
			//set saturation for the labels on the map
			elementType: "labels",
			stylers: [
				{saturation: saturation_value}
			]
		},  
	    {	//poi stands for point of interest - don't show these lables on the map 
			featureType: "poi",
			elementType: "labels",
			stylers: [
				{visibility: "off"}
			]
		},
		{
			//don't show highways lables on the map
	        featureType: 'road.highway',
	        elementType: 'labels',
	        stylers: [
	            {visibility: "off"}
	        ]
	    }, 
		{ 	
			//don't show local road lables on the map
			featureType: "road.local", 
			elementType: "labels.icon", 
			stylers: [
				{visibility: "off"} 
			] 
		},
		{ 
			//don't show arterial road lables on the map
			featureType: "road.arterial", 
			elementType: "labels.icon", 
			stylers: [
				{visibility: "off"}
			] 
		},
		{
			//don't show road lables on the map
			featureType: "road",
			elementType: "geometry.stroke",
			stylers: [
				{visibility: "off"}
			]
		}, 
		//style different elements on the map
		{ 
			featureType: "transit", 
			elementType: "geometry.fill", 
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		}, 
		{
			featureType: "poi",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "poi.government",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "poi.sport_complex",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "poi.attraction",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "poi.business",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "transit",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "transit.station",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "landscape",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
			
		},
		{
			featureType: "road",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		},
		{
			featureType: "road.highway",
			elementType: "geometry.fill",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		}, 
		{
			featureType: "water",
			elementType: "geometry",
			stylers: [
				{ hue: main_color },
				{ visibility: "on" }, 
				{ lightness: brightness_value }, 
				{ saturation: saturation_value }
			]
		}
	];
	
    // Map options
    var opts = {
        center: new google.maps.LatLng(42.1231995072, -83.1718659792),
        zoom: 11,
        streetViewControl: false,
        mapTypeControl: false,
		styles: style
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), opts);

    // Create map click event
    google.maps.event.addListener(map, 'click', function(event) {
        // Add destination (max 10)
        if (nodes.length >= 15) {
            alert('Max destinations added');
            return;
        }

        // If there are directions being shown, clear them
        clearDirections();
        
        // Add a node to map
        marker = new google.maps.Marker({
			position: event.latLng,
			map: map,
			icon: marker_url
		});
        markers.push(marker);
        
        // Store node's lat and lng
        nodes.push(event.latLng);
        
        // Update destination count
        $('#destinations-count').html(nodes.length);
    });

    // Add "my location" button
    var myLocationDiv = document.createElement('div');
    new getMyLocation(myLocationDiv, map);

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(myLocationDiv);
    
    function getMyLocation(myLocationDiv, map) {
        var myLocationBtn = document.createElement('button');
        myLocationBtn.innerHTML = 'My Location';
        myLocationBtn.className = 'large-btn';
        myLocationBtn.style.margin = '5px';
        myLocationBtn.style.opacity = '0.95';
        myLocationBtn.style.borderRadius = '3px';
        myLocationDiv.appendChild(myLocationBtn);
    
        google.maps.event.addDomListener(myLocationBtn, 'click', function() {
            navigator.geolocation.getCurrentPosition(function(success) {
                map.setCenter(new google.maps.LatLng(success.coords.latitude, success.coords.longitude));
                map.setZoom(12);
            });
        });
    }
}

// Get all durations depending on travel type
function getDurations(callback) {
    for(var i = 0; i < nodes.length; i++){
        
        durations[i] = [];
        
        var iNode = nodes[i];
        var ix = getCoords("x", iNode);
        var iy = getCoords("y", iNode);
        
        for (var j = 0; j < nodes.length; j++){
           
            var jNode = nodes[j];
            var jx = getCoords("x", jNode);
            var jy = getCoords("y", jNode);
            
            var xDiff = ix - jx;
            var yDiff = iy - jy;
            
            durations[i][j] = Math.sqrt(Math.pow(xDiff,2)+Math.pow(yDiff,2));
        }
    }
    
    callback();
    
    


function getCoords(coord, coords){
    var xy = formatCoords(coords).split(',');
    
    if (coord == "x")
       return xy[0];
    else if (coord == "y")
        return xy[1];
    else
        return null;
}

function formatCoords(coords){
    return coords.toString().replace("(","").replace(")","").replace(" ","");
}
    /*
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: nodes,
        destinations: nodes,
        travelMode: google.maps.TravelMode[$('#travel-type').val()],
        avoidHighways: parseInt($('#avoid-highways').val()) > 0 ? true : false,
        avoidTolls: false,
    }, function(distanceData) {
        // Create duration data array
        var nodeDistanceData;
        for (originNodeIndex in distanceData.rows) {
            nodeDistanceData = distanceData.rows[originNodeIndex].elements;
            durations[originNodeIndex] = [];
            for (destinationNodeIndex in nodeDistanceData) {
                if (durations[originNodeIndex][destinationNodeIndex] = nodeDistanceData[destinationNodeIndex].duration == undefined) {
                    alert('Error: couldn\'t get a trip duration from API');
                    return;
                }
                durations[originNodeIndex][destinationNodeIndex] = nodeDistanceData[destinationNodeIndex].duration.value;
            }
        }

        if (callback != undefined) {
            callback();
        }
    });
    */
    
    
  //alert(durations[0][1]);
    
}

// Removes markers and temporary paths
function clearMapMarkers() {
    for (index in markers) {
        markers[index].setMap(null);
    }

    prevNodes = nodes;
    nodes = [];

    if (polylinePath != undefined) {
        polylinePath.setMap(null);
    }
    
    markers = [];
    
    $('#ga-buttons').show();
}
// Removes map directions
function clearDirections() {
    // If there are directions being shown, clear them
    if (directionsDisplay != null) {
        directionsDisplay.setMap(null);
        directionsDisplay = null;
    }
}
// Completely clears map
function clearMap() {
    clearMapMarkers();
    clearDirections();
    
    $('#destinations-count').html('0');
}

// Initial Google Maps
google.maps.event.addDomListener(window, 'load', initializeMap);

// Create listeners
$(document).ready(function() {
    $('#clear-map').click(clearMap);

    // Start GA
    $('#find-route').click(function() {    
        if (nodes.length < 2) {
            if (prevNodes.length >= 2) {
                nodes = prevNodes;
            } else {
                alert('Click on the map to select destination points');
                return;
            }
        }

        if (directionsDisplay != null) {
            directionsDisplay.setMap(null);
            directionsDisplay = null;
        }

        // Get route durations
        getDurations(function(){
            $('.ga-info').show();

            // Get config and create initial GA population
            ga.getConfig();
            var pop = new ga.population();
            pop.initialize(nodes.length);
            var route = pop.getFittest().chromosome;

            ga.evolvePopulation(pop, function(update) {
                
                $('#generations-passed').html(update.generation + " generations");
                
                if (update.generation == ga.maxGenerations) {
                    $('#generations-passed').html("Done!");
					$('#send-drone').removeClass('invisible');
					$('#find-route').addClass('invisible');
                }
                    
                    
                // Get route coordinates
                var route = update.population.getFittest().chromosome;
                var routeCoordinates = [];
                for (index in route) {
                    routeCoordinates[index] = nodes[route[index]];
                }
                routeCoordinates[route.length] = nodes[route[0]];

                // Display temp. route
                if (polylinePath != undefined) {
                    polylinePath.setMap(null);
                }
                polylinePath = new google.maps.Polyline({
                    path: routeCoordinates,
                    strokeColor: "#0066ff",
                    strokeOpacity: 0.75,
                    strokeWeight: 2,
                });
                polylinePath.setMap(map);
            }, function(result) {
                // Get route
                route = result.population.getFittest().chromosome;

                // Add route to map
                directionsService = new google.maps.DirectionsService();
                directionsDisplay = new google.maps.DirectionsRenderer();
                directionsDisplay.setMap(map);
                var waypts = [];
                for (var i = 1; i < route.length; i++) {
                    waypts.push({
                        location: nodes[route[i]],
                        stopover: true
                    });
                }
                
            });
        });
    });
	$('#send-drone').click(function() {
		for (index in markers) {
			
			var marker = markers[index];
			var data = markData[index];
			
			var toxicLevel = -1;
			
			if (data.phos > thresholds.phos.e0 || data.merc > thresholds.merc.e0 || data.lead > thresholds.lead.e0 || data.ecoli > thresholds.ecoli.e0){
				toxicLevel = 0;
			}
			
			if (data.phos > thresholds.phos.e1 || data.merc > thresholds.merc.e1 || data.lead > thresholds.lead.e1 || data.ecoli > thresholds.ecoli.e1){
				toxicLevel = 1;
			}
			
			var message = "";
			
			message += "<span style='color:" + getWarningLevelColor(data.phos,thresholds.phos.e0,thresholds.merc.e1) + "'>";
			message += "Phosphorous: " + data.phos;
			message += "</span>";
			message += "<br />";
			
			message += "<span style='color:" + getWarningLevelColor(data.merc,thresholds.merc.e0,thresholds.merc.e1) + "' >";
			message += "Mercury: " + data.merc;
			message += "</span>";
			message += "<br />";
			
			message += "<span style='color:" + getWarningLevelColor(data.lead,thresholds.lead.e0,thresholds.lead.e1) + "' >";
			message += "Lead: " + data.lead;
			message += "</span>";
			message += "<br />";
			
			message += "<span style='color:" + getWarningLevelColor(data.ecoli,thresholds.ecoli.e0,thresholds.ecoli.e1) + "' >";
			message += "E. Coli: " + data.ecoli;
			message += "</span>";
			message += "<br />";
			
			addInfoWindow(marker, message);
			
			
			if (toxicLevel == -1)
				marker.setIcon(marker_url_0);
			if (toxicLevel == 0)
				marker.setIcon(marker_url_1);
			if (toxicLevel == 1)
				marker.setIcon(marker_url_2);
			
			
    	}
	});
});

	function getWarningLevelColor(dataIn, e0, e1){
		
		if (dataIn > e1)
			return "red";
		
		if (dataIn > e0)
			return "orange";
		
		return "black";
	}

// GA code
var ga = {
    // Default config
    "crossoverRate": 0.5,
    "mutationRate": 0.1,
    "populationSize": 1000,
    "tournamentSize": 5,
    "elitism": true,
    "maxGenerations": 50,
    
    "tickerSpeed": 60,

    // Loads config from HTML inputs
    "getConfig": function() {
        ga.crossoverRate = 0.5;
        ga.mutationRate = 0.1;
        ga.populationSize = 1000;
        ga.elitism = true;
        switch(true){
            case markers.length <=7:
                ga.maxGenerations = 50
                break;
            case markers.length <= 10:
                ga.maxGenerations = 100;
                break;
            case markers.length > 10:
                ga.maxGenerations = 100;
                break;
        }
    },
    
    // Evolves given population
    "evolvePopulation": function(population, generationCallBack, completeCallBack) {        
        // Start evolution
        var generation = 1;
        var evolveInterval = setInterval(function() {
            if (generationCallBack != undefined) {
                generationCallBack({
                    population: population,
                    generation: generation,
                });
            }

            // Evolve population
            population = population.crossover();
            population.mutate();
            generation++;
            
            // If max generations passed
            if (generation > ga.maxGenerations) {
                // Stop looping
                clearInterval(evolveInterval);
                
                if (completeCallBack != undefined) {
                    completeCallBack({
                        population: population,
                        generation: generation,
                    });
                }
            }
        }, ga.tickerSpeed);
    },

    // Population class
    "population": function() {
        // Holds individuals of population
        this.individuals = [];
    
        // Initial population of random individuals with given chromosome length
        this.initialize = function(chromosomeLength) {
            this.individuals = [];
    
            for (var i = 0; i < ga.populationSize; i++) {
                var newIndividual = new ga.individual(chromosomeLength);
                newIndividual.initialize();
                this.individuals.push(newIndividual);
            }
        };
        
        // Mutates current population
        this.mutate = function() {
            var fittestIndex = this.getFittestIndex();

            for (index in this.individuals) {
                // Don't mutate if this is the elite individual and elitism is enabled 
                if (ga.elitism != true || index != fittestIndex) {
                    this.individuals[index].mutate();
                }
            }
        };

        // Applies crossover to current population and returns population of offspring
        this.crossover = function() {
            // Create offspring population
            var newPopulation = new ga.population();
            
            // Find fittest individual
            var fittestIndex = this.getFittestIndex();

            for (index in this.individuals) {
                // Add unchanged into next generation if this is the elite individual and elitism is enabled
                if (ga.elitism == true && index == fittestIndex) {
                    // Replicate individual
                    var eliteIndividual = new ga.individual(this.individuals[index].chromosomeLength);
                    eliteIndividual.setChromosome(this.individuals[index].chromosome.slice());
                    newPopulation.addIndividual(eliteIndividual);
                } else {
                    // Select mate
                    var parent = this.tournamentSelection();
                    // Apply crossover
                    this.individuals[index].crossover(parent, newPopulation);
                }
            }
            
            return newPopulation;
        };

        // Adds an individual to current population
        this.addIndividual = function(individual) {
            this.individuals.push(individual);
        };

        // Selects an individual with tournament selection
        this.tournamentSelection = function() {
            // Randomly order population
            for (var i = 0; i < this.individuals.length; i++) {
                var randomIndex = Math.floor(Math.random() * this.individuals.length);
                var tempIndividual = this.individuals[randomIndex];
                this.individuals[randomIndex] = this.individuals[i];
                this.individuals[i] = tempIndividual;
            }

            // Create tournament population and add individuals
            var tournamentPopulation = new ga.population();
            for (var i = 0; i < ga.tournamentSize; i++) {
                tournamentPopulation.addIndividual(this.individuals[i]);
            }

            return tournamentPopulation.getFittest();
        };
        
        // Return the fittest individual's population index
        this.getFittestIndex = function() {
            var fittestIndex = 0;

            // Loop over population looking for fittest
            for (var i = 1; i < this.individuals.length; i++) {
                if (this.individuals[i].calcFitness() > this.individuals[fittestIndex].calcFitness()) {
                    fittestIndex = i;
                }
            }

            return fittestIndex;
        };

        // Return fittest individual
        this.getFittest = function() {
            return this.individuals[this.getFittestIndex()];
        };
    },

    // Individual class
    "individual": function(chromosomeLength) {
        this.chromosomeLength = chromosomeLength;
        this.fitness = null;
        this.chromosome = [];

        // Initialize random individual
        this.initialize = function() {
            this.chromosome = [];

            // Generate random chromosome
            for (var i = 0; i < this.chromosomeLength; i++) {
                this.chromosome.push(i);
            }
            for (var i = 0; i < this.chromosomeLength; i++) {
                var randomIndex = Math.floor(Math.random() * this.chromosomeLength);
                var tempNode = this.chromosome[randomIndex];
                this.chromosome[randomIndex] = this.chromosome[i];
                this.chromosome[i] = tempNode;
            }
        };
        
        // Set individual's chromosome
        this.setChromosome = function(chromosome) {
            this.chromosome = chromosome;
        };
        
        // Mutate individual
        this.mutate = function() {
            this.fitness = null;
            
            // Loop over chromosome making random changes
            for (index in this.chromosome) {
                if (ga.mutationRate > Math.random()) {
                    var randomIndex = Math.floor(Math.random() * this.chromosomeLength);
                    var tempNode = this.chromosome[randomIndex];
                    this.chromosome[randomIndex] = this.chromosome[index];
                    this.chromosome[index] = tempNode;
                }
            }
        };
        
        // Returns individuals route distance
        this.getDistance = function() {
            var totalDistance = 0;

            for (index in this.chromosome) {
                var startNode = this.chromosome[index];
                var endNode = this.chromosome[0];
                if ((parseInt(index) + 1) < this.chromosome.length) {
                    endNode = this.chromosome[(parseInt(index) + 1)];
                }

                totalDistance += durations[startNode][endNode];
            }
            
            totalDistance += durations[startNode][endNode];
            
            return totalDistance;
        };

        // Calculates individuals fitness value
        this.calcFitness = function() {
            if (this.fitness != null) {
                return this.fitness;
            }
        
            var totalDistance = this.getDistance();

            this.fitness = 1 / totalDistance;
            return this.fitness;
        };

        // Applies crossover to current individual and mate, then adds it's offspring to given population
        this.crossover = function(individual, offspringPopulation) {
            var offspringChromosome = [];

            // Add a random amount of this individual's genetic information to offspring
            var startPos = Math.floor(this.chromosome.length * Math.random());
            var endPos = Math.floor(this.chromosome.length * Math.random());

            var i = startPos;
            while (i != endPos) {
                offspringChromosome[i] = individual.chromosome[i];
                i++

                if (i >= this.chromosome.length) {
                    i = 0;
                }
            }

            // Add any remaining genetic information from individual's mate
            for (parentIndex in individual.chromosome) {
                var node = individual.chromosome[parentIndex];

                var nodeFound = false;
                for (offspringIndex in offspringChromosome) {
                    if (offspringChromosome[offspringIndex] == node) {
                        nodeFound = true;
                        break;
                    }
                }

                if (nodeFound == false) {
                    for (var offspringIndex = 0; offspringIndex < individual.chromosome.length; offspringIndex++) {
                        if (offspringChromosome[offspringIndex] == undefined) {
                            offspringChromosome[offspringIndex] = node;
                            break;
                        }
                    }
                }
            }

            // Add chromosome to offspring and add offspring to population
            var offspring = new ga.individual(this.chromosomeLength);
            offspring.setChromosome(offspringChromosome);
            offspringPopulation.addIndividual(offspring);
        };
    },
};

