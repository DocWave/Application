	'use strict'
	const path 		= require("path")
	const fs 			= require('fs')
	const request = require('request')
	const yauzl 	= require("yauzl")
	const mkdirp 	= require("mkdirp")
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


// $('.icon-cancel').click(function(e) {
// 	$(this).parent().remove()
// 	doc_frame.src = $(tab_group).last().attr('data')
// })

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
