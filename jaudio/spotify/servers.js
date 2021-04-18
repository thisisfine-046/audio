

const express = require("express")
const SpotifyWebApi = require("spotify-web-api-node")

const cors = require("cors")
const bodyParser = require("body-parser")

app.post("/login", (req, res) => {
  const code = req.body.code
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://127.0.0.1:8000/spotify/redirect",
    clientId: "c83a7a91bb4743aaaaae481d65b7debd",
    clientSecret: "00d515ff335748fb89db2ad7a7416e40",
    
  })

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      })
    })
    .catch(err => {
      res.sendStatus(400)
    })  
})
app.use(cors())
app.use(bodyParser.json())
app.listen(8000)