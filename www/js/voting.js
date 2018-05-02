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
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener("resume", onResume, false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');

    },



    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

function onResume() {
}

function onLoad() {
    init();
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
        constructCard(parsed[0]);
        constructStackCards();
        hammer();
    });
}

function constructStackCards() {
    var html =`<div id="card_2" class="card_2 blank_card"></div>
        <div id="card_3" class="card_3 blank_card"></div>`

    document.getElementById("stack_cards").innerHTML = html;
    $("#card_2").animate({ "opacity": 1 });
    $("#card_3").animate({ "opacity": 1 });

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

function constructCard(returnedLocation) {
    console.log(returnedLocation);
    var columnSplit = 4;
    var use = "card";
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
    const cardHTML = `
<div id="node_detail" class="card">
    <div id="content" class="card_content">
        <div class="card_name_photo">
            <div class="card_photo_div">
                <div class="card_name_div">
                    <h4 class="card_name">${returnedLocation.name}</h4>
                    <p class="card_paragraph">You were here Last Saturday from 2:13PM to 7:36PM</p>
                </div>
                <div class="card_weather_div">
                    <p class="card_paragraph">Sunny</p>
                    <h3 class="card_h3">78&#176;</h3>
                </div>
                <div class="card_distance_div">
                    <h4 class="card_distance">2.6mi</h4>
                </div>
                <img src="${returnedLocation.photo}" class="card_photo" />
            </div>
        </div>
        <div class="container">
            <div class="row">
                ${tags}
            </div>
        </div>
        <div class="card_about">
            <p class="lato card_paragraph">${returnedLocation.address}</p>
            <p class="lato card_paragraph">1741 Likes</p>
            <p class="lato card_paragraph">24 Dislikes</p>
            <p class="lato card_paragraph">Liked by you</p>
            <p class="lato card_paragraph">Trending Now</p>
        </div>
        <div class="card_description">
            <p class="lato card_paragraph">${lorem}</p>
        </div>
    </div>
</div>
`;
    
    document.getElementById("node_detail_generation").innerHTML = cardHTML;
    // Get the card
   
    $("#node_detail").animate({ "opacity": 1 });
}

function getLorem() {
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
}

//hammer.js functions

function hammer() {
    var card = $('#content').hammer();
    card.add(new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10 }));
    card.on('panleft panright', dragCard);
    card.on('panend', dragEnd);
    //card.on('swiperight', swipeRight);
    //card.on('swipeleft', swipeLeft);

    
    var isDragging = false;
    var posX = 0;

    

    function dragCard(ev) {
        var elem = ev.target;
        if (ev.gesture.velocityX >= 2 && ev.gesture.deltaX > 50) {
            swipeRight(ev);
        } else if (ev.gesture.velocityX <= -2 && ev.gesture.deltaX < 50) {
            swipeLeft(ev);
        }

        if (!isDragging && !ev.gesture.isFinal) {
            isdragging = true;
            console.log("Currently Dragging...");
            posX = ev.gesture.deltaX;
            elem.style.left = posX + "px";
        }
    }

    function swipeRight(ev) {
        if (posX >= 200) {
            console.log("Right");
            card.animate({ left: '500px' },
                {
                    complete: function () {
                        ev.target.parentNode.remove();
                    }
                });
            transition();
        }
    }

    function swipeLeft(ev) {
        if (posX <= -200) {
            console.log("Left");
            card.animate({ left: '-500px' },
                {
                    complete: function () {
                        ev.target.parentNode.remove();
                    }
                });
            transition();
        }
    }

    //function offScreen(ev) {
    //    console.log("Offscreen called")
    //    var id = setInterval(frame, 1);
    //    var elem = ev.target
    //    var parent = elem.parentElement;
    //    function frame() {
    //        if (posX > 400 || posX < -400) {
    //            clearInterval(id);
    //            console.log("Entered removal");
    //            parent.removeChild(ev.target);
    //            card.off('panleft panright', dragCard);
    //            card.off('panend', dragEnd);
               
    //        } else if (posX >= 150) {
    //            console.log("Entered right move");
    //            posX += 2;
    //            ev.target.style.left = posX + "px";
    //        } else if (posX <= -150) {
    //            console.log("Entered left move");
    //            posX -= 2;
    //            ev.target.style.left = posX + "px";
    //        } 
    //    }
    //}
    function dragEnd(ev) {
        isDragging = false;
        console.log("Dragging Completed.")
        console.log("dragEnd posX: " + posX);
        //if (posX >= 150 || posX <= -150) {
        //    offScreen(ev);
        //}
        ev.target.style.left = "0px";
        posX = 0;
    }
}

function transition() {
    $("#card_2").id = "card_2_animated";
    $("#card_2_animated").animate({
        "z-index": 8,
        "position": "relative",
        "width": "85%",
        "height": "75vh",
        "border-radius": "75px",
        
    });
    init();
}





app.initialize();
