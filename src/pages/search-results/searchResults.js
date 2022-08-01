const container = document.querySelector('.cards-container');
let results = JSON.parse(localStorage.getItem('search-results'));
let searchKeyword = JSON.parse(localStorage.getItem('search-keyword'));
console.log(results)

if(results.length) {
  // if there are search results for the entered keyword
  container.innerHTML = '<h3 class="search-results">' + results.length + 
    ' search results for <strong>' + searchKeyword + '</strong></h3>';
  for (let i = 0; i < results.length; i++) {
    let card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = '<a href="' + results[i].link + '"><img src="' + results[i].img +
      '" alt="' + results[i].alt + '"/>' + '<a href="' + results[i].link + '">' +
      results[i].a + '</a>';
    container.appendChild(card);
  }
}else {
  // if there are no search results for the entered keyword
  container.innerHTML = '<h3 class="search-results">Sorry there are no results for <strong>'
    + searchKeyword + '!</strong></h3>';
}



