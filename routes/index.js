var express = require('express');
var router = express.Router();

const SpotifyWebApi = require('spotify-web-api-node');

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));


router.get('/artist-search', (req,res) => {
  console.log(req.query.name)
  spotifyApi
  .searchArtists(req.query.name)
  .then(data => {
    let artistData = data.body.artists.items;
    //console.log('The received data from the API: ', data.body.artists.items);
    res.render('artist-search-results', {artistData})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

router.get('/albums/:artistId', (req, res, next) => {
  //console.log(req.params);
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then((data) => {
    let albumData = data.body.items;
    //console.log(albumData[0].artists);
    res.render('albums', {albumData})
  })
  .catch(err => console.log('Error listing the albums', err))
});

router.get('/tracks/:albumId', (req,res) => {
  console.log();
  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then((data) => {
    let trackData = data.body.items;
    //console.log(data.body.items);
    res.render('tracks', {trackData})
  })
  .catch(err => console.log("Error listing the tracks", err));
})


module.exports = router;
