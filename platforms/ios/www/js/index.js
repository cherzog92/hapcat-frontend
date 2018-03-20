/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener("resume", onResume, false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');

    },

    

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

//Global variables
var currentdate = new Date();
var hour = currentdate.getHours();
var parsed;

// Handle the resume event
function onResume() {
    changeWelcomeText();
}

function onLoad() {
    changeWelcomeText();
    console.log(hour);
    init();
}

function changeWelcomeText() {
    var welcomeText = new String();
    var timeOfDay = new String();
    if ((hour > 21 && hour <= 24) || (hour >= 0 && hour <= 4)) {
        welcomeText = "Ready for a night out?";
        timeOfDay = "Good Evening, ";
    } else if (hour > 4 && hour < 12) {
        welcomeText = "Ready for breakfast?";
        timeOfDay = "Good Morning, ";
    } else if (hour >= 12 && hour <= 15) {
        welcomeText = "Ready for lunch?";
        timeOfDay = "Good Afternoon, ";
    } else if (hour > 15 && hour <= 21) {
        welcomeText = "Ready for dinner?";
        timeOfDay = "Good Evening, ";
    } else {
        welcomeText = "Ready for some fun?";
        timeOfDay = "Hello, ";
    }

    document.getElementById("welcome_text").innerHTML = welcomeText;
    document.getElementById("time_of_day").innerHTML = timeOfDay + "User!"; //hardcoded username, replace with actual username when auth set up
    

}


//Google Places

// Places API stuff starts right here 
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var map;
var infowindow;
var newplace = 'university';
var place;

/*
function searchTest() {
    newplace = document.getElementById('myText').value;

    initMap();

}
*/

//gets user location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initPlace);
        initMap();
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

//sets search location to user location
function initPlace(position) {
    place = { lat: position.coords.latitude, lng: position.coords.longitude };
}



function initMap() {

    //set current place
    map = new google.maps.Map(document.getElementById('map'), {
        center: place,
        zoom: 15
    });

    //create map
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: place,
        radius: 500,
        //add type here to filter by type
    }, callback);
}

//results found here in results array
function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }

        //create a string of name, types & address
        placeList = results[0].name + ";       " + results[0].types + ": " + results[0].formatted_address;
        document.getElementById('output').innerHTML = placeList;
        //get photo
        var photos = results[0].photos;
        if (photos) { pic = photos[0].getUrl({ 'maxWidth': 500, 'maxHeight': 500 }); }

        placeList = results[1].name + ";       " + results[1].types + ": " + results[1].formatted_address;
        document.getElementById('output2').innerHTML = placeList;
        photos = results[1].photos;
        if (photos) { var pic2 = photos[0].getUrl({ 'maxWidth': 500, 'maxHeight': 500 }); }

        placeList = results[2].name + ";       " + results[2].types + ": " + results[2].formatted_address;
        document.getElementById('output3').innerHTML = placeList;
        photos = results[2].photos;
        if (photos) { var pic3 = photos[0].getUrl({ 'maxWidth': 500, 'maxHeight': 500 }); }

        //send photos to html
        document.getElementById('placeOut').src = pic;
        document.getElementById('placeOut2').src = pic2;
        document.getElementById('placeOut3').src = pic3;
    }
}
//end places stuff


//marks places in map don't worry about this stuff
function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function () {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function getResults(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'test-data/sample-data.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null); 
}

function init() {
    getResults(function (response) {
        // Parse JSON string into object
        parsed = JSON.parse(response);
        generateCards(parsed);
    });
}

function generateTag(iteration, returnedLocation, colors, columnSplit, use) {
    var random = Math.floor((Math.random() * colors.length));
    var tag_color = colors[random];
    colors.splice(random, 1);
    return `
<div class="${use}_tag_column_div col-${columnSplit}">
    <div class="${use}_tag_div" style="background-color: ${tag_color};">
        <p class="${use}_tag_text">${returnedLocation.types[iteration]}</p>
    </div>
</div>
`;
}

function generateCard(returnedLocation) {
    var columnSplit = 3;
    var use = "content";
    var colors = [
        "#D0B554",
        "#7D3988",
        "#D05754",
        "#337E7B"
    ]
    var tags = "";
    for (var i = 0; i < 3; i++) {
        tags += generateTag(i, returnedLocation, colors, columnSplit, use);
    }
    const contentCard = `
<div class="content_card" onClick="openNodeDetail('${returnedLocation.placeId}')">
    <div class="content_name_photo">
        <div class="content_photo_div">
            <div class="content_name_div">
                <h4 class="content_name">${returnedLocation.name}</h4>
                <p class="content_datetime">Open Today from 4:00pm to 9:30pm</p>
            </div>
            <div class="content_distance_div">
                <h4 class="content_distance">2.6mi</h4>
            </div>
            <img src="${returnedLocation.photo}" class="content_photo" />
        </div>
    </div>
    <div class="container">
        <div class="row">
            ${tags}
            <div class="col-3">
                <p class=" content_tag_text" style="font-size:1.5em;">. . .</p>
            </div>
        </div>
    </div>
</div>
`;
    return contentCard;
}

function getPlace(placeId) {
    for (var key in parsed) {
        if (parsed[key].placeId == placeId) {
            return parsed[key];
        }
    }
}

function generateCards(parsed) {
    //var returnedLocation = new Array();
    var generatedContent = "";
    for (var key in parsed) {
        //returnedLocation.push = sampleData[key];
        generatedContent += generateCard(parsed[key]);
    }
    //for (var i = 0; i < 20; i++){
    //    generatedContent += generateCard(returnedLocation);
    //}
    document.getElementById("generated_content").innerHTML = generatedContent;
}

function openNodeDetail(returnedLocation) {
    var messageText = "Opening node detail for " + returnedLocation.name;
    console.log(messageText);
    console.log(returnedLocation.name);
    constructModal(returnedLocation);
}

function constructModal(returnedLocationId) {
    var returnedLocation = getPlace(returnedLocationId);
    var columnSplit = 4;
    var use = "modal";
    var lorem = getLorem();
    var colors = [
        "#D0B554",
        "#7D3988",
        "#D05754",
        "#337E7B"
    ]
    var tags = "";
    for (var i = 0; i < 3; i++) {
        tags += generateTag(i, returnedLocation, colors, columnSplit, use);
    }
    const modalHTML = `
<div id="nodeDetail" class="modal">
    <div class="modal_content">
        <div class="modal_name_photo">
            <div class="modal_photo_div">
                <div class="modal_name_div">
                    <h4 class="modal_name">${returnedLocation.name}</h4>
                    <p class="modal_paragraph">Open Today from 4:00pm to 9:30pm</p>
                </div>
                <div class="modal_weather_div">
                    <p class="modal_paragraph">Sunny</p>
                    <h3 class="modal_h3">78&#176;</h3>
                </div>
                <div class="modal_distance_div">
                    <h4 class="modal_distance">2.6mi</h4>
                </div>
                <img src="${returnedLocation.photo}" class="modal_photo" />
            </div>
        </div>
        <div class="container">
            <div class="row">
                ${tags}
            </div>
        </div>
        <div class="modal_about">
            <p class="lato modal_paragraph">${returnedLocation.address}</p>
            <p class="lato modal_paragraph">1741 Likes</p>
            <p class="lato modal_paragraph">24 Dislikes</p>
            <p class="lato modal_paragraph">Liked by you</p>
            <p class="lato modal_paragraph">Trending Now</p>
        </div>
        <div class="modal_description">
            <p class="lato modal_paragraph">${lorem}</p>
        </div>
    </div>
</div>
`;
    document.getElementById("node_detail_generation").innerHTML = modalHTML;
    // Get the modal
    var modal = document.getElementById('nodeDetail');
    modal.style.display = "block";
}

//Modal 
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function getLorem() {
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
}

/*
 * Replace all SVG images with inline SVG
 */
//jQuery('img.svg').each(function () {
//    var $img = jQuery(this);
//    var imgID = $img.attr('id');
//    var imgClass = $img.attr('class');
//    var imgURL = $img.attr('src');

//    jQuery.get(imgURL, function (data) {
//        // Get the SVG tag, ignore the rest
//        var $svg = jQuery(data).find('svg');

//        // Add replaced image's ID to the new SVG
//        if (typeof imgID !== 'undefined') {
//            $svg = $svg.attr('id', imgID);
//        }
//        // Add replaced image's classes to the new SVG
//        if (typeof imgClass !== 'undefined') {
//            $svg = $svg.attr('class', imgClass + ' replaced-svg');
//        }

//        // Remove any invalid XML tags as per http://validator.w3.org
//        $svg = $svg.removeAttr('xmlns:a');

//        // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
//        if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
//            $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
//        }

//        // Replace image with new SVG
//        $img.replaceWith($svg);

//    }, 'xml');

//});

app.initialize();
