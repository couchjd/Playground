/*
    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program; if not, see http://www.gnu.org/licenses
*/

var ws = new WebSocket("ws://"+document.location.hostname+":8081/socket")
var localX = document.querySelector("#local .x");
var localY = document.querySelector("#local .y");
var remoteX = document.querySelector("#remote .x"); 
var remoteY = document.querySelector("#remote .y");
var box = document.getElementById("box");
var connectButton = document.getElementById("connect");
var pc = null;
var started = false;
var channel;
var rChannel;
var initiator = false;
var removed = false;

var RTCPeerConnection;
var getUserMedia = (navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
if(window.webkitRTCPeerConnection) {
    RTCPeerConnection = webkitRTCPeerConnection;
}
else {
    RTCPeerConnection = mozRTCPeerConnection;
    var RTCIceCandidate = mozRTCIceCandidate;
    var RTCSessionDescription = mozRTCSessionDescription;
}

var mediaConstraints = {'mandatory': {
    'OfferToReceiveAudio':false, 
    'OfferToReceiveVideo':false }
};

connectButton.addEventListener("click", connect, false);

document.addEventListener("mousemove", function(event) {
    var x = event.pageX;
    var y = event.pageY;
    localX.innerHTML = x;
    localY.innerHTML = y;

    if(started) {
        if(!removed) {
            connectButton.remove();
            removed = true;
        }
        if(initiator) {
            if(channel.readyState == 'open') {
                channel.send(JSON.stringify({x:x, y:y}));
            }

            else if(channel.readyState == 'closed') {
                pc.close();
                document.body.appendChild(connectButton);
                started = false;
                removed=false;
            }
        }
        else {
            if(rChannel.readyState == 'open') {
                rChannel.send(JSON.stringify({x:x, y:y}));
            }

            else if(rChannel.readyState == 'closed') {
                pc.close();
                document.body.appendChild(connectButton);
                started = false;
                removed=false;
            }
        }
    }
    
}, false);

ws.onopen = function() {
    channelReady = true;
}

ws.onmessage = receive;

function setAndSendDesc(sessionDescription) {
    pc.setLocalDescription(sessionDescription);
    console.log(sessionDescription);
    console.log(typeof(sessionDescription));
    ws.send(JSON.stringify(sessionDescription));
}

function connect() {
    initiator = true;
    if(channelReady) {
        create();
        channel = pc.createDataChannel("data", {reliable: false});
        channel.onmessage = function(msg) {
            var received = JSON.parse(msg.data);
            remoteX.innerHTML = received.x;
            remoteY.innerHTML = received.y;
            box.style.left = received.x;
            box.style.top = received.y;
        }
        started = true;
        pc.createOffer(setAndSendDesc, function(e) { console.log("An error occured. Code: " + e.code) }, mediaConstraints);
    }
    else {
        console.log("The other side is not ready");
    }
}

function receive(evt) {
    if(parseInt(evt.data).toString() != "NaN") {
        total = evt.data;
        if(total > 2) {
            document.writeln();
            alert("Room is full");
        }
    }
    else {
        console.log(evt.data);
        e = JSON.parse(evt.data);
        console.log(e);
        if (e.type == 'offer') {
            console.log("Received Offer from someone")
            if (!started) {
                create();
                started = true;
            }
            pc.setRemoteDescription(new RTCSessionDescription(e));
            console.log('Sending answer');
            pc.createAnswer(setAndSendDesc, function(e) { console.log("An error occured. Code: " + e.code) }, mediaConstraints);

        } else if (e.type == 'answer' && started) {
            console.log('Received answer');
            console.log('Setting remote session description' );
            pc.setRemoteDescription(new RTCSessionDescription(e));

        } else if (e.type == 'candidate' && started) {
            console.log('Received ICE candidate');
            var candidate = new RTCIceCandidate({candidate:e.candidate});
            console.log(candidate);
            pc.addIceCandidate(candidate);
        }
    }
}

function create() {
    config =  {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};
    pc = new RTCPeerConnection(config); // Fill ice servers in config and use it in place of null
    pc.ondatachannel = function(e) {
        rChannel = e.channel;
        rChannel.onmessage = function(msg) {
            var received = JSON.parse(msg.data);
            remoteX.innerHTML = received.x;
            remoteY.innerHTML = received.y;
            box.style.left = received.x;
            box.style.top = received.y;
        }
    }
    pc.onicecandidate = function(e) {
        if (e.candidate) {
            console.log('Sending ICE candidate');
            console.log(e.candidate);
            ws.send(JSON.stringify({type: "candidate",
                          candidate: e.candidate.candidate}));
        } else {
            console.log("Done sending");
        }
    };
}
