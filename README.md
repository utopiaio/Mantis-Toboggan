![Mantis Toboggan](https://raw.githubusercontent.com/moe-szyslak/Mantis-Toboggan/master/Mantis-Toboggan.png "Mantis Toboggan")

# Mantis Toboggan, MD
Scraper for Edna Mall's showtime

## API Usage
**The app is hosted on Heroku running on a single dyno, so expect delay when app is waking up.**

```bash
$ http GET https://ednamall.herokuapp.com/api # returns showtimes
$ http GET https://ednamall.herokuapp.com/poster/?url=<poster_url> # returns base64 encoding of image
```

⚠️ The API auto-deletes information on a scraped data after 30 days

Contributions are welcome
