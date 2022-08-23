import '../styles/normalize.css';
import '../styles/main.css';
import searchData from '../json/searchData.json';

const dropdownList = document.querySelectorAll('.dropdown-list');
const panelsContainer = document.getElementById('panels-container');
const panels = panelsContainer.getElementsByClassName('panel');
const searchInput = document.getElementById('search');
let panelIndex;

// Autocomplete search bar
function autocomplete (searchInput, dataList) {
  const searchInputContainer = searchInput.parentNode;
  const searchBtn = searchInputContainer.querySelector('#search-btn');
  let activeIndex, userInput, resultsData, suggestions;

  searchInput.addEventListener('input', (e) => {
    userInput = e.target.value;
    suggestions = [];
    resultsData = [];
    closeList();
    if (!userInput) {return};
    activeIndex = -1;
    // Create a ul container that will hold the suggested items
    let autocompleteList = document.createElement('ul');
    autocompleteList.setAttribute('class', 'autocomplete-list');
    searchInputContainer.appendChild(autocompleteList);
    // Filter the dataList against user input characters
    for (let i = 0; i < dataList.length; i++) {
      let isNameMatch = dataList[i].name.toLowerCase().startsWith(userInput.toLowerCase());
      
      // Create the li html code and make the matching letters bold
      if (isNameMatch) {
        suggestions[i] = '<li><a href="' + dataList[i].link + '"><strong>' + 
          dataList[i].name.substring(0, userInput.length) + '</strong>' + 
          dataList[i].name.substring(userInput.length) + '<p><sub>' + 
          dataList[i].category + '</sub></p></a></li>';
        resultsData.push(dataList[i]);
      }else {
        for (let n = 0; n < dataList[i].tags.length; n++) {
          let isTagMatch = dataList[i].tags[n].toLowerCase().startsWith(userInput.toLowerCase());
          if (isTagMatch) {
            suggestions[i] = '<li><a href="' + dataList[i].link + '"><strong>' + 
              dataList[i].tags[n].substring(0, userInput.length) + '</strong>' + 
              dataList[i].tags[n].substring(userInput.length) + '<p><sub>' + 
              dataList[i].name + ' ' + dataList[i].category + '</sub></p></a></li>';
            resultsData.push(dataList[i]);
            break;
          }        
        }
      }
    }
    if (!suggestions.length) {
      closeList();
      return;
    }
    let suggestionsHTML = suggestions.join('');
    autocompleteList.innerHTML = suggestionsHTML;
    searchInputContainer.classList.add('active');
  });
  
  searchInput.addEventListener('keydown', function (e) {
    let listElements = searchInputContainer.getElementsByTagName('a');
    if (e.key == 'ArrowDown') {
      // If the Down key is pressed, increase the activeIndex variable
      activeIndex++;
      // Make the current item more visible
      addActive(listElements);
    } else if (e.key == 'ArrowUp') {
      // If the Up key is pressed, decrease the activeIndex variable
      activeIndex--;
      addActive(listElements);
    } else if (e.key == 'Enter') {
      if (activeIndex > -1) {
        // Click on the active listElement
        if (listElements) listElements[activeIndex].click();
      }else {
        // Show results page with all suggested elements
        showSearchResults(e.target.value);
      }
    }
  });

  searchBtn.onclick = () => {
    showSearchResults(searchInput.value);
  }

  // Highlight the active element
  function addActive(elements) {
    if (!elements.length) return false;
    // Remove the 'active' class from all elements
    removeActive(elements);
    if (activeIndex >= elements.length) activeIndex = 0;
    if (activeIndex < 0) activeIndex = elements.length - 1;
    // Highlight the active element
    elements[activeIndex].classList.add('autocomplete-active');
  }
  // Remove the 'active' class from all list items
  function removeActive(listItems) {
    for (let i = 0; i < listItems.length; i++) {
      listItems[i].classList.remove('autocomplete-active');
    }
  }
  function closeList(elem) {
    let list = searchInputContainer.querySelector('.autocomplete-list');
    if(!list){return}
    if (elem != list && elem != searchInput && elem != searchBtn) {
      searchInputContainer.removeChild(list);
      searchInputContainer.classList.remove('active');
    }
  }
  // Create a search result page with all suggested elements
  function showSearchResults(inp) {
    if (!inp) {return};
    localStorage.setItem('search-keyword', JSON.stringify(inp));
    localStorage.setItem('search-results', JSON.stringify(resultsData));
    window.location.href = '/pages/searchResults.html';
  }
  // Close the suggestions list if user clicks outside the container
  document.addEventListener('click', (e) => {
    closeList(e.target);
  });
}
autocomplete(searchInput, searchData);

// Main event listener
document.addEventListener('click', (e) => {
  dropdown(e.target);
  panelDisplay(e.target);
});
// Main navigation buttons
function dropdown(target) {
  // Cheack if the clicked element is a nav button
  if (target.classList.contains('dropdown-btn')) {
    // Check which nav section has been clicked
    let section = target.getAttribute('data-list');
    for (let i = 0; i < dropdownList.length; i++) {
      // Open-close menu
      if (dropdownList[i].classList.contains(section)) {
        const isExpanded = dropdownList[i].getAttribute('aria-expanded');
        if (isExpanded === 'true') {
          dropdownList[i].setAttribute('aria-expanded', false);
        } else {
          dropdownList[i].setAttribute('aria-expanded', true);
        }
      } else {
        dropdownList[i].setAttribute('aria-expanded', false);
      }
    }
  } else {
    dropdownList.forEach((element) => {
      element.setAttribute('aria-expanded', false);
    });
  }
}
// Footer navigation buttons
function panelDisplay(target) {
  if (target.hasAttribute('data-panel-btn')) {
    let panel = target.getAttribute('data-panel-btn');
    for (let i = 0; i < panels.length; i++) {
      if (panel == i) {
        panelIndex = i;
        panelsContainer.classList.add('expand');
        panels[i].classList.add('expand');
      }else {
        panels[i].classList.remove('expand');
      }
    }
  }
}
// Close panel if user clicked outside of boundaries
panelsContainer.addEventListener('click', (e) => {
  let isClickInsideElement = panels[panelIndex].contains(e.target);
  if (!isClickInsideElement) {
    // Click is outside the panel element
    panels[panelIndex].classList.remove('expand');
    panelsContainer.classList.remove('expand');
  }
});