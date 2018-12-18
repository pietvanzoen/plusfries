# plusfries [![Build Status](https://travis-ci.com/plusfries/plusfries.svg?branch=master)](https://travis-ci.com/plusfries/plusfries)

+:fries: as a service

## Usage

Add the following to a page where you would like to receive fries.

```html
<a id="plusfries" class="loading">🍟</a>
<script async src="//<your-plusfries-server>/plusfries.js"></script>
```

## API

### `POST /plus`

Body:

-   `location` URL - related url for upvote

### `GET /plus/:location`

Body:

-   `location` URL - related url for upvote

## Server Configuration

### Environment variables

* `PORT` - Server listening port.
* `DB_STORAGE` - Path to sqlite database file.
* `LOG_LEVEL` - Logging level.
* `THROTTLE_MODE` - Either `ip`, `xff`, or `username`. See [Restify Throggle Plugin Docs](http://restify.com/docs/plugins-api/#throttle) for more info. Default `ip`.
* `THROTTLE_RATE` - Number of `POST /plus` requests per second. Can be a fraction. Default `0.5`.
