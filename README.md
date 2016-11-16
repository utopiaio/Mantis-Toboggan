# Showtime 3.0

[Edna Mall's](http://ednamall.co/) multiplex unofficial API and iOS App

![Showtime 3.0](http://i.imgur.com/8dXGA1q.jpg)

## Features
- Works offline
- Rotten Tomatoes rating
- Movie Information from OMDB

## API Usage
```bash
$ http GET https://ednamall.herokuapp.com/api # returns showtimes
$ http GET https://ednamall.herokuapp.com/poster/?url=<poster_url> # returns base64 encoding of image
```
🔔 The API auto-deletes information on a scraped data after 30 days.

**The app is hosted on Heroku running on a single dyno, so expect delay when app is waking up.**

🌟🌟🌟 Contributions are welcome. 🌟🌟🌟
