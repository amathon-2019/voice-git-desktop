import React, { Component, Fragment } from 'react';
import { render } from 'react-dom';
import App from "./App.js";
import showHistory from "./Layout/showHistory.js";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import "react-tabs/style/react-tabs.css";

URL = window.URL || window.webkitURL;

var gumStream; 
var recorder;
var input;
var encodingType; 
var encodeAfterRecord = true;
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; 

var encodingTypeSelect = document.getElementById("encodingTypeSelect");
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");

window.onload=function(){
	recordButton.addEventListener("click", startRecording);
	stopButton.addEventListener("click", stopRecording);
}

function startRecording() {
	console.log("startRecording() called");

    var constraints = { audio: true, video:false }
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		__log("getUserMedia() success, stream created, initializing WebAudioRecorder...");

		audioContext = new AudioContext();
		__log("auCon Done");
	
		//document.getElementById("formats").innerHTML="Format: 2 channel "+encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value+" @ "+audioContext.sampleRate/1000+"kHz"
		__log("Formats Done");
	
		gumStream = stream;
		
		input = audioContext.createMediaStreamSource(stream);
		
		encodingType = encodingTypeSelect.options[encodingTypeSelect.selectedIndex].value;
		
		encodingTypeSelect.disabled = true;

		recorder = new WebAudioRecorder(input, {
		  workerDir: "lib", 
		  encoding: encodingType,
		  numChannels:2, 
		  onEncoderLoading: function(recorder, encoding) {
		  
				__log("Loading "+encoding+" encoder...");
				__log(encoding+" encoder loaded...");
		  },
		  onEncoderLoaded: function(recorder, encoding) {
		    __log(encoding+" encoder loaded!");
		  }
		});

		recorder.onComplete = function(recorder, blob){ 
			__log("Encoding complete!");
			createDownloadLink(blob,recorder.encoding);
			encodingTypeSelect.disabled = false;
		}

		recorder.setOptions({
		  timeLimit:120,
		  encodeAfterRecord:encodeAfterRecord,
	      ogg: {quality: 0.5},
	      mp3: {bitRate: 160}
	    });

	
		recorder.startRecording()
		 __log("Recording started");

	}).catch(function(err) {
	  	//enable the record button if getUSerMedia() fails
    	recordButton.disabled = false;
    	stopButton.disabled = true;

	});

	//disable the record button
    recordButton.disabled = true;
    stopButton.disabled = false;
}

function stopRecording() {
	console.log("stopRecording() called");
	
	//stop microphone access
	gumStream.getAudioTracks()[0].stop();


	stopButton.disabled = true;
	recordButton.disabled = false;
	

	recorder.finishRecording();

	__log('Recording stopped');
}

function createDownloadLink(blob,encoding) {
	
	var url = URL.createObjectURL(blob);
	var au = document.createElement('audio');
	var li = document.createElement('li');
	var link = document.createElement('a');

	au.controls = true;
	au.src = url;

	link.href = url;
	link.download = new Date().toISOString() + '.'+encoding;
	link.innerHTML = link.download;

	li.appendChild(au);
	li.appendChild(link);

	recordingsList.appendChild(li);
}

function __log(e, data) {
	log.innerHTML += "\n" + e + " " + (data || '');
}

const rootElement = document.getElementById("root");
//
