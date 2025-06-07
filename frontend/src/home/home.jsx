import React, { isValidElement, useEffect, useState, memo, useMemo, useCallback } from 'react'
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
  /*
  const [linkData, setLinkData] = useState({ pokemon1: '', 
                                             pokemon2: '', 
                                             route: 'abundant-shrine'});
  */
  const [message, setMessage] = useState('');
  let done = false;
  
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

  /*
  const handleChange = e => {
    //destructuring
    const {name, value} = e.target //map two variables name and value to e.target (which is the DOM element <input>/<select> where event occured) (e.target has .name and .value)
    setLinkData({...linkData, [name] : value });
  };
  */


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

  //get the components for the form
  const SL_Inputs = ({ type, label, name, value, onChange, RoutesComponent }) => {

    if(type === "select"){
      return (<>
        <label htmlFor={name}>{label}</label>
        <RoutesComponent />
      </>
      );
    }
    if(type === "submit"){
      return <input type="submit" className="mt-2" value="Enter"></input>
    }

    return(<>
      <label htmlFor={name}>{label}</label>
      <input type="text" id={name} name={name} value={value} onChange={onChange} required></input>
    </>
    );
  }

  //external components, use memo
  const Memo_SL_Input = memo(SL_Inputs);

  function SL_Form(){
  
  
    //for the form, setting up link
    const [linkData, setLinkData] = useState({ pokemon1: '', 
                                              pokemon2: '', 
                                              route: 'abundant-shrine'});
  
    const handleChange = useCallback((e) => {
    //destructuring
    const {name, value} = e.target //map two variables name and value to e.target (which is the DOM element <input>/<select> where event occured) (e.target has .name and .value)
    setLinkData(linkData => ({...linkData, [name] : value }));
    }, []);


    const handleSubmit = async e => {
      //prevent page reload
      e.preventDefault()

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

          const TryAgain = await retry.json();

          if(retry.ok)
            setSoulData(prevLinks => [...prevLinks, TryAgain.data]);

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
    
    //used to make sure not to render unless the routes itself changes
    //useCallback makes sure the identity stays same across render unless changes in items in array
    //used for form handlers and callbacks
    const Routes = useCallback(function Routes() {

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
        <select name="route" value={linkData.route} onChange={handleChange} required>
          {locations && locations.map((route) => <option key={route.name} value={route.name}>{route.name}</option>)}
        </select>
        </>
      );
    }, [linkData.route, handleChange]);

    return (
    <>
    <form className="d-flex flex-column justify-content-start align-items-start" onSubmit={handleSubmit}>
      <Memo_SL_Input
        type="text"
        label="Pokemon 1"
        name="pokemon1"
        value={linkData.pokemon1}
        onChange={handleChange}
      />
      <Memo_SL_Input
        type="text"
        label="Pokemon 2"
        name="pokemon2"
        value={linkData.pokemon2}
        onChange={handleChange}
      />
      <Memo_SL_Input
        type="select"
        label="Choose A Route"
        name="route"
        //send a prop over to SL_Input
        RoutesComponent={Routes}
      />
      <Memo_SL_Input
        type="submit"
      /> 
    </form>
    </>
    );
  }

  //state htmlFor both the 1st & 2nd pokemon data (set to null originally)
  //pokedata will hold the data htmlFor the state
  //setPokedata updates the pokedata
  const [pokedata, setPokedata] = useState(null);
  const [pokedata2, setPokedata2] = useState(null);
  const [poketype, setPoketype] = useState(null);
  const [poketype2, setPoketype2] = useState(null);
  const [name1, setname1] = useState(null);
  const [name2, setname2] = useState(null);

  //useEffect htmlFor obtaining data from PokeAPI asynchronously
  //runs after component renders
  useEffect(() => {
    async function getPokemon(){

      if(name1 && name2){
        //asynchronously grab the data htmlFor the pokemon
        //FOR GENERAL INFORMATION OF POKEMON
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name1}`);
        const pokejson = await response.json();

        //2nd pokemon data
        const response2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${name2}`);
        const pokejson2 = await response2.json();

        let typelist = [];
        let typelist2 = [];

        //GET TYPING INFORMATION FOR BOTH POKEMON
        for (const type of pokejson["types"]){
          const typechart = await fetch(type["type"]["url"]);
          const typejson = await typechart.json();
          
          //new variable each loop, objects passed by reference, so clearing it = all point to same object
          let typeinfo = {name: typejson["name"],
                          damage_relations: typejson["damage_relations"],
                          sprites: typejson["sprites"],
                         };

          typelist.push(typeinfo);
        }

        for (const type of pokejson2["types"]){
          const typechart2 = await fetch(type["type"]["url"]);
          const typejson2 = await typechart2.json();

          let typeinfo2 = {name: typejson2["name"],
                           damage_relations: typejson2["damage_relations"],
                           sprites: typejson2["sprites"],
                         };

          typelist2.push(typeinfo2);
        }
        //use the state variable
        setPokedata(pokejson);
        setPokedata2(pokejson2);

        setPoketype(typelist);
        setPoketype2(typelist2);
      }
    }

    //call the async function on render
    if(name1 && name2){
      getPokemon();
    }
      getSoulLink();

  },[name1, name2]);

  //if(!pokedata) return <p>Loading ..</p>;


  //memo -> skips re-rendering if no changes, useMemo -> memoizes result of function
  //useMemo caches a value, and recalculate ONLY when it changes
  //keeps a stable version of an object across renders
    //by using useMemo, it's created once and is maintained for any other renders until a change
    //just memo will create a new version of the same component on each render
  //useMemo makes sure to return the memoized component, so React sees the same component every time, 
    //useMemo: memoize for function and or component when also inside another component
  //and memo makes it so it only changes based on props ({})
  const ShowPair = useMemo(() => memo(({soulData}) => {

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
      //create a temporary array in the useEffect, and it is guranteed to run once, so no stale or duplicate data is called :)
      let tempLinks = [];

      //use for... of... loop to deal with async sequentially
      for(const soullink of soulData){
        const pokedata = await fetchPokemon(soullink.pokemon1, soullink.pokemon2, soullink.route);
        tempLinks.push(pokedata);
      }

      setallLinks(tempLinks);
    }

      handlePokemon();
    },[soulData]);

    return (
      <>  
          {allLinks && allLinks.map((link, i) => 
          <div key ={i} value={link} className="list" onClick={() => SL_ChangeDuo(link["pokemon1"]["name"], link["pokemon2"]["name"])}>
            <img src={link["pokemon1"]["sprites"]["versions"]["generation-viii"]["icons"]["front_default"]}/>
            {link.route} 
            <img src={link["pokemon2"]["sprites"]["versions"]["generation-viii"]["icons"]["front_default"]}/>
          </div>
        )}
      </>);

  }), []);

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

    //console.log(types);

    if(types.length == 1) {

      return (
      <>
        <div><img className="type"src={types[0]["sprites"]["generation-v"]["black-2-white-2"]["name_icon"]}/></div><br/>
      </>)
    }else {

      return(
      <>
        <div><img className="type" src={types[0]["sprites"]["generation-v"]["black-2-white-2"]["name_icon"]}/><img className="type" src={types[1]["sprites"]["generation-v"]["black-2-white-2"]["name_icon"]}/></div><br/>
      </>)
      
    }
  
  }

  function SL_Display({data, type}){

    console.log(type);

    return (
    <>
      <div><span className="align-text-top"><h4>{data.name}</h4></span></div>
      <ReturnType types={type}/>
      <div><img src={data["sprites"]["versions"]["generation-v"]["black-white"]["animated"]["front_default"]} className="img-fluid sprite" /></div>
      <div className="d-flex flex-column align-items-bottom">
        <div className="row">
          <div className="col-3">HP</div>
          <div className="col-6" id="bar_handler">
            <Stat_Bar stat_value={data.stats[0].base_stat}/>
          </div>
          <div className="col-3 d-flex justify-content-start">{data.stats[0].base_stat}</div>
        </div>
        <div className="row">
          <div className="col-3">Attack</div>
          <div className="col-6" id="bar_handler">
            <Stat_Bar stat_value={data.stats[1].base_stat}/>
          </div>
          <div className="col-3 d-flex justify-content-start">{data.stats[1].base_stat}</div>
        </div>
        <div className="row">
          <div className="col-3">Defense</div>
          <div className="col-6" id="bar_handler">
            <Stat_Bar stat_value={data.stats[2].base_stat}/>
          </div>
          <div className="col-3 d-flex justify-content-start">{data.stats[2].base_stat}</div>
        </div>
        <div className="row">
          <div className="col-3">Sp. Atk</div>
          <div className="col-6" id="bar_handler">
            <Stat_Bar stat_value={data.stats[3].base_stat}/>
          </div>
          <div className="col-3 d-flex justify-content-start">{data.stats[3].base_stat}</div>
        </div>
        <div className="row">
          <div className="col-3">Sp. Def</div>
          <div className="col-6" id="bar_handler">
            <Stat_Bar stat_value={data.stats[4].base_stat}/>
          </div>
          <div className="col-3 d-flex justify-content-start">{data.stats[4].base_stat}</div>
        </div>
        <div className="row">
          <div className="col-3">Speed</div>
          <div className="col-6" id="bar_handler">
            <Stat_Bar stat_value={data.stats[5].base_stat}/>
          </div>
          <div className="col-3 d-flex justify-content-start">{data.stats[5].base_stat}</div>
        </div>
        <div>
        </div>
      </div>
    </>
    );
  }

  function SL_Team({data}){

    return(
    <>
      <div className="row">
        <div className="col-8 border">
          <img src={data["sprites"]["other"]["official-artwork"]["front_default"]} className="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
          <img src={data["sprites"]["other"]["official-artwork"]["front_default"]} className="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/> 
          <img src={data["sprites"]["other"]["official-artwork"]["front_default"]} className="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
          <img src={data["sprites"]["other"]["official-artwork"]["front_default"]} className="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
          <img src={data["sprites"]["other"]["official-artwork"]["front_default"]} className="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
          <img src={data["sprites"]["other"]["official-artwork"]["front_default"]} className="img-fluid sprite2 rounded-circle border2 px-2 py-2 mx-2"/>
        </div>
      </div>
    </>
    );
  }

  function SL_ChangeDuo(duo1, duo2){

    setname1(duo1);
    setname2(duo2);
  }

  function Types(){

  }

  return (
  //parent element (React Fragments) <> & </>:) 
  <>
  <div className="container">
    <div><Logout/></div><br/>
    <div className="row">
      <div className="col-4 border">
        {(name1 && name2 && pokedata && poketype) ? <SL_Display data={pokedata} type={poketype}/> : <p>No Data</p>}
      </div>
      <div className="col-4 border">
        {(name1 && name2 && pokedata2 && poketype2) ? <SL_Display data={pokedata2} type={poketype2}/> : <p>No Data</p>}
      </div>
      <div className="col-4 border">
        <SL_Form/>    
        <div>{message}</div>
        <div id="list_scroll">
        {soulData ? <ShowPair soulData={soulData}/> : <p>No Links Exists</p>}
        </div>
      </div>
    </div>
    <p>No Pokemon Selected for Trainer1</p>
    <p>No Pokemon Selected for Trainer2</p>
  </div>
  </>
  )
}

export default Home
/*
*/

  /*
        <label htmlFor="pokemon1">Pokemon 1</label>
      <input type="text" id="pokemon1" name="pokemon1" value={linkData.pokemon1} onChange={handleChange} required></input>
      <label htmlFor="pokemon2"> Pokemon 2</label>
      <input type="text" id="pokemon2" name="pokemon2" value={linkData.pokemon2} onChange={handleChange} required></input>
      <label htmlFor="route"> Choose a Route</label>
        <Routes/>
      <input type="submit"className="mt-2" value="Enter"></input>
  */