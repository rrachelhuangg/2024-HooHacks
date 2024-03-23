import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react"; // useState for storing data and useEffect for changing data on click 
import * as React from 'react';
import ReactPaginate from "react-paginate"; // for pagination
import styled from "styled-components";
import { Router, Route, Routes, useNavigate } from "react-router-dom";
import { RequireAuth } from "react-auth-kit";
import ReactDOM from 'react-dom/client';
import { saveAs } from 'file-saver';

//can read .csv file data and display it on the page: if we write data that we collect from the api to a csv
//file, we will be able to use it in react 

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`;


function TickerDisplay(){
  return(<>
  <div className = "tickerContainer">
  <img src = "./AppleFirstTest.png" className = "images"/>
    <button className = "buyButton">Buy</button>
    <button className = "sellButton">Sell</button></div></>
    );
}

function NavBar(){
  return(<>
  <ul className = "header">
  <li><a href="default.asp">Home</a></li>
  <li><a href="news.asp">News</a></li>
  <li><a href="contact.asp">Contact</a></li>
  <li><a href="about.asp">About</a></li>
</ul></>);
}

function Control(props) {
  const [page, setPage] = useState(0);
  const [filterData, setFilterData] = useState();
  const n = 1;

  const [ text, setText ] = useState();

    fetch( './constituents.csv' )
        .then( response => response.text() )
        .then( responseText => {
            setText(responseText.slice(0, 100));
        })

        const rows = [];
        for (let i = 0; i < 500; i++) {
            rows.push(<TickerDisplay />);
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
    // const userName = JSON.stringify({name});
    // const blob = new Blob([{name}], { type: "text/plain" });
    // const url = URL.createObjectURL(blob);
    // const link = document.createElement("a");
    // link.download = "Users.json";
    // link.href = url;
    // link.click();
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
  </div>
</div> </>);
}

function App() {

  return (
    <>
    <Control displayLogin={true} />
    {/* <NavBar/>
    <div class="container">
  <div class="column">
    <h2> User's current stats </h2>
  <p> money</p>
  <p> stocks they hold</p>
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
  </div>
</div> */}
  </>
  );
}

export default App;