# plusfries [![Build Status](https://travis-ci.com/plusfries/plusfries.svg?branch=master)](https://travis-ci.com/plusfries/plusfries)

+:fries: as a service

## Usage

Add the following to a page where you would like to receive fries.

```html
<a id="plusfries" class="loading">🍟</a>
<script src="//<your-plusfries-server>/plusfries.js"></script>
```

## API

### `POST /plus`

Body:

-   `location` URL - related url for upvote

### `GET /plus/:location`

Body:

-   `location` URL - related url for upvote
