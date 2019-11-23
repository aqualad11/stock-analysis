// Searchbar script for searchbar functionality 


const searchInput = document.querySelector('#searchbar input');

// Uses debounce function to wait until user has stopped typign for 600 ms
searchInput.onkeyup = debounce(function() {
  clearSearchResults();
	// If searchbar is not search for stocks
  if(searchInput.value.length > 0){
    axios.post('stocks/searchStock', {
      input: searchInput.value
    }).then(function(res) {

      var results = res.data;
      var searchResults = $('#search-results');
      for(key in results) {
        searchResults.append('<div id="' + key + '" onclick="addStock(this.id, this.innerText)"><li class="list-group-item" onload="myFunction()">' + results[key] + '</li></div>');
      }
      
    });
  }
	
	
}, 600);

// Adds the stock to the list of added stocks
function addStock(key, value) {
  let list = $('#added-stocks');

  // Make key and value available for backend
  let name = key + '_' + value.replace(/ /g, '-');
  
  // Appends a readonly input which shows the user 
  list.append('<li readonly class="list-group-item">' + value + '</li>'
    + '<input type="hidden" value=' + name +' name="stocks"></input>');

  clearSearchResults();
  clearSearchBar();
}

// Clears the search results under the search bar
function clearSearchResults() {
  let results = document.getElementById('search-results');

  while(results.firstChild) {
    results.removeChild(results.firstChild);
  }
}

// Clears the text in the searchbar 
function clearSearchBar() {
  searchInput.value = '';
}

// Credit David Walsh (https://davidwalsh.name/javascript-debounce-function)

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  var timeout;

  // This is the function that is actually executed when
  // the DOM event is triggered.
  return function executedFunction() {
    // Store the context of this and any
    // parameters passed to executedFunction
    var context = this;
    var args = arguments;
	    
    // The function to be called after 
    // the debounce time has elapsed
    var later = function() {
      // null timeout to indicate the debounce ended
      timeout = null;
	    
      // Call function now if you did not on the leading end
      if (!immediate) func.apply(context, args);
    };

    // Determine if you should call the function
    // on the leading or trail end
    var callNow = immediate && !timeout;
	
    // This will reset the waiting every function execution.
    // This is the step that prevents the function from
    // being executed because it will never reach the 
    // inside of the previous setTimeout  
    clearTimeout(timeout);
	
    // Restart the debounce waiting period.
    // setTimeout returns a truthy value (it differs in web vs node)
    timeout = setTimeout(later, wait);
	
    // Call immediately if you're dong a leading
    // end execution
    if (callNow) func.apply(context, args);
  };
};