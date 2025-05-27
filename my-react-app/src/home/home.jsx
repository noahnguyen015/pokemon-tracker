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
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/regice");
      const pokejson = await response.json();

      //2nd pokemon data
      const response2 = await fetch("https://pokeapi.co/api/v2/pokemon/dialga");
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
      //just make it 100% if it's larger than 150
      rounded = 100;
    }
    else{
      //find the rounded percentage out of 150 for the width
      const barwidth = stat_value/150;
      rounded = Math.round(barwidth*100);
    }

    let color = "";

    //grab the color for the bar based on the value
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

    //convert num to percent string
    const result = String(rounded) + "%";

    return (
      <>
      <div id="stat_bar" style={{ width: result, backgroundColor: color}}></div>
      </>
    )

    function returnType(typing){

    }

  }

  return (
  //parent element (React Fragments) <> & </>:) 
  <>
  <div class="container">
    <div class="row">
      <div class="col-4 border">
        <div><span class="align-text-top"><h4>{pokedata.name}</h4></span></div>
        <div><img src={pokedata["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"]} class="img-fluid sprite" /></div>
        <div class="align-items-bottom">
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
      <div class="col-4 border">
        <div><span class="align-text-top"><h4>{pokedata2.name}</h4></span></div>
        <div><img src={pokedata2["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"]} class="img-fluid sprite"/></div>
        <div class="align-items-bottom">
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
      <div class="col-4 border">
        Hello
      </div>
    </div>
    <div class="row">
      <div class="col-8 border">
        <img src={pokedata["sprites"]["other"]["official-artwork"]["front_default"]} class="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
        <img src={pokedata["sprites"]["other"]["official-artwork"]["front_default"]} class="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/> 
        <img src={pokedata["sprites"]["other"]["official-artwork"]["front_default"]} class="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
        <img src={pokedata["sprites"]["other"]["official-artwork"]["front_default"]} class="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
        <img src={pokedata["sprites"]["other"]["official-artwork"]["front_default"]} class="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
        <img src={pokedata["sprites"]["other"]["official-artwork"]["front_default"]} class="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
      </div>
    </div>
    <div class="row">
      <div class="col-8 border">
        <img src={pokedata2["sprites"]["other"]["official-artwork"]["front_default"]} class="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
        <img src={pokedata2["sprites"]["other"]["official-artwork"]["front_default"]} class="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
        <img src={pokedata2["sprites"]["other"]["official-artwork"]["front_default"]} class="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
        <img src={pokedata2["sprites"]["other"]["official-artwork"]["front_default"]} class="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
        <img src={pokedata2["sprites"]["other"]["official-artwork"]["front_default"]} class="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
        <img src={pokedata2["sprites"]["other"]["official-artwork"]["front_default"]} class="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
      </div>
    </div>
  </div>
  </>
  )
}

export default Home
/*
*/