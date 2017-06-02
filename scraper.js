// casperJS
var casper = require('casper').create();

// build variables
var build = {
    // all emails
    emails: [],
    // used for building
    currentPage: 1,
    currentLocation: 0,
    proceed: true,
    links: [],
    email: undefined
};

// areas and keyword
var host = {
    // main connect
    url: 'http://yellowpages.com',
    // areas to search
    area: [
        '/michigan'
    ],
    // business keyword
    keyword: '/fishing',
    // creates complete link
    search: function () {
        return host.url + host.area[build.currentLocation] + host.keyword;
    }
};

// data methods
var get = {
    // gets links to page of businesses
    links: function () {
        // search for business links
        var query = document.querySelectorAll('div.info h2.n a.business-name');
        // return array of hrefs
        return Array.prototype.map.call(query, function (e) {
            return e.getAttribute('href');
        });
    },
    // gets emails from a current page
    email: function () {
        // select email element
        var results = document.getElementsByClassName('email-business')[0];
        // save mailto link
        results = results.getAttribute('href');
        // remove mailto
        results = results.slice(7);
        // return email
        return results;
    }
};

// main scraper
function scrape(page) {
    // connects to page with casper
    casper.start(page, function () {
        // prints page being printed
        this.echo('\nSCAPING: ' + page);
        // gets all the links on the page
        build.links = this.evaluate(get.links);
        // loop over all those links
        for (var i in build.links) {
            // connects to each links
            casper.thenOpen(host.url + build.links[i], function () {
                // gets email from link
                build.email = this.evaluate(get.email);
                // if there is an email
                if (build.email !== null) {
                    // get the title of the page
                    var title = this.getTitle();
                    // print business and email
                    this.echo('\nBUSINESS: ' + title.substr(0, title.length - 9));
                    this.echo('EMAIL: ' + build.email);
                    // push email to array
                    build.emails.push(build.email);
                }
            });
        }
        // opens main page again
        casper.thenOpen(page, function () {
            // dumps emails to the screen
            this.echo('\nSCAPED: ' + build.emails.length);
            this.echo('DUMP: ' + build.emails.join(', '));
            // if a next btn exists
            if (this.exists('a.next')) {
                // print message
                this.echo('\nCONTINUE: Next button found');
                // add one to the current page
                build.currentPage = build.currentPage + 1;
                // scape the next page
                scrape(host.search() + '?page=' + build.currentPage);
            } else {
                // if no next btn print message
                this.echo('COMPLETE: Area complete, no next button');
                // if there's more areas go to the next one
                if (host.area.length > 1 && build.currentLocation <= host.area.length) {
                    // print message
                    this.echo('LOADING: Moving onto next location');
                    // go to next location
                    build.currentLocation = build.currentLocation + 1;
                    // scrape that location page
                    scrape(host.search());
                } else {
                    // else complete process
                    this.echo('COMPLETE: All areas completed');
                    // then kill app
                    this.exit();
                }

            }
        });
    });
}

// init run
scrape(host.search());

// final exit
casper.run(function () {
    // shows all emails scraped
    this.echo('\nSCAPED: ' + emails.length);
    this.echo('DUMP: ' + emails.join(', ')).exit();
    this.exit();
});