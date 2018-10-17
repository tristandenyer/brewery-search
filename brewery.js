axios.defaults.baseURL = "https://api.openbrewerydb.org/breweries";

const input = document.getElementById("search-input");

input.addEventListener("keyup", function(e) {
  e.preventDefault();
  if (e.keyCode === 13) {
    document.getElementById("search-btn").click();
  }
});

var InstantSearch = {
  "highlight": function (container, highlightText) {
    var internalHighlighter = function (options) {
      var id = {
        container: "container",
        tokens: "tokens",
        all: "all",
        token: "token",
        className: "className",
        sensitiveSearch: "sensitiveSearch"
      },
      tokens = options[id.tokens],
      allClassName = options[id.all][id.className],
      allSensitiveSearch = options[id.all][id.sensitiveSearch];


      function checkAndReplace(node, tokenArr, classNameAll, sensitiveSearchAll) {
        var nodeVal = node.nodeValue, parentNode = node.parentNode,
        i, j, curToken, myToken, myClassName, mySensitiveSearch,
        finalClassName, finalSensitiveSearch,
        foundIndex, begin, matched, end,
        textNode, span, isFirst;

        for (i = 0, j = tokenArr.length; i < j; i++) {
          curToken = tokenArr[i];
          myToken = curToken[id.token];
          myClassName = curToken[id.className];
          mySensitiveSearch = curToken[id.sensitiveSearch];
          finalClassName = (classNameAll ? myClassName + " " + classNameAll : myClassName);

          finalSensitiveSearch = (typeof sensitiveSearchAll !== "undefined" ? sensitiveSearchAll : mySensitiveSearch);

          isFirst = true;
          while (true) {
            if (finalSensitiveSearch) {
              foundIndex = nodeVal.indexOf(myToken);
            }
            else {
              foundIndex = nodeVal.toLowerCase().indexOf(myToken.toLowerCase());
            }

            if (foundIndex < 0) {
              if (isFirst) break;
              if (nodeVal) {
                textNode = document.createTextNode(nodeVal);
                parentNode.insertBefore(textNode, node);
              } // End if (nodeVal)
              parentNode.removeChild(node);
              break;
            } // End if (foundIndex < 0)

            isFirst = false;

            begin = nodeVal.substring(0, foundIndex);
            matched = nodeVal.substr(foundIndex, myToken.length);

            if (begin)  {
              textNode = document.createTextNode(begin);
              parentNode.insertBefore(textNode, node);
            } // End if (begin)
            span = document.createElement("span");
            span.className += finalClassName;
            span.appendChild(document.createTextNode(matched));
            parentNode.insertBefore(span, node);
            nodeVal = nodeVal.substring(foundIndex + myToken.length);
          } // Whend

        } // Next i 
      }; // End Function checkAndReplace 

      function iterator(p) {
        if (p === null) return;

        var children = Array.prototype.slice.call(p.childNodes), i, cur;
        if (children.length) {
          for (i = 0; i < children.length; i++) {
            cur = children[i];
            if (cur.nodeType === 3) {
              checkAndReplace(cur, tokens, allClassName, allSensitiveSearch);
            }
            else if (cur.nodeType === 1) {
              iterator(cur);
            }
          }
        }
      }; // End Function iterator

      iterator(options[id.container]);
    } // End Function highlighter    

    internalHighlighter({
      container: container, 
      all: {
        className: "highlighter"
      },
      tokens: [
        {
          token: highlightText, 
          className: "highlight", 
          sensitiveSearch: false
        }
      ]
    }); // End Call internalHighlighter 
  } // End Function highlight
};

document.getElementById("search-btn").addEventListener("click", function() {
  let search = document.getElementById("search-input").value;

  if (search != "") {
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
        // default is A to Z
        if (selectedSort === "AtoZ") {
          response.data.sort(function(a, b) {
            return a.name > b.name;
          });
        } else if (selectedSort === "groupType") {
          response.data.sort(function(a, b) {
            return a.brewery_type > b.brewery_type;
          });
        } else {
          response.data.sort(function(a, b) {
            return b.name > a.name;
          });
        }

        // clear header and results
        document.getElementById("header").textContent = "";
        resultsArea.textContent = "";

        // Place the h2 at top of page, before Cards
        const h2 = document.createElement("h2");
        h2.setAttribute("class", "h3");
        h2.textContent = `We found ${
          response.data.length
        } breweries for "${search}"`;
        document.getElementById("header").appendChild(h2);

        // loop thru sorted response to create results
        for (i = 0; i < response.data.length; i++) {
          const div = document.createElement("div");
          div.setAttribute("class", "col-sm-6 col-lg-4 col-xl-3 mb-4");
          resultsArea.appendChild(div);

          const card = document.createElement("div");
          card.setAttribute("class", "card");
          div.appendChild(card);

          // set unique badge for each brewery_type
          const breweryType = document.createElement("div");
          if (`${response.data[i].brewery_type}`) {
            breweryType.setAttribute(
              "class",
              `card-topper card-img-top ${response.data[i].brewery_type}`
            );
          }
          
          breweryType.textContent = `${response.data[i].brewery_type}`;
          card.appendChild(breweryType);

          const cardBody = document.createElement("div");
          cardBody.setAttribute("class", "card-body");
          card.appendChild(cardBody);

          const breweryName = document.createElement("h2");
          breweryName.setAttribute("class", "h4");
          breweryName.textContent = `${response.data[i].name}`;
          cardBody.appendChild(breweryName);

          // some city and state data were coming back null
          if (
            `${response.data[i].city}` != "null" ||
            `${response.data[i].state}` != "null"
          ) {
            const breweryAddress = document.createElement("address");
            breweryAddress.innerHTML = `${response.data[i].street}<br/>${
              response.data[i].city
            }, ${response.data[i].state} ${response.data[i].postal_code}`;
            cardBody.appendChild(breweryAddress);
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

          const uri = `https://www.google.com/maps/search/?api=1&query=${
            response.data[i].name
          } ${response.data[i].state}`; /// Hmmm, the highlighter regex wraps keywords in this uri as well
          const encoded = encodeURI(uri);
          const mapLink = document.createElement("a");
          mapLink.setAttribute("href", encoded);
          mapLink.setAttribute("class", "card-link");
          mapLink.setAttribute("target", "_blank");
          mapLink.setAttribute("rel", "noopener noreferrer");
          mapLink.textContent = "Map";
          cardBody.appendChild(mapLink);
        }
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      })
      .then(function() {
        if(search){
          var results = document.getElementById("resultsArea");
          InstantSearch.highlight(results, search);                 
        }
      });
  } else {
    alert("Enter a search term!");
  }
});

// Highlighter toggle
const toggleState = document.getElementById("resultsArea");
const toggleClick = document.getElementById("highlightToggler");
let toggleHighlighter = toggleState.classList.toggle("highlighter-off");

(function() {
  if (sessionStorage.getItem("highlighting") === "is_off") {
    toggleClick.textContent = "Show keyword highlighting";
    toggleState.classList.add("highlighter-off");
  } else {
    sessionStorage.setItem("highlighting", "is_on");
    toggleClick.textContent = "Hide keyword highlighting";
    toggleState.classList.remove("highlighter-off");
  }
})();

function toggleTheme() {
  if (sessionStorage.getItem("highlighting") === "is_on") {
    sessionStorage.setItem("highlighting", "is_off");
    // turn off highlight
    toggleState.classList.toggle("highlighter-off");
    // switch button text to 'highlight'
    toggleClick.textContent = "Show keyword highlighting";
  } else {
    sessionStorage.setItem("highlighting", "is_on");
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
