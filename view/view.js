	'use strict'
	const path = require("path")
	const fs = require('fs')
	const request = require('request')
	const yauzl = require("yauzl")
	const mkdirp = require("mkdirp")
	const parseDB = require('./components/parseDB')
	const $ = require('jquery')
	require('jquery-ui')

	// *****************************
	//		MAIN EXECUTION CONTEXT
	// *****************************

	var sqlData;
	// DYNAMIC POPULATION OF LEFT COLUMN DOCUMENTATION ELEMENTS
	$(document).ready(function() {

			//Make sure SQL Data is in order
			loadSQLdata()
			var sections = sqlData.sections;
			var dataItems = sqlData.result;

			//Create sections
			sections.forEach((name) => {
				var $newUl = newUlSection(capitalizeFirstLetter(name));
				$('#node_items').append($newUl);
				$newUl.click(function() {
						// $(this).parent().toggle();
						$newUl.children().first().toggleClass("icon icon-right-dir icon icon-down-dir");
						// debugger;
						$newUl.find("li").toggle()
					})
					// $('#node_items').toggle();
			})

			//Populate each li under the correct tree item
			dataItems.forEach((item) => {
				var $newLi = newLi(item.NAME, "node", "../docStorage/node.docs/documents/" + item.LINK);
				$(`#${item.TYPE}_item`).append($newLi);
			})

			// toggle the arrow for sidebar parent, rotates arrow
			$('#node_arrow').click(function(e) {
				$('#node_items').children().toggle()
				$(this).children().first().toggleClass("icon icon-right-dir icon icon-down-dir");
			})

			$('.node_doc').click(function(e) {
				console.log('you clicked on node_doc');
				//when you click on a sidebar item, append a new tab and set the iframe to the source
				$(tab_group).append(newTab($(this).text(), $(this).attr('data')))
				switchFrame($(this).attr('data'))
				// make sure new tabs are hide-able
				$('.icon-cancel').click(function(e) {
					$(this).parent().remove()
					let nextTabUrl = $('.tab-item').last().attr('data')
					if (nextTabUrl) {
						switchFrame(nextTabUrl)
					} else {
						switchFrame('welcome.html')
					}
				})
			})

			//hide all bottom child items
			$('.node_doc').hide()
			// hide all sections
			$('#node_items').children().hide()
		}) /// END OF DOCUMENT.READY FN


		// *************************************************************
		//		HELPER FUNCTIONS FOR DYNAMICALLY POPULATING LEFT COLUMN
		// *************************************************************

		//document's iframe
		let doc_frame = $('#doc_frame')[0]
			//parent element storing tabs
		let tab_group = $('.tab-group')

		//switch iframe url
		function switchFrame(url) {
			doc_frame.src = url;
		}

		function newUlSection(docName) {
			return $(`<span id="${docName}_arrow" class="nav-group-item active">
					<span class="icon icon-right-dir" icon></span>${docName}</span>
					<ul id="${docName.toLowerCase()}_item"</ul>`);
				}

			// new tab constructor, takes nameOfTab & link.
			// sidebar click => new tab => updated iframe view
			function newTab(nameOfTab, link) {
				return $(`<div class="tab-item" data='${link}'><span class="icon icon-cancel icon-close-tab"></span> ${nameOfTab}</div>`)
			}

		//Uppercase first character of string
		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		//Cache file, check if its there so we dont parse the db each time
		function loadSQLdata() {
			try {
				sqlData = JSON.parse(fs.readFileSync('docStorage/node.docs/index.json', 'utf-8'))
			} catch (err) {
				//If the file isn't found, write to a json.index file in that directory, to quickly Populate
				console.log("file doesnt exist", err)
					//get db stuff -> slow, web workers or find faster solution
				sqlData = parseDB.parse();
				fs.writeFile('docStorage/node.docs/index.json', JSON.stringify(sqlData), (err) => {
					if (err) throw err;
					console.log("Saved")
				})
			}
		}

		function newLi(nameOfLi, docName, link) {
			return $(`<li class="${docName}_doc" data="${link}" style="margin-left: 10px; display: list-item;"><span class="icon icon-dot"></span> ${nameOfLi}</li>`);
		}



	// *****************************
	// BELOW USED FOR API TESTING
	// *****************************


	const testEndPoint = 'http://' + '192.168.1.18' + ':3000/node/'
	let requestButton = $('#request')[0]
	let unzipButton = $('#unzip')[0]
	document.getElementById('request').addEventListener('click', (event) => {
		console.log('start request')
		request(testEndPoint).pipe(fs.createWriteStream('docStorage/node.zip'))
	})
	document.getElementById('unzip').addEventListener('click', (event) => {
		console.log('starting unzipping')
		let file = 'docStorage/node.zip'
		let location = 'docStorage/'
			//unzip the folder and place it somewhere
		unZipThisFile(file, location)
	})

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
