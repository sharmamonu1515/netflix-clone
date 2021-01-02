import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';
import axios from '../../axios';
import './Row.css';

const baseurl = 'https://image.tmdb.org/t/p/original';

const Row = ({ title, fetchUrl, isLargeRow }) => {
    const [movies, setMovies] = useState([]);

    let [trailerUrl, setTrailerUrl] = useState('');

    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }

        fetchData();
    }, [fetchUrl]);

    const opts = {
        height: '400',
        width: '100%',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
      };

    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl('');
        } else {
            console.log(movie);
            movieTrailer(movie?.name || movie?.original_name || "")
                .then(url => {
                    console.log(url);
                    const urlParams = new URLSearchParams(new URL(url).search);
                    const trailer = urlParams.get('v');
                    setTrailerUrl(trailer);
                })
                .catch((error) => console.log(error))
        }
    }

    return (
        <div className="row">
            <h2>{title}</h2>
            <div className="row__posters">
                {
                    movies.map(movie => (
                        (isLargeRow && movie.poster_path) || movie.backdrop_path ? 
                        <img
                            key={movie.id}
                            onClick={() => handleClick(movie)}
                            className={`row__poster ${isLargeRow ? "row__posterLarge" : ''}`}
                            src={`${baseurl}${isLargeRow ? movie.poster_path : movie.backdrop_path}`}
                                alt={movie.name} />
                        : ''
                    ))
                }
            </div>
            { trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    );
}

export default Row;