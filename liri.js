require("dotenv").config();
//require('./keys.js');
var Spotify = require('node-spotify-api');
var request = require('request');
var moment = require('moment');
var fs = require("fs");

var spotify = new Spotify({
    id: '146bdd87f5604f86ae86228246072a1d',
    secret: '5e1633fb0ca8445c80d00e685ae7bdce'
});

doStuff(process.argv[2], process.argv[3]);
function doStuff(sWhatToDo, sToWhat) {
    switch (sWhatToDo) {
        case 'spotify-this-song':
        case 'sts':
            if (sToWhat === "") {
                sToWhat = 'The Sign';
            }
            spotify.search({
                type: 'track',
                query: sToWhat
            }, function (err, data) {
                if (err) {
                    return writeStuff('Error occurred: ' + err);
                }
//                console.log ('Data: ', data.tracks.items[0]);
                writeStuff ("By: " + data.tracks.items[0].album.artists[0].name);

                writeStuff ("Song: " + sToWhat);
                writeStuff ("Play: " + data.tracks.items[0].external_urls.spotify);
                writeStuff ("Album: " + data.tracks.items[0].album.name); // album name           writeStuff(data.tracks.items[0].album.artists[0].name);        // gives artist            writeStuff(data.tracks.items[0].album.artists[0].name);        // gives artist

            });
            break;
        case 'concert-this':
        case 'ct':
            var queryURL = "https://rest.bandsintown.com/artists/" + sToWhat + "/events?app_id=codingbootcamp";
            request.get(queryURL, {
                json: true
            }, function (err, res, body) {
                if (!err && res.statusCode === 200) {
                    writeStuff (body[0].venue.name);
                    writeStuff (body[0].venue.city + ", " + body[0].venue.country);
                    writeStuff (moment(body[0].datetime).format('MM/DD/YYYY'));
                }
            });
            break;
        case 'movie-this':
        case 'mt':
            if (sToWhat === "") {
                sToWhat = 'Mr. Nobody';
            }
            sToWhat = sToWhat.replace(/ /g, '+');
            var queryURL = "http://www.omdbapi.com/?apikey=trilogy&t='" + sToWhat + "'";
            //        console.log (queryURL);
            request.get(queryURL, {
                json: true
            }, function (err, res, body) {
                if (!err && res.statusCode === 200) {
                    writeStuff(sToWhat.replace(/\+/g, ' '));
                    //                console.log (body.Released);
                    let asDate = body.Released.split(' ');
                    writeStuff('Year released: ' + asDate[2]);
                    //                console.log ('Year released: ' + moment(body.Released).format("YYYY"));
                    writeStuff('Rating: ' + body.Rated);
                    for (let i = 0; i < body.Ratings.length; i++) {
                        if (body.Ratings[i].Source === 'Rotten Tomatoes') {
                            writeStuff ('Rotten Tomatoes: ' + body.Ratings[i].Value);
                            break;
                        }
                    }
                    writeStuff ('Country produced: ' + body.Country);
                    writeStuff ('Language: ' + body.Language);
                    writeStuff ('Plot: ' + body.Plot);
                    writeStuff ('Actors: ' + body.Actors);
                }
                if (err) {
                    writeStuff ("OMDb error: " + err);
                }
            });
            break;
        case 'do-what-it-says':
        case 'dw':
            fs.readFile("./random.txt", "utf8", function (error, sText) {
                let asTexts = sText.split(',');
                asTexts[1].trim();
                doStuff (asTexts[0], asTexts[1]);
            });
            break;
    }
}

function writeStuff (sText) {
    console.log (sText);
    fs.appendFileSync("./log.txt", sText + '\n', function(err) {
        // have to use Sync to get the lines in order
        if (err) {
          return writeStuff(err);
        }
      });      
}