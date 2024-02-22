const elMoviesList = document.querySelector(".js-movies-list");
const elMoviesTemplate = document.querySelector(".js-movies-template").content;
const elSearchForm = document.querySelector(".search-input-form");
const elSearchInput = elSearchForm.querySelector(".search-input");
const elSelectedCatagories = document.querySelector("#catagories-option");
const elMinYearInput = document.querySelector(".js-minYear-input");
const elMaxYearInput = document.querySelector(".js-maxYear-input");


const selectedMovies = movies.slice(0, 100);


// movies categories 
const genres = [];

for( const movie of movies) {
    const movieCategories = movie.Categories.split("|");
    movieCategories.filter((item) => {
        if(!genres.includes(item)) {
            genres.push(item)
        }
    });
    
};

const categoriesFragment = document.createDocumentFragment();
for (const category of genres) {

    
    const newItem = document.createElement("option");
    newItem.value = category
    newItem.textContent = category

    categoriesFragment.appendChild(newItem);

};

elSelectedCatagories.appendChild(categoriesFragment);


// movies render 
function renderMovies (arr, node) {
    
    const moviesFragment = document.createDocumentFragment();
    node.innerHTML = "";
    
    for ( const movie of arr) {
        
        const templateCloneNodes = elMoviesTemplate.cloneNode(true);
        const youtubeThumbnailUrl = `https://img.youtube.com/vi/${movie.ytid}/0.jpg`;
        templateCloneNodes.querySelector(".movie-poster").src = youtubeThumbnailUrl;
        templateCloneNodes.querySelector(".movie-title").textContent = movie.Title;
        templateCloneNodes.querySelector(".movie-rating").textContent = movie.imdb_rating;
        templateCloneNodes.querySelector(".movie-premire").textContent = movie.movie_year;
        templateCloneNodes.querySelector(".movie-duration").textContent = `${Math.floor(movie.runtime / 60)} h ${movie.runtime % 60} min`;
        templateCloneNodes.querySelector(".movie-genre").textContent = movie.Categories.replaceAll("|", ", ");
        templateCloneNodes.querySelector(".js-moreInfo-button").dataset.imdbId = movie.imdb_id;
        
        moviesFragment.appendChild(templateCloneNodes);
        
    };
    
    elMoviesList.appendChild(moviesFragment);
    
};

renderMovies(selectedMovies, elMoviesList);



// Modal elements 
const elModalContainer = document.querySelector(".js-modal-container");
const elModalTitle = elModalContainer.querySelector(".movie-modal-title");
const elModalIframe = elModalContainer.querySelector(".youtube-video");
const elModalImDbRating = elModalContainer.querySelector(".movie-modal-rating");
const elModalMovieYear = elModalContainer.querySelector(".movie-modal-premire");
const elModalRuntime = elModalContainer.querySelector(".movie-modal-duration");
const elModalCategories = elModalContainer.querySelector(".movie-modal-genre");
const elModalSummary = elModalContainer.querySelector(".movie-fullTitle-desc");
const elModalImDbLink = elModalContainer.querySelector(".imdb-link");


function renderModal(findMovie) {
    
    elModalTitle.textContent = findMovie.Title;
    elModalIframe.src = `https://www.youtube-nocookie.com/embed/${findMovie.ytid}`;
    elModalImDbRating.textContent = findMovie.imdb_rating;
    elModalMovieYear.textContent = findMovie.movie_year;
    elModalRuntime.textContent = `${Math.floor(findMovie.runtime / 60)} h ${findMovie.runtime % 60} min`;
    elModalCategories.textContent = findMovie.Categories.replaceAll("|", ", ");
    elModalSummary.textContent = findMovie.summary;
    elModalImDbLink.href =  `https://www.imdb.com/title/${findMovie.imdb_id}`;
    
};


// modal moreInfo button algorithm 
elMoviesList.addEventListener("click", function(evt) {
    
    if(evt.target.matches(".js-moreInfo-button")) {
        
        const btnImdbId = evt.target.dataset.imdbId;
        
        movies.find(function(item) {
            if(item.imdb_id === btnImdbId) {
                renderModal(item);
                elModalContainer.classList.remove("non-active")
            }
        })
    }
    
    
});


// modal cancel button algorithm
elModalContainer.addEventListener("click", function(evt) {
    
    if(evt.target.matches(".js-cancel-button")) {
        elModalContainer.classList.add("non-active")
    }
    
});


// form submit process 
elSearchForm.addEventListener("submit", function(evt) {
    evt.preventDefault();

    const searchInputVal = elSearchInput.value.trim();
    const regexSearchedTitle = new RegExp (searchInputVal, "gi");
    const selectedCatagoriesVal = elSelectedCatagories.value;
    const regexSelectedVal = new RegExp(selectedCatagoriesVal, "gi");
    const minYearInputVal = elMinYearInput.value;
    const maxYearInputVal = elMaxYearInput.value;

    const searchedMovies = movies.filter((item) => {

        const movieYear = item.movie_year
        const maxYearEmtpy = maxYearInputVal == "";
        const equalAllSelectVal = selectedCatagoriesVal == "All"

        if(String(item.Title).match(regexSearchedTitle) && equalAllSelectVal && movieYear >= minYearInputVal && maxYearEmtpy) {
            return item
        } else if (String(item.Title).match(regexSearchedTitle) && equalAllSelectVal && movieYear >= minYearInputVal && movieYear <= maxYearInputVal) {
            return item
        } else if (String(item.Title).match(regexSearchedTitle) && item.Categories.match(regexSelectedVal)  && movieYear >= minYearInputVal && maxYearEmtpy) {
            return item
        } else if (String(item.Title).match(regexSearchedTitle) && item.Categories.match(regexSelectedVal)  && movieYear >= minYearInputVal && movieYear <= maxYearInputVal) {
            return item
        }

    })

    if(searchedMovies.length > 0) {
        renderMovies(searchedMovies, elMoviesList);
        return
    } else {
        alert("This movie is not found!")
    }

    if(searchInputVal == "") {
        renderMovies(selectedMovies, elMoviesList)
    }
    
});
































































