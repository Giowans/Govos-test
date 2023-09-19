// NOTE See HELP.md in this folder for some useful info & tips
import { Title } from "../routes/title.js";
import { getCurrentStep } from "../routes/base.js";
import useLocation from "../use-location.js";
import "./tests.js";

const { css } = emotion;
const { useEffect, useState } = React;

const style = css`
  text-align: center;
`;

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
  & li {
    margin-right: 8px;
    margin-top: 10px;
  }
`

const formItem = css`
  display: flex;
  flex-direction: column;
  gap: 4px:
  & label {
    font-size: 14px;
    color: "#000";
    font-weight: 700;
  }  
`;

const customInput = css `
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
`

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

const MovieList = ({ 
  showMovieYear = false, 
  showMovieRating = false, 
  moviesCanCollapse = false, 
  useCachedMoviesOnly = false, 
  withSearch = false, 
  allowFilterByDecade = false,
  moviesRedirect = false, 
}) => {
  
  //States
  const [movies, setMovies] = useState([]);

  //Hooks

  //Effects
  useEffect(() => {
    fetchMovies();
  }, [])

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
          setMovies(JSON.parse(jsonString));
          localStorage.setItem('test-movies', jsonString)
        } else {
          setMovies([]);
        }
      })
    }
  }

  return html`
    <div >

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

  return html`
    <div className=${resultsContainer}>
      ${currentStep &&
        html`<${Title}>Results for step ${currentStep}<//>`}
      <p className=${style}>
        (this file can be found at ./your-code-here/app.js)
      </p>
    </div>
  `;
};
