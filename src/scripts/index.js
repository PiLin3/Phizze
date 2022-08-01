import '../styles/normalize.css';
import '../styles/index.css';
import searchData from "../pages/search-results/searchData.json";

const dropdownList = document.querySelectorAll(".dropdown-list");
const footerNav = document.getElementById("footer-nav");
const panels = document.getElementsByClassName("panel");
const panelsContainer = document.getElementById("panels-container");
let panelIndex;

// Search bar
// takes two arguments, the search field element and an array of suggestion values
function autocomplete (searchInput, suggestions) {
  const searchBarContainer = searchInput.parentNode;
  const searchBtn = searchBarContainer.querySelector(".search-btn");
  let activeIndex;
  let resultsData = [];
  searchInput.addEventListener('input', (e) => {
    let userInput = e.target.value;
    let suggestedItems = [];
    resultsData = [];
    closeList();
    if (!userInput) {return}
    activeIndex = -1;
    // when user clicks on search icon
    searchBtn.onclick = () => {
      showSearchResults(e.target.value);
    }
    // create a ul container that will hold the suggested items
    let autocompleteList = document.createElement("ul");
    autocompleteList.setAttribute("class", "autocomplete-list");
    // append the ul container as a child of the searchBarContainer
    searchBarContainer.appendChild(autocompleteList);
    // filter the suggestions against user input characters
    for (let i = 0; i < suggestions.length; i++) {
      let isNameMatch = suggestions[i].name.toLowerCase().startsWith(userInput.toLowerCase());
      // create the li html code and make the matching letters bold
      if (isNameMatch) {
        suggestedItems[i] = '<li><a href="' + suggestions[i].link + '"><strong>' + 
          suggestions[i].name.substring(0, userInput.length) + '</strong>' + 
          suggestions[i].name.substring(userInput.length) + '</a></li>';
        resultsData[i] = suggestions[i];
        break;
      }else {
        for (let n = 0; n < suggestions[i].tags.length; n++) {
          let isTagMatch = suggestions[i].tags[n].toLowerCase().startsWith(userInput.toLowerCase());
          if (isTagMatch) {
            suggestedItems[i] = '<li><a href="' + suggestions[i].link + '"><strong>' + 
              suggestions[i].tags[n].substring(0, userInput.length) + '</strong>' + 
              suggestions[i].tags[n].substring(userInput.length) + '<p><sub>' + 
              suggestions[i].name + '</sub></p></a></li>';
            resultsData[i] = suggestions[i];
            break;
          }        
        }
      }
    }
    if (!suggestedItems.length) {
      searchBarContainer.removeChild(autocompleteList);
      searchBarContainer.classList.remove('active');
      return;
    }
    let listData = suggestedItems.join('');
    autocompleteList.innerHTML = listData;
    searchBarContainer.classList.add('active');
  });
  /*execute a function presses a key on the keyboard:*/
  searchInput.addEventListener('keydown', function (e) {
    let key = searchBarContainer.getElementsByTagName('a');
    if (e.key == 'ArrowDown') {
      // If the Down key is pressed, increase the activeIndex variable
      activeIndex++;
      // make the current item more visible
      addActive(key);
    } else if (e.key == 'ArrowUp') {
      //up
      /*If the arrow UP key is pressed,
        decrease the activeIndex variable:*/
      activeIndex--;
      /*and and make the current item more visible:*/
      addActive(key);
    } else if (e.key == 'Enter') {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (activeIndex > -1) {
        // click on the active element
        if (key) key[activeIndex].click();
      }else {
        // show result page with all suggested elements
        showSearchResults(e.target.value);
      }
    }
  });
  // highlight the active element
  function addActive(listItems) {
    // if there are no suggested elements return
    if (!listItems.length) return false;
    // remove the 'active' class from all elements
    removeActive(listItems);
    if (activeIndex >= listItems.length) activeIndex = 0;
    if (activeIndex < 0) activeIndex = listItems.length - 1;
    // highlight the active element
    listItems[activeIndex].classList.add('autocomplete-active');
  }
  function removeActive(listItems) {
    /*a function to remove the 'active' class from all autocomplete items:*/
    for (var i = 0; i < listItems.length; i++) {
      listItems[i].classList.remove('autocomplete-active');
    }
  }
  function closeList(elmnt) {
    let list = searchBarContainer.querySelector(".autocomplete-list");
    if(!list){return}
    if (elmnt != list && elmnt != searchInput && elmnt != searchBtn) {
      searchBarContainer.removeChild(list);
      searchBarContainer.classList.remove('active');
    }
  }
  // create a search result page with all suggested elements
  function showSearchResults(inp) {
    if (!inp) {return};
    localStorage.setItem('search-keyword', JSON.stringify(inp));
    localStorage.setItem('search-results', JSON.stringify(resultsData));
    window.location.href = '/pages/search-results/searchResults.html';
  }
  // close the suggestion list if user clicks outside the container
  document.addEventListener("click", function (e) {
    closeList(e.target);
  });
}
autocomplete(document.getElementById("search"), searchData);

//main nav dropdown menu
document.addEventListener("click", (e) => {
  //cheack if the clicked element is a nav button
  if (e.target.classList.contains("dropdown-btn")) {
    //check which nav section has been clicked
    let section = e.target.getAttribute("data-section");
    for (let i = 0; i < dropdownList.length; i++) {
      //open menu and close if already oppened
      if (dropdownList[i].classList.contains(section)) {
        const visible = dropdownList[i].getAttribute("data-visible");
        if (visible === "true") {
          dropdownList[i].setAttribute("aria-expanded", false);
          dropdownList[i].setAttribute("data-visible", false);
        } else {
          dropdownList[i].setAttribute("aria-expanded", true);
          dropdownList[i].setAttribute("data-visible", true);
        }
      } else {
        dropdownList[i].setAttribute("aria-expanded", false);
        dropdownList[i].setAttribute("data-visible", false);
      }
    }
  } else {
    dropdownList.forEach((element) => {
      if (element.getAttribute("data-visible") === "true") {
        element.setAttribute("aria-expanded", false);
        element.setAttribute("data-visible", false);
      }
    });
  }
});
// Footer navigation buttons
footerNav.addEventListener("click", (e) => {
  if (e.target.hasAttribute("data-panel-btn")) {
    for (let i = 0; i < panels.length; i++) {
      panels[i].classList.remove("expand");
    }
    let panel = e.target.getAttribute("data-panel-btn");
    for (let i = 0; i < panels.length; i++) {
      if (panel == i) {
        panelIndex = i;
        panelsContainer.classList.add("expand");
        panels[i].classList.add("expand");
        break;
      }
    }
  }
});
panelsContainer.addEventListener("click", (e) => {
  let isClickInsideElement = panels[panelIndex].contains(e.target);
  if (!isClickInsideElement) {
    // Click is outside the panel element
    panels[panelIndex].classList.remove("expand");
    panelsContainer.classList.remove("expand");
  }
});
