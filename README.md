# Showtime

[Edna Mall's](http://ednamall.info/show_time.html) multiplex unofficial API
![Showtime](http://i.imgur.com/xaVLPcC.png)

## Usage
```bash
$ http GET https://ednamall.herokuapp.com
```

```javascript
{
  "Friday": {
    "C1": [{
      time: {start: "hh:mm A", end: "hh:mm A"},
      movie: {3D: true | false, title: 'Reno 911', info: {movie info} | null} | null
    }],
    "C2": [...],
    "C3": [...]
  },
  "Saturday": ...
}
```

## heads-up
- the app is hosted on Heroku running on a single dyno, so expect delay when app is waking up
- the current GET request will not be changed, future breaking API changes will have thier own url, i.e. `https://ednamall.herokuapp.com/version`

as usual contributions are welcome
