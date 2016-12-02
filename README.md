# Showtime 3.0

[Edna Mall's](http://ednamall.co/) multiplex unofficial API and iOS App. Works Offline, Rotten Tomatoes rating, Movie Plot & Trailer video. You can app demo [here 🎥](https://vimeo.com/194029357)

## Stack
Showtime 3.0 is built using [Express](http://expressjs.com/), [PostgreSQL](http://postgresql.org/), [React](https://github.com/facebook/react), [Redux](http://github.com/reactjs/redux), [React Router](https://github.com/ReactTraining/react-router), [Anime](https://github.com/juliangarnier/anime), [Cordova](https://cordova.apache.org) and [Ionic CLI](https://github.com/driftyco/ionic-cli).
The _main idea_ was to mimic Twitter's iOS app (UI/UX) using HTML5 + maintaining that sweet 60FPS when animating.

## API Usage
**The app is hosted on Heroku running on a single dyno, so expect delay when app is waking up.**

```bash
$ http GET https://ednamall.herokuapp.com/api # returns showtimes
$ http GET https://ednamall.herokuapp.com/poster/?url=<poster_url> # returns base64 encoding of image
```

🔔 The API auto-deletes information on a scraped data after 30 days.

![Showtime 3.0](http://i.imgur.com/RV3tHtw.jpg)

🌟🌟🌟 Contributions are welcome. 🌟🌟🌟
