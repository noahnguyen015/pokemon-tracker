import { isValidElement, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './home.css'



function Logout(){
  //hooks have to be called at top of react functions/components not nested functions/conditions
  const navigate = useNavigate();

  function logoutSubmit() {

    // Remove tokens from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // Redirect to login page
    navigate('/login', { replace: true });
  }
  return <button onClick={logoutSubmit}>Logout</button>
}

function Home() {

  fetch('http://localhost:8000/api/hello/')
  .then(response => response.json())
  .then(data => console.log(data));


  

  //state htmlFor both the 1st & 2nd pokemon data (set to null originally)
  //pokedata will hold the data htmlFor the state
  //setPokedata updates the pokedata
  const [pokedata, setPokedata] = useState(null);
  const [pokedata2, setPokedata2] = useState(null);

  //useEffect htmlFor obtaining data from PokeAPI asynchronously
  //runs after component renders
  useEffect(() => {
    async function getPokemon(){

      //asynchronously grab the data htmlFor the pokemon
      const response = await fetch("https://pokeapi.co/api/v2/pokemon/salamence");
      const pokejson = await response.json();

      //2nd pokemon data
      const response2 = await fetch("https://pokeapi.co/api/v2/pokemon/blissey");
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
      //find the rounded percentage out of 150 htmlFor the width
      const barwidth = stat_value/150;
      rounded = Math.round(barwidth*100);
    }

    let color = "";

    //grab the color htmlFor the bar based on the value
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
  }
  
  function ReturnType({types}){

    console.log(types);

    if(types.length == 1){
      return (
      <>
        <div>{types[0]["type"]["name"]}</div>
      </>)
    }else{
      return(
      <>
        <div>{types[0]["type"]["name"]}/{types[1]["type"]["name"]}</div>
      </>)
      
    }
  
  }

  function Routes() {

    const[routedata, setRoute] = useState(null);

    useEffect(() => {

      async function getRoutes(){

        //asynchronously grab the data htmlFor the routes from a region
        const response = await fetch("https://pokeapi.co/api/v2/region/unova/");
        const all_routes = await response.json();

        setRoute(all_routes);

      }
      getRoutes();

    },[]);

      //use array to hold all locations
      let locations = [];

      if(routedata){
        locations = routedata.locations;
        //take the arguments of sort and overwrite for custom function for names
        locations = locations.sort((a,b) => {
          if(a.name < b.name)
            return -1
          if(a.name > b.name) 
            return 1;
          return 0;
        });
      }

      //map all location values to an index for iteration, then return option with the route name
      return (
        <>
        <select>
          {locations && locations.map((route, i) => <option key={i}>{route.name}</option>)}
        </select>
        </>
      );

  }

  return (
  //parent element (React Fragments) <> & </>:) 
  <>
  <div className="container">
    <Logout/>
    <div className="row">
      <div className="col-4 border">
        <div><span className="align-text-top"><h4>{pokedata.name}</h4></span></div>
        <ReturnType types={pokedata.types}/>
        <div><img src={pokedata["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"]} className="img-fluid sprite" /></div>
        <div className="d-flex flex-column align-items-bottom">
          <div className="row">
            <div className="col-3">HP</div>
            <div className="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata.stats[0].base_stat}/>
            </div>
            <div className="col-3 d-flex justify-content-start">{pokedata.stats[0].base_stat}</div>
          </div>
          <div className="row">
            <div className="col-3">Attack</div>
            <div className="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata.stats[1].base_stat}/>
            </div>
            <div className="col-3 d-flex justify-content-start">{pokedata.stats[1].base_stat}</div>
          </div>
          <div className="row">
            <div className="col-3">Defense</div>
            <div className="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata.stats[2].base_stat}/>
            </div>
            <div className="col-3 d-flex justify-content-start">{pokedata.stats[2].base_stat}</div>
          </div>
          <div className="row">
            <div className="col-3">Sp. Atk</div>
            <div className="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata.stats[3].base_stat}/>
            </div>
            <div className="col-3 d-flex justify-content-start">{pokedata.stats[3].base_stat}</div>
          </div>
          <div className="row">
            <div className="col-3">Sp. Def</div>
            <div className="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata.stats[4].base_stat}/>
            </div>
            <div className="col-3 d-flex justify-content-start">{pokedata.stats[4].base_stat}</div>
          </div>
          <div className="row">
            <div className="col-3">Speed</div>
            <div className="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata.stats[5].base_stat}/>
            </div>
            <div className="col-3 d-flex justify-content-start">{pokedata.stats[5].base_stat}</div>
          </div>
        </div>
      </div>
      <div className="col-4 border">
        <div><span className="align-text-top"><h4>{pokedata2.name}</h4></span></div>
        <ReturnType types={pokedata2.types}/>
        <div><img src={pokedata2["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"]} className="img-fluid sprite"/></div>
        <div className="d-flex flex-column align-items-bottom">
          <div className="row">
            <div className="col-3">HP</div>
            <div className="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata2.stats[0].base_stat}/>
            </div>
            <div className="col-3 d-flex justify-content-start">{pokedata2.stats[0].base_stat}</div>
          </div>
          <div className="row">
            <div className="col-3">Attack</div>
            <div className="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata2.stats[1].base_stat}/>
            </div>
            <div className="col-3 d-flex justify-content-start">{pokedata2.stats[1].base_stat}</div>
          </div>
          <div className="row">
            <div className="col-3">Defense</div>
            <div className="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata2.stats[2].base_stat}/>
            </div>
            <div className="col-3 d-flex justify-content-start">{pokedata2.stats[2].base_stat}</div>
          </div>
          <div className="row">
            <div className="col-3">Sp. Atk</div>
            <div className="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata2.stats[3].base_stat}/>
            </div>
            <div className="col-3 d-flex justify-content-start">{pokedata2.stats[3].base_stat}</div>
          </div>
          <div className="row">
            <div className="col-3">Sp. Def</div>
            <div className="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata2.stats[4].base_stat}/>
            </div>
            <div className="col-3 d-flex justify-content-start">{pokedata2.stats[4].base_stat}</div>
          </div>
          <div className="row">
            <div className="col-3">Speed</div>
            <div className="col-6" id="bar_handler">
              <Stat_Bar stat_value={pokedata2.stats[5].base_stat}/>
            </div>
            <div className="col-3 d-flex justify-content-start">{pokedata2.stats[5].base_stat}</div>
          </div>
        </div>
      </div>
      <div className="col-4 border">
        <form className="d-flex flex-column justify-content-start align-items-start" >
          <label htmlFor="pokemon1">Pokemon 1</label>
          <input type="text" id="pokemon1"></input>
          <label htmlFor="pokemon2"> Pokemon 2</label>
          <input type="text" id="pokemon2"></input>
          <label htmlFor="route"> Choose a Route</label>
            <Routes/>
          <input type="submit" value ="Enter" className="mt-2"></input>
        </form>
      </div>
    </div>
    <div className="row">
      <div className="col-8 border">
        <img src={pokedata["sprites"]["other"]["official-artwork"]["front_default"]} className="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
        <img src={pokedata["sprites"]["other"]["official-artwork"]["front_default"]} className="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/> 
        <img src={pokedata["sprites"]["other"]["official-artwork"]["front_default"]} className="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
        <img src={pokedata["sprites"]["other"]["official-artwork"]["front_default"]} className="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
        <img src={pokedata["sprites"]["other"]["official-artwork"]["front_default"]} className="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
        <img src={pokedata["sprites"]["other"]["official-artwork"]["front_default"]} className="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
      </div>
    </div>
    <div className="row">
      <div className="col-8 border">
        <img src={pokedata2["sprites"]["other"]["official-artwork"]["front_default"]} className="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
        <img src={pokedata2["sprites"]["other"]["official-artwork"]["front_default"]} className="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
        <img src={pokedata2["sprites"]["other"]["official-artwork"]["front_default"]} className="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
        <img src={pokedata2["sprites"]["other"]["official-artwork"]["front_default"]} className="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
        <img src={pokedata2["sprites"]["other"]["official-artwork"]["front_default"]} className="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
        <img src={pokedata2["sprites"]["other"]["official-artwork"]["front_default"]} className="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
      </div>
    </div>
  </div>
  </>
  )
}

export default Home
/*
*/