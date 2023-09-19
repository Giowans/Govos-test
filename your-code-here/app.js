// NOTE See HELP.md in this folder for some useful info & tips
import { getCurrentStep } from "../routes/base.js";
import useLocation from "../use-location.js";
import "./tests.js";

const { css, cx } = emotion;
const { useEffect, useState, useRef } = React;

const style = css`
  text-align: center;
  width: 80%;
`;

const welcomeImage = css`
  margin-top: 15px;
  width: 100px;
  height: 160px;
  object-fit: cover;
`

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
  padding: 12px 8px;
  width: 100%;
  gap: 8px;
`;

const movieList = css`
  list-style: "🎬";
  max-height: 60vh;
  overflow-y: scroll;
  & li {
    height: fit-content;
    min-width: 300px;
    margin-right: 8px;
    padding: 8px 16px;
    transition: all 2s ease-in-out;
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
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  height: 0px;
  overflow: hidden;
  & p {
    width: 70%;
    text-align: left;
    font-size: 0.75rem;
    font-style: normal;
  }
`

const movieListBodyCollapsed = css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
  gap: 24px;
  height: fit-content;
  overflow: hidden;
  & p {
    width: 70%;
    text-align: left;
    font-size: 0.75rem;
    font-style: normal;
  }
`

const imageWrapper = css`
  width: 100px;
  height: 160px;
  position: relative;
   & img {
    position: absolute;
    border-radius: 12px;
    left: 0;
    top: 0;
    width: 100px;
    height: 160px;
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
  user-select: none;
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
  user-select: none;
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
  border-radius: 8px;
  user-select: none;
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
  width: 130px;
  font-size: .8rem;
  padding: 0.675em 4em 0.675em 1em;
  background-color: #fff;
  border: 1px solid #caced1;
  border-radius: 0.35rem;
  color: #000;
  transition: all 0.3s ease-in-out;

  &:hover, "&:focus-within" {
    border-color: #000;
  }
`;

const inputSelect = css`
  min-width: 130px;
  position: relative;

  & select {
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    font-size: .8rem;
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
  showMovieYear = false,
  showBodyImage = false,
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
      html`<a href=${movieData.url} onClick=${(e) => e.stopPropagation()}>${movieData.title}</a>`}
    ${!isItemALink &&
      html`<span>${movieData.title}</span>`
    }
    ${showMovieYear && html`
      <span>(${movieData.year})</span>
    `}
    </div>
    <div className=${cx({[movieListBody]: !isCollapsed, [movieListBodyCollapsed]: isCollapsed})}>
      ${showBodyImage && html`
        <div className=${imageWrapper}>
          <img src=${movieData.coverUrl} alt=${`${movieData.id}-movie-${movieData.title}`} />
        </div>
      `}
      <p>${movieData.review}</p>
    </div>
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
  showBodyImage = false
}) => {
  
  //States
  const [movies, setMovies] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [decadeFilter, setDecadeFilter] = useState(0);

  //Refs
  const reviewsRef = useRef([])
  const rootMoviesRef = useRef([]);


  //Hooks

  //Effects
  useEffect(() => {
    fetchMovies();
    fecthReviews();
  }, [])

  useEffect(() => {
    handleFilterMovies();
  }, [searchFilter, decadeFilter])

  //Methods
  const fecthReviews = () => {
    const cachedReviews = localStorage.getItem('test-reviews-cached');
    if(cachedReviews !== null) {
      reviewsRef.current = JSON.parse(cachedReviews);
    } else {
      fetch('/api/reviews.json')
      .then(response => {
        return response.json(); 
      })
      .then(myJson => {
        const jsonString = JSON.stringify(myJson);
        if(jsonString) {
          let reviewsToSet = JSON.parse(jsonString)
          reviewsRef.current = reviewsToSet;
          localStorage.setItem('test-reviews-cached', JSON.stringify(reviewsToSet));
        } else {
          setMovies([]);
        }
      })
    }
  }
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
          rootMoviesRef.current = [...moviesToSet.sort((a, b) => a.title.localeCompare(b.title))];
          setMovies(rootMoviesRef.current);
          localStorage.setItem('test-movies-cached', JSON.stringify(moviesToSet));
        } else {
          setMovies([]);
        }
      })
    }
  }

  const handleFilterMovies = () =>{
    let moviesFiltered = [...rootMoviesRef.current];
    if(searchFilter && searchFilter.length >= 2) {
      moviesFiltered = moviesFiltered.filter(movie => movie.title.toLowerCase().includes(searchFilter.toLowerCase()));
    }
    if(decadeFilter > 0) {
      moviesFiltered = moviesFiltered.filter(movie => Number(movie.year) >= decadeFilter && Number(movie.year) < decadeFilter + 10 );
    }
    setMovies([...moviesFiltered]);
  }
  const handleSearch = (event) => {
    const val = event.target.value;
    console.log('search', val);
    setSearchFilter(val);
  }

  const handleFilterByDecade = (event) => {
    const val = event.target.value;
    console.log('decade: ', Number(val), 'event: ', event);
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
                <option value=${""}>Select an option...</option>
                <option value=${1960}>1960</option>
                <option value=${1970}>1970</option>
                <option value=${1980}>1980</option>
                <option value=${1990}>1990</option>
                <option value=${2000}>2000</option>
                <option value=${2010}>2010</option>
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
              movieData=${{...movie, review: reviewsRef.current.find(review => review['movie-id'] === movie.id)['review']}} 
              isItemALink=${isItemALink} 
              isCollapsible=${moviesCanCollapse}
              showMovieYear=${showMovieYear}
              showMovieRating=${showMovieRating}
              showBodyImage=${showBodyImage}
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
        case 7:
          return html`
            <${MovieList} 
              isItemALink=${true} 
              showMovieYear=${true} 
              showMovieRating=${true} 
              useCachedMoviesOnly=${true}
              withSearch=${true}
              allowFilterByDecade=${true}
            />
          `
        case 8:
          return html`
            <${MovieList} 
              isItemALink=${true} 
              showMovieYear=${true} 
              showMovieRating=${true} 
              useCachedMoviesOnly=${true}
              withSearch=${true}
              allowFilterByDecade=${true}
              moviesCanCollapse=${true}
            />
          `
          case 9:
            return html`
              <${MovieList} 
                isItemALink=${true} 
                showMovieYear=${true} 
                showMovieRating=${true} 
                useCachedMoviesOnly=${true}
                withSearch=${true}
                allowFilterByDecade=${true}
                moviesCanCollapse=${true}
                showBodyImage=${true}
              />
            `
    }
  }

  return html`
    <div className=${resultsContainer}>
      ${currentStep &&
        html`<h1 className=${titleStyle}>Results for step ${currentStep}</h1>`}
      ${renderResultForStep(currentStep)}
      ${!currentStep &&
        html`
        <img className=${welcomeImage} src=${"/assets/Geoffrey.jpg"} />
        <h1 className=${titleStyle}>Hi, I'm Giovanni :)</hi>
        <p className=${style}>
          Hope I did well in this assesment 😅, I've learned a lot doing this. Please fell free and welcome of give me feedback, I would appreciate it so much 💛🌟. 
        </p>
      `}
    </div>
  `;
};
