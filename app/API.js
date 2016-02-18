
// test a request to endpoint provided later
function testEndPoint(endPoint, locationToPlaceRetrievedFiles) {
	request(endPoint).pipe(fs.createWriteStream(locationToPlaceRetrievedFiles))
}

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
