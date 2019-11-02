# Brewery Search

A brewery search project using the [Open Brewery DB](https://www.openbrewerydb.org/ "Open Brewery DB"), Axios promise based HTTP client and Bootstrap.

A work in progress demo can be viewed here: https://tristandenyer.github.io/brewery-search/

You can also import a version of this as a collection in Postman, and view the response using the Visualizer feature.
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/04c6fb15b2c0dc41c478)

## An Open Source project for first-timers and non-techincal
This is now an active open source project with the mission to be an approachable project for first-timers, designers, and non-technical contributors. **Your time and feedback on this is very much warranted.** I want this project to be an open collaboration, and approachable so people new to Git, GitHub, Git flow, PRs and whathaveyou are willing to come work on it and get their feet wet. THAT approachability is more important than anything else with the project.

The other reason is to help me get my feet wet on being an Open Source project owner.

All feedback is welcome.

## Goals of this project
To keep our little project from getting too bloated and heading into the weeds, here are some acceptance criteria:

- we are using the [Open Brewery DB](https://www.openbrewerydb.org/ "Open Brewery DB"), please read the very short docs to understand the capabilites and limitations of the data we get from their endpoints.
- I want to be able to search for breweries by keyword and see a list
- I want to be able to discover breweries
- I would like the search results to be clear, easy to scan, and allow for me to click thru to their website and or a map for directions.

Suggestions for features and enhancements that support those basic user needs are welcome--just make an issue in the Issues tab above and explain your idea and how it helps.

## Important

Before you make a pull request, please comment on the issue saying that you would like to work on it. That way, we can avoid duplicate PRs and a first-timer can have enough time to work on this. 

FYI: there is a great write-up on [how to work on this type of project and make your first PR here](https://gist.github.com/Chaser324/ce0505fbed06b947d962 "how to work on this type of project and make your first PR here.")

**Designers are welcome! A PR doesn't necessarily _have_ to be code.** You can use the comments section to suggest design changes. If someone else would like to work on it, they may take your designs and implement them. Collaboration is awesome!

## Features

- search for terms to get back a list of cards showing breweries in the U.S.
- sort results A-Z, Z-A, or group by brewery type
- color coded brewery types
- highlight text you searched for in results
- address and link to a map
- storing keyword highlighter state in session storage

### Future features, maybe

- filter by brewery type
- filter by state (though you can just search for state name)
- map with pins showing breweries
- a list of my last 3 searches that I may click on to re-run that search (sessionStorage)
- a list of 3 suggested searches that I may click on to quickly run that search
- contributors section, because I am stoked you all want to help work on this!
