# Yellow Page Email Scraper
### About
Scrap Yellow Pages for emails and return them in a list -
![Screen shot](http://i.imgur.com/h1yCp0p.png)

### CasperJS
First use [npm](https://nodejs.org/en/download/) to install [casperjs](http://casperjs.org/) -
```sh
$ npm install casperjs
OR
$ npm install -g casperjs
```

### Customize
Update the host{} in scraper.js -
```js
var host = {
    // main connect
    url: 'http://yellowpages.com',
    // areas to search
    area: [
        '/michigan',
        '/california',
        '/washington',
        '/florida',
    ],
    // business keyword
    keyword: '/restaurant',
    // creates complete link
    search: function () {
        return host.url + host.area[build.currentLocation] + host.keyword;
    }
};
```

### Running
Redirect your terminal to the scraper directory then -
```sh
$ casperjs scraper.js
```