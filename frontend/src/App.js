import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react"; // useState for storing data and useEffect for changing data on click 
import * as React from 'react';
import ReactPaginate from "react-paginate"; // for pagination
import styled from "styled-components";
import mpld3_load_lib from "./mpld3_load_lib";
import mpld3 from 'mpld3'
import _json from "./plot_b.json"

//can read .csv file data and display it on the page: if we write data that we collect from the api to a csv
//file, we will be able to use it in react 

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`;




function NavBar(){
  return(<>
  <ul className = "header">
  <li><a href="default.asp">Home</a></li>
  <li><a href="news.asp">News</a></li>
  <li><a href="contact.asp">Contact</a></li>
  <li><a href="about.asp">About</a></li>
</ul></>);
}

function MatPlotLibFig(){
  const fig_name = "fig_el427345810798888193429725"
  return <div>
    <script>
      mpld3_load_lib("https://d3js.org/d3.v5.js", function () {
        mpld3_load_lib("https://mpld3.github.io/js/mpld3.v0.5.8.js", function () {
          mpld3.remove_figure(fig_name)
          mpld3.draw_figure(fig_name, _json);
        })
      });
    </script>
    <div id={fig_name}></div>
  </div>
}

function TickerDisplay({value}){
  return(<>
  <div className = "tickerContainer">
  <div>{value}</div>
  <img src = "./AppleFirstTest.png" className = "images"/>
    <button className = "buyButton">Buy</button>
    <button className = "sellButton">Sell</button></div></>
    );
}

function Control(props) {
  const [page, setPage] = useState(0);
  const [filterData, setFilterData] = useState();
  const n = 1;

  const [ text, setText ] = useState();
  var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    fetch( './graph_data.csv' )
        .then( response => response.text() )
        .then( responseText => {
            setText(responseText.slice(0, 1000));
            for(var i = 0;i < responseText.length; i++) {
             if(letters.includes(responseText.charAt(i).toUpperCase())){
                console.log("ticker found"); //goal: get close values for each stock
                console.log(responseText.charAt(i));
                break;
             }
             
            };
        })
    
        
        

        const rows = [];
        for (let i = 0; i < 500; i++) {
            rows.push(<TickerDisplay value={i+1} />);
        }

        useEffect(() => {
          setFilterData(
            rows.filter((item, index) => {
              return (index >= page * n) & (index < (page + 1) * n);
            })
          );
        }, [page]);
  const [displayLogin, setLogin] = useState(props.displayLogin);
  const [name, setName] = useState("");
  const [money, setMoney] = useState(0);
  const [stocks, setStocks] = useState([]);
  const handleSubmit = (event) => {
    setLogin(false);
  }
  //scuffed way of redirecting after login (toggles login stuff)
  if (displayLogin) {
    return(
    <form className = "loginPage" onSubmit={handleSubmit}>
      <div><label>Enter your name:</label></div>
        <input 
          type="text" 
          value={name}
          onChange={(e) => {setName(e.target.value);
          }}
        />
      <div><input className = "inputField" type="submit" /></div>
    </form>);
  }
  
  return(<><NavBar/><div class="container">
  <div class="column">
    <h2> {name}'s current stats </h2>
  <p>Money: {money}</p>
  <p>Portfolio: {stocks}</p>
  </div>
  <div class="column" style={{ height: '100vh', overflow: 'scroll' }}>
  <h2> stock visualizations </h2>
  <ul>
{filterData && filterData.map((item, index) => <li>Stock Ticker:{item}</li>)}
</ul>
<ReactPaginate
  containerClassName={"pagination"}
  pageClassName={"page-item"}
  activeClassName={"active"}
  className = "graphs"
  onPageChange={(event) => setPage(event.selected)}
  pageCount={Math.ceil(rows.length / n)}
  breakLabel="..."
  previousLabel={
    "<"
  }
  nextLabel={
    ">"
  }
/>


  </div>
  <div class="column">
    <h2> other info </h2>
    <pre>{ text }</pre>
    {/* <MatPlotLibFig/> */}
  </div>
</div> </>);
}

function App() {

  return (
    <>
    <Control displayLogin={true} />
  </>
  );
}

export default App;