	'use strict'
	const path 		= require("path")
	const fs 			= require('fs')
	const request = require('request')
	const yauzl 	= require("yauzl")
	const mkdirp 	= require("mkdirp")
	const parseDB   = require('./components/parseDB')
	const $ 			= require('jquery')
	require('jquery-ui')

	//document's iframe
	let doc_frame = $('#doc_frame')[0]
	// parent element storing tabs
	let tab_group = $('.tab-group')

	// helper function to switch iframe url
	function switchFrame(url) {
		doc_frame.src = url;
	}


// new tab constructor, takes nameOfTab & link.
// sidebar click => new tab => updated iframe view
	let newTab = (nameOfTab, link) => $(`<div class="tab-item" data='${link}'><span class="icon icon-cancel icon-close-tab"></span> ${nameOfTab}</div>`)


$('#node_items').children().hide();

// toggle the arrow for sidebar parent, rotates arrow
	$('#node_arrow').click(function(e) {
		$('#node_items').children().toggle();
		$(this).children().first().toggleClass("icon icon-right-dir icon icon-down-dir");
	})

<<<<<<< HEAD
$('.icon-cancel').click(function(e) {
	$(this).parent().hide()
})

$('.node_doc').click(function(e) {
		doc_frame.src = $(this).attr('data')
})

$(document).ready(function(){
	// var objects = parseDB.parse();
	// $("#node_items").empty()
	var $newEl = $('<li class="node_doc" data="" style="margin-left: 25px"></li>')
	// console.log(obj.NAME)
	$("#node_items").append($newEl.text("BOOOOS").attr('data', '../docStorage/node.docs/documents/fs.html'))
	$("#node_items").append('<li class="node_doc" data="../docStorage/node.docs/documents/fs.html" style="margin-left: 25px">File System</li>')
	// $('#node_items')
	// for(var obj of objects){
	// 	var $newEl = $('<li class="node_doc" data="" style="margin-left: 25px"></li>')
	// 	// console.log(obj.NAME)
	// 	$("#node_items").append($newEl.text(obj.NAME).attr('data', '../docStorage/node.docs/documents/'+obj.LINK))
	// }
	// console.log(objects)
})
=======

// $('.icon-cancel').click(function(e) {
// 	$(this).parent().remove()
// 	doc_frame.src = $(tab_group).last().attr('data')
// })
>>>>>>> f22f0117401566fc9ce4ee06fbe9b99d32d4bc35

$('.node_doc').click(function(e) {
		//when you click on a sidebar item, append a new tab and set the iframe to the source
		$(tab_group).append(newTab($(this).text(), $(this).attr('data')))
		switchFrame($(this).attr('data'))

		// make sure new tabs are hide-able
		$('.icon-cancel').click(function(e) {
			$(this).parent().remove()
			switchFrame($('.tab-item').last().attr('data'))
		})
})

// *****************************************************************************
// *****************************************************************************
// *****************************************************************************

	// BELOW USED FOR API TESTING

	// const testEndPoint = 'http://' + '192.168.1.18' + ':3000/node/'
	// let requestButton = $('#request')[0]
	// let unzipButton = $('#unzip')[0]
	// document.getElementById('request').addEventListener('click', (event) => {
	// 	console.log('start request')
	// 	request(testEndPoint).pipe(fs.createWriteStream('docStorage/node.zip'))
	// })
	// document.getElementById('unzip').addEventListener('click', (event) => {
	// 	console.log('starting unzipping')
	// 	let file = 'docStorage/node.zip'
	// 	let location = 'docStorage/'
	// 	//unzip the folder and place it somewhere
	// 	unZipThisFile(file, location)
	// })

	// function to unzip and place file somewhere
	function unZipThisFile(fileToUnzip, locationToPlaceUnZippedFiles) {
		yauzl.open(fileToUnzip, {
			lazyEntries: true
		}, function(err, zipfile) {
			if (err) throw err
			zipfile.readEntry()
			zipfile.on("entry", function(entry) {
				if (/\/$/.test(locationToPlaceUnZippedFiles + entry.fileName)) {
					// directory file names end with '/'
					mkdirp(locationToPlaceUnZippedFiles + entry.fileName, function(err) {
						if (err) throw err
						zipfile.readEntry()
					})
				} else {
					// file entry
					zipfile.openReadStream(entry, function(err, readStream) {
						if (err) throw err
							// ensure parent directory exists
						mkdirp(locationToPlaceUnZippedFiles + path.dirname(entry.fileName), function(err) {
							if (err) throw err
							readStream.pipe(fs.createWriteStream(locationToPlaceUnZippedFiles + entry.fileName))
							readStream.on("end", function() {
								zipfile.readEntry()
							})
						})
					})
				}
			})
		})
	}
