# Article-Scraper

NPR Article-Scraper is a web app that lets users view and leave comments on the latest NPR news articles.

The application does the following:

Whenever a user visits, it scrapes stories from NPR and displays them for the user. Each scraped article is saved to Mongo database. When scraping the app displays the following information of each article:

- Headline - the title of the article
- Summary - a short summary of the article
- URL - the url to the original article

Users are also able to leave comments on the articles displayed and revisit them later. The comments are also saved to the database with their associated articles. Users are able to delete comments left on articles.

![](articleScraper.PNG)

**Link to the Application, Hosted on Heroku pages**
https://agile-earth-53703.herokuapp.com/

**Credits**
Developer and app creator: Josh Cosson
