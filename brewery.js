axios.defaults.baseURL = "https://api.openbrewerydb.org/breweries";

document.getElementById("search-btn").addEventListener("click", function() {
  const search = document.getElementById("search-input").value;

  // Make a request for breweries with search term
  axios
    .get(`/search?query=${search}`)
    .then(function(response) {
      // which sort order do they want?
      const sortResults = document.getElementsByName("sort-order");
      let selectedSort;

      for (var i = 0; i < sortResults.length; i++) {
        if (sortResults[i].checked) selectedSort = sortResults[i].value;
      }
      // sort it
      if (selectedSort === "AtoZ") {
        response.data.sort(function(a, b) {
          return a.name > b.name;
        });
      } else {
        response.data.sort(function(a, b) {
          return b.name > a.name;
        });
      }

      // clear results
      document.getElementById("header").textContent = "";
      resultsArea.textContent = "";

      // Place the h1 at top of page, before Cards
      const h1 = document.createElement("h1");
      h1.setAttribute("class", "h3");
      h1.textContent = `We found ${
        response.data.length
      } breweries for "${search}"`;
      document.getElementById("header").appendChild(h1);

      // loop thru sorted response to create results
      for (i = 0; i < response.data.length; i++) {
        const card = document.createElement("div");
        card.setAttribute("class", "card col-sm-4");
        resultsArea.appendChild(card);

        const cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body");
        card.appendChild(cardBody);

        // set unique badge for each brewery_type
        const breweryType = document.createElement("span");
        if (`${response.data[i].brewery_type}` == "micro") {
          breweryType.setAttribute(
            "class",
            `badge badge-primary ${response.data[i].brewery_type}`
          );
        } else if (`${response.data[i].brewery_type}` == "regional") {
          breweryType.setAttribute(
            "class",
            `badge badge-success ${response.data[i].brewery_type}`
          );
        } else if (`${response.data[i].brewery_type}` == "regional") {
          breweryType.setAttribute(
            "class",
            `badge badge-danger ${response.data[i].brewery_type}`
          );
        } else if (`${response.data[i].brewery_type}` == "brewpub") {
          breweryType.setAttribute(
            "class",
            `badge badge-warning ${response.data[i].brewery_type}`
          );
        } else if (`${response.data[i].brewery_type}` == "large") {
          breweryType.setAttribute(
            "class",
            `badge badge-info ${response.data[i].brewery_type}`
          );
        } else if (`${response.data[i].brewery_type}` == "planning") {
          breweryType.setAttribute(
            "class",
            `badge badge-secondary ${response.data[i].brewery_type}`
          );
        } else {
          breweryType.setAttribute(
            "class",
            `badge badge-secondary ${response.data[i].brewery_type}`
          );
        }
        breweryType.textContent = `${response.data[i].brewery_type}`;
        cardBody.appendChild(breweryType);

        const breweryName = document.createElement("h2");
        breweryName.setAttribute("class", "h4");
        breweryName.textContent = `${response.data[i].name}`;
        cardBody.appendChild(breweryName);

        // some city and state data were coming back null
        if (
          `${response.data[i].city}` != "null" ||
          `${response.data[i].state}` != "null"
        ) {
          const breweryLoc = document.createElement("p");
          breweryLoc.textContent = `${response.data[i].city}, ${
            response.data[i].state
          }`;
          cardBody.appendChild(breweryLoc);
        }

        // not all entries have website URLs
        if (`${response.data[i].website_url}` != null) {
          const href = document.createElement("a");
          href.setAttribute("href", `${response.data[i].website_url}`);
          href.setAttribute("class", "card-link");
          href.setAttribute("target", "_blank");
          href.setAttribute("rel", "noopener noreferrer");
          href.textContent = "Website";
          cardBody.appendChild(href);
        }
      }
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .then(function() {
      var searchpara = document.getElementById("resultsArea").innerHTML;
      searchpara = searchpara.toString();

      if (search) {
        var pattern = new RegExp("(" + search + ")", "gi");
        var new_search = searchpara.replace(
          pattern,
          "<span class='highlight'>$1</span>"
        );
        document.getElementById("resultsArea").innerHTML = new_search;
      }
    });
});

// Highlighter toggle
const toggleState = document.getElementById("resultsArea");
const toggleClick = document.getElementById("highlightToggler");

function toggleTheme() {
  if (toggleState.dataset.highlight == "true") {
    toggleState.dataset.highlight = "false";
    // turn off highlight
    toggleState.classList.toggle("highlighter-off");
    // switch button text to 'highlight'
    toggleClick.textContent = "Show keyword highlighting";
  } else {
    toggleState.dataset.highlight = "true";
    // remove off theme
    toggleState.classList.toggle("highlighter-off");
    // switch button text to 'hide'
    toggleClick.textContent = "Hide keyword highlighting";
  }
}

if (document.getElementById("resultsArea")) {
  // add event listener on #highlightToggler
  toggleClick.addEventListener("click", toggleTheme);
}
