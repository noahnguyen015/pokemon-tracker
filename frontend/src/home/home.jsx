import { isValidElement, useEffect, useState, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import './home.css'

function Logout(){
  //hooks have to be called at top of react functions/components not nested functions/conditions
  const navigate = useNavigate();

  function logoutSubmit() {

    // Remove tokens from localStorage
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');

    // Redirect to login page
    navigate('/login', { replace: true });
  }
  return <button onClick={logoutSubmit}>Logout</button>
}

function Home() {

  //for the form, setting up link
  const [linkData, setLinkData] = useState({ pokemon1: '', 
                                             pokemon2: '', 
                                             route: 'abundant-shrine'});
  const [message, setMessage] = useState('');
  
  //all the existing links :)
  const[soulData, setSoulData] = useState([]);


  //JWT is stateless, so server doesn't remember who is logged in, so send tokens in request to know who is logged in
  let accesstoken = localStorage.getItem('access');

  //handlechange takes object e as argument, comes from a input field
  //setformdata in the function, state setter function to update formData
  //{} creates new object, with:
  //spread operator ..., copying all key-value pairs from currentformData object
  //[e.target.name]: e.target.value overwrites or adds property in object
  //e.target.name is name of attribute triggering the event
  //e.target.value is current value of input field (what has been typed)

  const handleChange = e => {
    //destructuring
    const {name, value} = e.target //map two variables name and value to e.target (which is the DOM element <input>/<select> where event occured) (e.target has .name and .value)
    setLinkData({...linkData, [name] : value });
  };


  //refresh the access token using the refreshtoken 
  async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh');

    if (!refreshToken) {
      throw new Error("No refresh token found in localStorage.");
    }

    const response = await fetch('http://localhost:8000/api/token/refresh/', {
      method: 'POST',      
      body: JSON.stringify({ refresh: refreshToken }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token. Possibly expired.");
    }

    const data = await response.json();
    localStorage.setItem('access', data.access); // ⬅️ Store new access token
    return data.access;
  }

  function getSoulLink() {

  async function getLinkData(){

    let response3 = await fetch('http://localhost:8000/api/soullink/', {
    headers: {'Authorization': `Bearer ${accesstoken}`,  
    },
    });
    //const soulLinks = await response3.json();
    //setSoulData(prevLinks => [...prevLinks, soulLinks]);

    if(response3.status === 401) {
            // Try to refresh and retry
      try {
        accesstoken = await refreshAccessToken();

        const retry = await fetch('http://localhost:8000/api/soullink/', {
          headers: {'Authorization': `Bearer ${accesstoken}`,},
        });
        //return the retry, meaning response = retry once it refreshes the token and tries again
        const tryAgain = await retry.json();
        
        if(retry.ok){
          setSoulData(tryAgain);
        }
      } catch (err) {
          console.error("Token refresh failed.");
          throw err;
      }
    }
    const soulLinks = await response3.json();

    if(response3.ok){
      setSoulData(soulLinks);
    }
  }

    getLinkData();
  }



  //handleSubmit is arrow function taking e as parameter, it's an event object to represent the submission
  //async means the function will use await 
  const handleSubmit = async e => {
    //prevent page reload
    e.preventDefault()

    console.log(accesstoken)
    console.log(linkData)

    const response = await fetch('http://localhost:8000/api/soullink/', {
      method: 'POST',
      body: JSON.stringify(linkData),
      headers: { 'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accesstoken}`,  
      },
    });      
    
    if (response.status === 401) {

      // Try to refresh and retry
      try {
        accesstoken = await refreshAccessToken();

        const retry = await fetch('http://localhost:8000/api/soullink/', {
          method: 'POST',
          body: JSON.stringify(linkData),
          headers: { 'Content-Type': 'application/json',
                      'Authorization': `Bearer ${accesstoken}`,  
          },
        });

        return retry;
      } catch (err) {
        console.error("Token refresh failed.");
        throw err;
      }
    }

    const reply = await response.json();

    //successful post 
    if (response.ok) {
      //grabs the previous state of setLinkData (first from the GET request and any subsequent POST)
      setSoulData(prevLinks => [...prevLinks, reply.data])
      setMessage(reply.message); // "soullink successful message"
      console.log(reply.data);
    } else {
      //display error if didn't work
      setMessage('Registration failed: ' + JSON.stringify(reply));
    }
  };

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

    //call the async function on render
    getPokemon();
    getSoulLink();

  },[]);

  //if(soulData.length != 0)
  //  console.log(soulData);

  if(!pokedata) return <p>Loading ..</p>;

  //console.log(pokedata);
  //console.log(pokedata2);


  function ShowPair(){

    const[allLinks, setallLinks] = useState([]);

    async function fetchPokemon(pokemon_name1, pokemon_name2, route){

      const res1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon_name1}`);
      const pokemon1 = await res1.json();

      const res2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon_name2}`);
      const pokemon2 = await res2.json();

      return {pokemon1, pokemon2, route};
      
    }

    useEffect(() => {

    async function handlePokemon(){

      let tempLinks = [];

      for(const soullink of soulData){
        const pokedata = await fetchPokemon(soullink.pokemon1, soullink.pokemon2, soullink.route);
        tempLinks.push(pokedata);
      }

      setallLinks(tempLinks);
    }

      handlePokemon();
    },[]);

    return (
      <>
        {allLinks && allLinks.map((link, i) => 
        <div key ={i} value={link}>
          <img src={link["pokemon1"]["sprites"]["versions"]["generation-viii"]["icons"]["front_default"]}/>
          {link.route} 
          <img src={link["pokemon2"]["sprites"]["versions"]["generation-viii"]["icons"]["front_default"]}/>
        </div>
        )}
      </>);

  }


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
        <select name="route" value={linkData.route} onChange={handleChange}>
          {locations && locations.map((route) => <option key={route.name} value={route.name}>{route.name}</option>)}
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
        <form className="d-flex flex-column justify-content-start align-items-start" onSubmit={handleSubmit}>
          <label htmlFor="pokemon1" onChange={handleChange} required>Pokemon 1</label>
          <input type="text" id="pokemon1" name="pokemon1" value={linkData.pokemon1} onChange={handleChange} required></input>
          <label htmlFor="pokemon2"> Pokemon 2</label>
          <input type="text" id="pokemon2" name="pokemon2" value={linkData.pokemon2} onChange={handleChange} required></input>
          <label htmlFor="route"> Choose a Route</label>
            <Routes/>
          <input type="submit"className="mt-2" value="Enter"></input>
        </form>
        <div>{message}</div>
        <ShowPair/>
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