import React, { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './api/Tmdb';
import MovieRow from './components/MovieRow/index';
import FeaturedMovie from './components/FeaturedMovie/index';
import Header from './components/Header/index';
import loading from './img/Netflix_LoadTime.gif';

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featureData, setFeatureData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      let originals = list.filter(i=> i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');

      setFeatureData(chosenInfo);
    }


    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  },2000, []);

  return (
    <div className="page">
      <Header black={blackHeader} />
      {featureData && 
        <FeaturedMovie item={featureData} />
      }
      <section className="lists">
        {movieList.map((item, key) =>(
          <div>
            <MovieRow key={key} title={item.title} items={item.items} />
            
          </div>
        ))}
      </section>
      <footer>
        Direitos de imagem para <a href="https://www.netflix.com/br/" target="blank" style={{color: "#e50914"}}>Netflix</a> <br/>
        Dados pegos do site <a href="https://www.themoviedb.org" target="blank" style={{color: "#115c99"}}>Themoviedb.org</a>
      </footer>
      {movieList.length <= 0 &&
        <div className="loading">
          <img src={loading} alt="Carregando"></img>
        </div>
      }
    </div>
  );
}