import './index.css';

const dataContainer = document.querySelector('[data-container]');
const temp = document.querySelector('[data-row]');
const matOptions = document.getElementById('materials');
const sortOptions = document.getElementById('sort');
const searchInput = document.getElementById('material-search');


import woods from '../../json/woods-density.json';
import metals from '../../json/metals-density.json';
import plastics from '../../json/plastics-density.json';
import scr from '../../imgs/density-table-scr.webp';

woods.forEach(element => {
  const tRow = temp.content.cloneNode(true).children[0];
  tRow.children[0].textContent = element.name;
  tRow.children[1].textContent = element.si;
  tRow.children[2].textContent = element.us;
  dataContainer.appendChild(tRow);
})

matOptions.addEventListener('input', (e) => {
  changeTable(selectTable(e.target.value));
})

sortOptions.addEventListener('input', () => {
  changeTable(selectTable(matOptions.value));
})

searchInput.addEventListener('input', (e) => {
  searchByName(e.target.value);
})

function searchByName(inp) {
  const data = dataContainer.children;
  for (let i = 0; i < data.length; i++) {
    const isVisible = data[i].children[0].textContent.toLowerCase().startsWith(inp.toLowerCase());
    data[i].classList.toggle('hide',!isVisible);
  }
}

function changeTable(name) {
  let child = dataContainer.lastElementChild;
  // Clear table data
  while (child) {
    dataContainer.removeChild(child);
    child = dataContainer.lastElementChild;
  }
  sortData(name, sortOptions.value)
  // Create new table data
  name.forEach(element => {
    const tRow = temp.content.cloneNode(true).children[0];
    tRow.children[0].textContent = element.name;
    tRow.children[1].textContent = element.si;
    tRow.children[2].textContent = element.us;
    dataContainer.appendChild(tRow);
  })
  searchByName(searchInput.value);
}

function selectTable(table) {
  switch (table) {
    case 'woods':
      return woods;
    case 'metals':
      return metals;
    case 'plastics':
      return plastics;
  }
}

function sortData(data, sortType) {
  let aNew, bNew;
  switch (sortType) {
    case 'name':
      data.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'lth':
      data.sort((a, b) => {
        aNew = a.si;
        bNew = b.si;
        if (a.si.includes('-')) {
          aNew = a.si.split('-')[1];
        }
        if (b.si.includes('-')) {
          bNew = b.si.split('-')[1];
        }
        return Number(aNew) - Number(bNew);
      });
      break;
    case 'htl':
      data.sort((a, b) => {
        aNew = a.si;
        bNew = b.si;
        if (a.si.includes('-')) {
          aNew = a.si.split('-')[1];
        }
        if (b.si.includes('-')) {
          bNew = b.si.split('-')[1];
        }
        return Number(bNew) - Number(aNew);
      });
      break;
  }
}

// Soical media share buttons
const facebookBtn = document.querySelector('#facebook-btn');
const twitterBtn = document.querySelector('#twitter-btn');
const pinterestBtn = document.querySelector('#pinterest-btn');
const linkedinBtn = document.querySelector('#linkedin-btn');
const whatsappBtn = document.querySelector('#whatsapp-btn');

function setShareLinks() {
  const url = encodeURI(document.location.href);

  facebookBtn.setAttribute('href', 
  `https://www.facebook.com/sharer.php?u=${url}`);
  
  twitterBtn.setAttribute('href', 
  `https://twitter.com/intent/tweet?url=${url}`);
  
  pinterestBtn.setAttribute('href', 
  `https://pinterest.com/pin/create/button/?url=${url}`);

  linkedinBtn.setAttribute('href', 
  `https://www.linkedin.com/sharing/share-offsite/?url=${url}`);

  whatsappBtn.setAttribute('href', 
  `https://wa.me/?text=${decodeURI(document.title)} ${url}`);
}
setShareLinks()