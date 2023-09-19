// NOTE See HELP.md in this folder for some useful info & tips
import { getCurrentStep } from "../routes/base.js";
import useLocation from "../use-location.js";
import "./tests.js";

const { css, cx } = emotion;
const { useEffect, useState } = React;

const style = css`
  text-align: center;
`;

const titleStyle = css`
  color: #2f3542;
  text-shadow: 2px 2px 0px #D3D3D3;
  font-weight: 600
`

const resultsContainer = css`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: flex-start;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  padding: 10px;
`;

const movieListContainer = css`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-left: 8px;
  padding-right: 8px;
  width: 100%;
  height: 100%; 
`;

const movieListFormRow = css`
  display: flex;
  align-items: center;
  padding-top: 5px;
  padding-bottom: 5px;
  width: 100%;
  gap: 8px;
`;

const movieList = css`
  list-style: "🎬";
  max-height: 70vh;
  overflow-y: scroll;
  & li {
    height: fit-content
    min-width: 800px
    display: flex;
    flex-direction: column;
    margin-right: 8px;
    padding: 8px 16px;
    transition: all 0.4s ease-in-out;
  }
`
const movieItemHeader = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  a, span {
    font-size: 1.1rem;
    color: #101010;
    font-style: italic;
    text-shadow: 2px 2px 0px #D3D3D3;
  }
`;

const movieListBody = css`
  display: inline-flex;
  padding: 12px 24px;
  gap: 24px;
  height: 0px;
`

const movieListBodyCollapsed = css`
  display: inline-flex;
  padding: 12px 24px;
  gap: 24px;
  height: fit-content;
`

const imageWrapper = css`
  width: 100px;
  height: 170px;
  position: relative;
   & img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;  
   }
`

const coverImages = css`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; 
`

const bgLowRating = css`
  background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  color: #fff;
  & span {
    text-shadow: none;
    color: #fff;
    font-size: 0.8rem;
  }
`

const bgMidRating = css`
  background-color: goldenrod;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  color: #fff;
  & span {
    text-shadow: none;
    color: #fff;
    font-size: 0.8rem;
  }
`
const bgHighRating = css`
  background-color: green;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 30%;
  color: #fff;
  & span {
    text-shadow: none;
    color: #fff;
    font-size: 0.8rem;
  }
`

const formItem = css`
  display: flex;
  flex-direction: column;
  gap: 4px;
  & label {
    font-size: 14px;
    color: "#000";
    font-weight: 700;
  }  
`;

const customInput = css`
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  font-size: 1.15rem;
  padding: 0.675em 6em 0.675em 1em;
  background-color: #fff;
  border: 1px solid #caced1;
  border-radius: 0.35rem;
  color: #000;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover, "&:focus-within" {
    border-color: #000;
  }
`;

const inputSelect = css`
  min-width: 350px;
  position: relative;

  & select {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    font-size: 1.15rem;
    padding: 0.675em 6em 0.675em 1em;
    background-color: #fff;
    border: 1px solid #caced1;
    border-radius: 0.35rem;
    color: #000;
    cursor: pointer;
  }

  :before, :after {
    --size: 0.3rem;
    content: "";
    position: absolute;
    right: 1rem;
    pointer-events: none;
  }

  :before {
    border-left: var(--size) solid transparent;
    border-right: var(--size) solid transparent;
    border-bottom: var(--size) solid black;
    top: 40%;
  }

  :after {
    border-left: var(--size) solid transparent;
    border-right: var(--size) solid transparent;
    border-top: var(--size) solid black;
    top: 55%;
  }
`

// I'm going to put my custom components here because I'm so afraid of the symbolic soft links that the bash script already done
// and I don't want to difficult more the testing of my custom files to my evaluators.

const MovieListItem = ({
  movieData = {
    id: '',
    title: '',
    year: '',
    score: '',
    review: '',
    url: '',
    coverUrl: ''
  },
  key = '',
  isItemALink = false, 
  isCollapsible = false, 
  showMovieRating = false, 
  showMovieYear = false
}) => {

  //State
  const [isCollapsed, setIsCollapsed] = useState(false);

  //Variables
  const ratingToShow = Number(movieData.score) * 100;

  return html`
    <li
      className=${cx({[css`
      position: relative;
      background-image: linear-gradient(to bottom, #D3D3D3, rgba(0,0,0,0), url(${movieData.coverUrl});
      background-repeat: no-repeat;
      background-size: cover;
      `]: isCollapsed})}
      key=${key} 
      onClick=${isCollapsible ? () => setIsCollapsed(!isCollapsed) : undefined}
    >
    <div className=${movieItemHeader}>
      ${showMovieRating && html`
      <div className=${cx({[bgLowRating]: ratingToShow <= 60, [bgMidRating]: ratingToShow <= 80, [bgHighRating]: ratingToShow > 80})}>
        <span>${ratingToShow}%</span>
      </div>
    `}
    ${isItemALink &&
      html`<a href=${movieData.url}>${movieData.title}</a>`}
    ${!isItemALink &&
      html`<span>${movieData.title}</span>`
    }
    ${showMovieYear && html`
      <span>(${movieData.year})</span>
    `}
    </div>
    ${isCollapsed && html`
      <div className=${movieListBody}>
        <div className=${imageWrapper}>
          <img src=${movieData.coverUrl} alt=${`${movieData.id}-movie-${movieData.title}`} />
        </div>
        <p>${movieData.review}</p>
      </div>
    `}
    </li>
  ` 
}

const MovieList = ({ 
  showMovieYear = false, 
  showMovieRating = false, 
  moviesCanCollapse = false, 
  useCachedMoviesOnly = false, 
  withSearch = false,
  isItemALink = false, 
  allowFilterByDecade = false,
}) => {
  
  //States
  const [movies, setMovies] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [decadeFilter, setDecadeFilter] = useState(0);

  //Hooks

  //Effects
  useEffect(() => {
    fetchMovies();
  }, [])

  useEffect(() => {
    handleFilterMovies();
  }, [searchFilter, decadeFilter])

  //Methods
  const fetchMovies = () => {
    const cachedMovies = localStorage.getItem('test-movies-cached');
    if(cachedMovies !== null && useCachedMoviesOnly) {
      setMovies(JSON.parse(cachedMovies));
    } else {
      fetch('/api/movies.json')
      .then(response => {
        return response.json(); 
      })
      .then(myJson => {
        const jsonString = JSON.stringify(myJson);
        if(jsonString) {
          let moviesToSet = JSON.parse(jsonString)
          moviesToSet = moviesToSet.map((item) => {
            return {
              ...item,
              coverUrl: item['cover-url']
            }
          });
          setMovies(moviesToSet.sort((a, b) => a.title.localeCompare(b.title)));
          localStorage.setItem('test-movies', JSON.stringify(moviesToSet));
        } else {
          setMovies([]);
        }
      })
    }
  }

  const handleFilterMovies = () =>{
    let moviesFiltered = [...movies];
    if(searchFilter) {
      moviesFiltered = movies.filter(movie => movie.toLowerCase().includes(val.toLowerCase()));
    }
    if(decadeFilter > 0) {
      moviesFiltered = movies.filter(movie => Number(movie.year) >= decadeFilter && Number(movie.year) < decadeFilter + 10 );
    }
    setMovies(moviesFiltered);
  }
  const handleSearch = (event) => {
    const val = event.target.value;
    console.log('search', val);
    setSearchFilter(val);
  }

  const handleFilterByDecade = (event) => {
    const val = event.target.value;
    console.log('decade: ', Number(val));
    setDecadeFilter(Number(val));
  }

  return html`
    <div className=${movieListContainer}>
      <div className=${movieListFormRow}>
        ${withSearch && html`
          <div className=${formItem}>
            <label htmlFor='search'>
              Search:
            </div>
            <input
              name="search"
              className=${customInput}
              placeholder="Type to search by title..."
              onChange=${handleSearch}
            />
          </div>
        `}
        ${allowFilterByDecade && html`
          <div className=${formItem}>
            <label htmlFor="filter__decade">
              Filter by decade:
            </div>
            <div className=${inputSelect}>
              <select
                name="filter__decade"
                placeholder="Type to search by title..."
                onChange=${handleFilterByDecade}
              >
                <option value="">Select an option...</option>
                <option value ="1960">1960</option>
                <option value ="1970">1970</option>
                <option value ="1980">1980</option>
                <option value ="1990">1990</option>
                <option value ="2000">2000</option>
                <option value ="1960">2010</option>
              </select>
            </div>
          </div>
        `}
      </div>

      <ul className=${movieList}>
        ${movies.map((movie) => 
          html`
            <${MovieListItem}
              key=${`${movie.id}-${movie.title}`} 
              movieData=${{...movie, review: ''}} 
              isItemALink=${isItemALink} 
              isCollapsible=${moviesCanCollapse}
              showMovieYear=${showMovieYear}
              showMovieRating=${showMovieRating}
            ><//>
          `)}
      </ul>
    </div>
  `
}

export const App = ({ onLoad }) => {

  //Hooks
  const [location] = useLocation();

  //Variables
  const currentStep = getCurrentStep(location);

  //Effects
  useEffect(onLoad, []); // to run tests

  useEffect(() => {

  }, [currentStep])

  const renderResultForStep = (currentStep) => {
    switch(Number(currentStep)) {
      case 1:
        return html`
          <${MovieList} />
        `
      case 2:
        return html`
          <${MovieList} isItemALink=${true}/>
        `
      case 3:
        return html`
          <${MovieList} isItemALink=${true} showMovieYear=${true}/>
        `
      case 4:
        return html`
          <${MovieList} isItemALink=${true} showMovieYear=${true} showMovieRating=${true}/>
        `
      case 5:
        return html`
          <${MovieList} 
            isItemALink=${true} 
            showMovieYear=${true} 
            showMovieRating=${true} 
            useCachedMoviesOnly=${true}
          />
        `
        case 6:
        return html`
          <${MovieList} 
            isItemALink=${true} 
            showMovieYear=${true} 
            showMovieRating=${true} 
            useCachedMoviesOnly=${true}
            withSearch=${true}
          />
        `       
    }
  }

  return html`
    <div className=${resultsContainer}>
      ${currentStep &&
        html`<h1 className=${titleStyle}>Results for step ${currentStep}</h1>`}
      ${renderResultForStep(currentStep)}
      <p className=${style}>
        (this file can be found at ./your-code-here/app.js)
      </p>
    </div>
  `;
};
