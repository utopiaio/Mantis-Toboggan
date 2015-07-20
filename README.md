# Showtime

[Edna Mall's](http://ednamall.info/show_time.html) multiplex unofficial API

![Showtime](http://i.imgur.com/xaVLPcC.png)

# Usage
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
