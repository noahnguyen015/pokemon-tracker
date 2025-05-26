import { isValidElement, useEffect, useState } from 'react'
import './home.css'

function Home() {

  const [pokedata, setPokedata] = useState(null);
  const [pokedata2, setPokedata2] = useState(null);

  useEffect(() => {
    async function getPokemon(){
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/Garchomp");
      const pokejson = await response.json();

      const response2 = await fetch("https://pokeapi.co/api/v2/pokemon/Gabite");
      const pokejson2 = await response2.json();



      setPokedata(pokejson);
      setPokedata2(pokejson2);
    }
      getPokemon();
  },[]);

  console.log(pokedata);
  console.log(pokedata2);

  if(!pokedata) return <p>Loading ..</p>;

  return (
  <>
  <div class="container">
    <div class="row">
      <div class="col-3 d-flex flex-column justify-content-end">
        <div><img src={pokedata["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"]} class="img-fluid" /></div>
        <div>
          Stats
          <div class="row">
            <div class="col-3">HP</div>
            <div class="col-6" id="stat_bar"></div>
            <div class="col-3 d-flex justify-content-start">{pokedata.stats[0].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Attack</div>
            <div class="col-6" id="stat_bar"></div>
            <div class="col-3 d-flex justify-content-start">{pokedata.stats[1].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Defense</div>
            <div class="col-6" id="stat_bar"></div>
            <div class="col-3 d-flex justify-content-start">{pokedata.stats[2].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Sp. Atk</div>
            <div class="col-6" id="stat_bar"></div>
            <div class="col-3 d-flex justify-content-start">{pokedata.stats[3].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Sp. Def</div>
            <div class="col-6" id="stat_bar"></div>
            <div class="col-3 d-flex justify-content-start">{pokedata.stats[4].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Speed</div>
            <div class="col-6" id="stat_bar"></div>
            <div class="col-3 d-flex justify-content-start">{pokedata.stats[5].base_stat}</div>
          </div>
        </div>
      </div>
      <div class="col-3 d-flex flex-column justify-content-end">
        <div><img src={pokedata2["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"]} class="img-fluid"/></div>
        <div>Stats
          <div class="row">
            <div class="col-3">HP</div>
            <div class="col-6" id="stat_bar"></div>
            <div class="col-3 d-flex justify-content-start">{pokedata2.stats[0].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Attack</div>
            <div class="col-6" id="stat_bar"></div>
            <div class="col-3 d-flex justify-content-start">{pokedata2.stats[1].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Defense</div>
            <div class="col-6" id="stat_bar"></div>
            <div class="col-3 d-flex justify-content-start">{pokedata2.stats[2].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Sp. Atk</div>
            <div class="col-6" id="stat_bar"></div>
            <div class="col-3 d-flex justify-content-start">{pokedata2.stats[3].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Sp. Def</div>
            <div class="col-6" id="stat_bar"></div>
            <div class="col-3 d-flex justify-content-start">{pokedata2.stats[4].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Speed</div>
            <div class="col-6" id="stat_bar"></div>
            <div class="col-3 d-flex justify-content-start">{pokedata2.stats[5].base_stat}</div>
          </div>
        </div>
      </div>
      <div class="col-6"></div>
    </div>
  </div>
  </>
  )
}

export default Home
