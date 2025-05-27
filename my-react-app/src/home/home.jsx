import { isValidElement, useEffect, useState } from 'react'
import './home.css'


function Home() {

  //state for both the 1st & 2nd pokemon data (set to null originally)
  //pokedata will hold the data for the state
  //setPokedata updates the pokedata
  const [pokedata, setPokedata] = useState(null);
  const [pokedata2, setPokedata2] = useState(null);

  //useEffect for obtaining data from PokeAPI asynchronously
  //runs after component renders
  useEffect(() => {
    async function getPokemon(){

      //asynchronously grab the data for the pokemon
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/sneasel");
      const pokejson = await response.json();

      //2nd pokemon data
      const response2 = await fetch("https://pokeapi.co/api/v2/pokemon/krookodile");
      const pokejson2 = await response2.json();


      //use the state variable
      setPokedata(pokejson);
      setPokedata2(pokejson2);
    }
      //call the asynch function on render
      getPokemon();
  },[]);

  if(!pokedata) return <p>Loading ..</p>;

  console.log(pokedata);
  console.log(pokedata2);

  function Stat_Bar({stat_value}){

    let rounded = 0;
    
    if(stat_value >= 150){
      rounded = 100;
    }
    else{
    
      const barwidth = stat_value/150;
      rounded = Math.round(barwidth*100);
    }

    let color = "";

    if(stat_value < 25)
      color = "#bd1818";
    else if(stat_value < 50)
      color = "#f08d1c";
    else if(stat_value < 75)
      color = "#e0cb0d";
    else if(stat_value < 100)
      color = "#56c23b";
    else if(stat_value < 150)
      color = "#109422";
    else
      color = "#0e7aac";

    const result = String(rounded) + "%";

    return (
      <>
      <div id="stat_bar" style={{ width: result, backgroundColor: color}}></div>
      </>
    )

  }

  return (
  //parent element (React Fragments) <> & </>:) 
  <>
  <div class="container">
    <div class="row">
      <div class="col-3 d-flex flex-column justify-content-end">
        <div><img src={pokedata["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"]} class="img-fluid" /></div>
        <div>
          Stats
          <div class="row">
            <div class="col-3">HP</div>
            <div class="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata.stats[0].base_stat}/>
            </div>
            <div class="col-3 d-flex justify-content-start">{pokedata.stats[0].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Attack</div>
            <div class="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata.stats[1].base_stat}/>
            </div>
            <div class="col-3 d-flex justify-content-start">{pokedata.stats[1].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Defense</div>
            <div class="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata.stats[2].base_stat}/>
            </div>
            <div class="col-3 d-flex justify-content-start">{pokedata.stats[2].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Sp. Atk</div>
            <div class="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata.stats[3].base_stat}/>
            </div>
            <div class="col-3 d-flex justify-content-start">{pokedata.stats[3].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Sp. Def</div>
            <div class="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata.stats[4].base_stat}/>
            </div>
            <div class="col-3 d-flex justify-content-start">{pokedata.stats[4].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Speed</div>
            <div class="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata.stats[5].base_stat}/>
            </div>
            <div class="col-3 d-flex justify-content-start">{pokedata.stats[5].base_stat}</div>
          </div>
        </div>
      </div>
      <div class="col-3 d-flex flex-column justify-content-end">
        <div><img src={pokedata2["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"]} class="img-fluid"/></div>
        <div>Stats
          <div class="row">
            <div class="col-3">HP</div>
            <div class="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata2.stats[0].base_stat}/>
            </div>
            <div class="col-3 d-flex justify-content-start">{pokedata2.stats[0].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Attack</div>
            <div class="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata2.stats[1].base_stat}/>
            </div>
            <div class="col-3 d-flex justify-content-start">{pokedata2.stats[1].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Defense</div>
            <div class="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata2.stats[2].base_stat}/>
            </div>
            <div class="col-3 d-flex justify-content-start">{pokedata2.stats[2].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Sp. Atk</div>
            <div class="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata2.stats[3].base_stat}/>
            </div>
            <div class="col-3 d-flex justify-content-start">{pokedata2.stats[3].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Sp. Def</div>
            <div class="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata2.stats[4].base_stat}/>
            </div>
            <div class="col-3 d-flex justify-content-start">{pokedata2.stats[4].base_stat}</div>
          </div>
          <div class="row">
            <div class="col-3">Speed</div>
            <div class="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata2.stats[5].base_stat}/>
            </div>
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
