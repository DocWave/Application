var scraper = require('website-scraper');
var fs = require('fs');
var cheerio = require('cheerio');
var archiver = require('archiver');

//Specify type of archive - zip or tar
var archive = archiver('zip');
//Constants to be changed or added later with inputs to program
const   URL_TO_SCRAPE = 'http://nodejs.org/api/',
        CSS_DIR = 'assets',
        JS_DIR = 'js',
        SCRAPE_DIR = 'node/';

//Create output file stream from SCRAPE_DIR
var output = fs.createWriteStream(SCRAPE_DIR.slice(0,-1)+'.zip');

/*
* Initialize scraper and provide URL, directory to store files, subdirectories
* FOR files, recurse 1 level deep, and then edit files
*/
scraper.scrape({
  urls: [URL_TO_SCRAPE],
  directory: SCRAPE_DIR,
  subdirectories: [
		{directory: 'img', extensions: ['.jpg', '.png', '.svg']},
		{directory: JS_DIR, extensions: ['.js']},
		{directory: CSS_DIR, extensions: ['.css']}
	],
  recursive: true,
  maxDepth: 1
}).then((data)=>{
    getFiles();
}).catch(console.log);

//Event listener for end of zipping function - delete folder
output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
    deleteFolderRecursive(SCRAPE_DIR);
});

archive.on('error', function(err){
    throw err;
});

//get list of files to change the hrefs for css and js files to exclude beggining / if they have it
function getFiles() {
    var list;
    //Get list of files in directory
    fs.readdir('node', (err, file) => {
        list = file;
        list.forEach((name) => {
            //Add directory name to file name for FS
            name = 'node/'.concat(name);
            //only edit html files
            if(name.match(/\.html$/)){
                //pass file names off to be read and rewritten
                editFile(name);
            }
        });
        //Time to zip the file
        //Pipe zip to the output file
        archive.pipe(output);
        //specify what to zip up (in this case the directory itself) and append them to the zip
        //Make the directory the zip file extracts to to be based on the SCRAPE_DIR
        archive.bulk([
            { expand: true, cwd: SCRAPE_DIR, src: ['**'], dest: SCRAPE_DIR.slice(0,-1)+'.docs'}
        ]);
        //Finalize archive and prevent further appends
        archive.finalize();
    });
}

function editFile(file) {
    fs.readFile(file, 'utf-8', (err, data) => {
        //Remove front slash on src and href of js and css file locations
        var newData = data.replace(/href=\"\/(?!\/)/gi, 'href="').
            replace(/src=\"\/(?!\/)/gi, 'src="');
        //Call function to remove extraneous stuff
        newData = nodeRewrite(newData);
        //Rewrite file
        fs.writeFile(file, newData, 'utf-8', (err)=>{
            if(err){
                 console.log(err);
            }
        });
    });

}

//Specific nodejs.com documentation removal of ToC and sidebar
function nodeRewrite(html) {
    var $ = cheerio.load(html);
    $('#column2').remove();
    $('#toc').remove();
    $('header').remove();
    html = $.html();
    return html;
}

//Recursively delete folders
function deleteFolderRecursive(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}
