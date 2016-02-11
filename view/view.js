	'use strict'
	const path 		= require("path")
	const fs 			= require('fs')
	const request = require('request')
	const yauzl 	= require("yauzl")
	const mkdirp 	= require("mkdirp")
	const $ 			= require('jquery')
	require('jquery-ui')

	let doc_frame = $('#doc_frame')[0]
	let tab_group = $('.tab-group')

	function switchFrame(url) {
		doc_frame.src = url;
	}

	$('#node_arrow').click(function(e) {
		$('#node_items').children().toggle();
	})

$('.icon-cancel').click(function(e) {
	$(this).parent().hide()
})

$('.node_doc').click(function(e) {
		doc_frame.src = $(this).attr('data')
})






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
