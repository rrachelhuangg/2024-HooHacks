import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react"; // useState for storing data and useEffect for changing data on click 
import * as React from 'react';
import ReactPaginate from "react-paginate"; // for pagination

//can read .csv file data and display it on the page: if we write data that we collect from the api to a csv
//file, we will be able to use it in react 

function NavBar(){
  return(<>
  <ul className = "header">
  <li><img src = "./Logo.png" className="logoHeader"/></li>
</ul></>);
}

let acceptedClients = {};
function ClientComponent({clientName, desiredReturns, dueDate, givenMoney}){
  const [bgC, setBGC] = useState("");
  const [vB, setVB] = useState("visible");
  function acceptClient(){
    acceptedClients[clientName]=[desiredReturns, dueDate, givenMoney];
    setBGC("red");
    setVB("hidden");
  }


  return(<>
    <div className = "clientComponent" style={{backgroundColor:bgC}}>
    <div><strong>{clientName}</strong></div>
    <div>Desired Returns: {desiredReturns}</div>
    <div>Due In {dueDate} Days</div>
    <div>Provided Money: {givenMoney}</div>
    <div style={{visibility:vB}}>
    <button className = "acceptButton" onClick = {acceptClient}>Accept</button><button className = "declineButton">Decline</button>
    </div></div>
    </>);
}


var closeValues = [];
var stockTickers = [];
var stockz = ["MMM","AOS","ABT","ACN","AMD","AES","AFL","APD","ALB","ARE","LNT","ALL","AEE","AAL","AEP","AXP","AIG","AMT"];
//AMD is the last png obtained
function Control(props) {
const [displayLogin, setLogin] = useState(props.displayLogin);
const [name, setName] = useState("");
const [money, setMoney] = useState(1000);
const [stockPortfolio, setStockPortfolio] = useState([]);
const [page, setPage] = useState(0);
const [filterData, setFilterData] = useState();
const n = 1;

  function TickerDisplay({closeVal, stockTicker}){
    function buy(){
      if(money-parseFloat(closeVal.trim())>=0){
        setStockPortfolio([...stockPortfolio, " ", stockTicker]);
        setMoney(money-parseFloat(closeVal.trim()));
      }
    }
    function sell(){
      var temp = stockPortfolio;
      if(temp.filter(s => s !== stockTicker).length!=(stockPortfolio.length)){
        setMoney(money+parseFloat(closeVal.trim()));
      }
      setStockPortfolio(stockPortfolio.filter(s => s !== stockTicker));
    }
    var path = "./";
    if(stockTicker!==undefined){
      path += stockTicker.trim();
    }
    else{
      path += "MMM";
    }   
    path += ".png";

    return(<>
    <div className = "tickerContainer">
    <div>{stockTicker}:${closeVal}</div>
    <img src = {path} className = "images"/>
      <button className = "buyButton" onClick = {buy}>Buy</button>
      <button className = "sellButton" onClick = {sell}>Sell</button></div></>
      );
  }

  const [ text, setText ] = useState();
  const [dueDisplay, setDueDisplay] = useState(true);
  function toggleDueDisplay(){
    setDueDisplay(!dueDisplay);
  }
  const[dueCurrent, setCurrentDisplay] = useState(false);
  function toggleCurrentDisplay(){
    setCurrentDisplay(!dueCurrent);
  }

    fetch( './graph_data.csv' )
        .then( response => response.text() )
        .then( responseText => {
            setText(responseText.slice(0, 2000));
            for(var i = 0; i < responseText.length; i++){
              if(stockz.includes(responseText.slice(i,i+3).trim())){
                stockTickers.push(responseText.slice(i,i+3).trim());
                var j = 0;
              }//need to slice close values correctly
              if(responseText.charAt(i)==']' && j==0){
                var idx = responseText.slice(i-10,i-1).lastIndexOf(' ');
                closeValues.push(responseText.slice(i-8,i).trim());
                j += 1 //only want the first closing bracket for each stock ticker
                //get stock ticker for this close value and pass it to TickerDisplay
              }
            }
        })
        
        const rows = [];
        for (let i = 0; i < 500; i++) {
            rows.push(<TickerDisplay index={i+1} closeVal={closeValues[i]} stockTicker={stockTickers[i]} />); //instead of passing i value, pass stock close value when ready
        }

        useEffect(() => {
          setFilterData(
            rows.filter((item, index) => {
              return (index >= page * n) & (index < (page + 1) * n);
            })
          );
        }, [page]);
  
  const handleSubmit = (event) => {
    setLogin(false);
  }

  function Clients(){
    let clients = [];
    for(let i = 0; i < 3; i++){
      let clientNames = [
        "Innovatech Solutions",
        "TechGenius",
        "CodeCrafters Inc.",
        "ByteWorks Technology",
        "DigitalDreams Tech",
        "NexTech Innovations",
        "CyberNest Solutions",
        "QuantumLeap Tech",
        "Synapse Systems",
        "CloudSavvy Tech",
        "FutureForge Technologies",
        "InfinitiTech Labs",
        "DataDynamo",
        "Streamline Solutions",
        "PixelPulse Technology",
        "TechTonic Innovations",
        "InnovaSoft",
        "ByteBurst Tech",
        "Visionary Ventures Inc.",
        "CodeWave Tech",
        "InfiniteLoop Solutions",
        "TechSphere Innovations",
        "DataDynasty",
        "CyberCrafters Inc.",
        "QuantumShift Technology"
    ]
    ;
      let desiredReturn = Math.floor(Math.random() * (100));
      let DueDate = Math.floor(Math.random() * (100));
      let givenMoneys = Math.floor(Math.random() * (100));
      let clientName = clientNames[Math.floor(Math.random()*26)];
      clients.push(<ClientComponent clientName = {clientName} desiredReturns = {desiredReturn} dueDate = {DueDate} givenMoney = {givenMoneys}/>)
    }
    
    return(<>{clients}</>);
  }
  //scuffed way of redirecting after login (toggles login stuff)
  if (displayLogin) {
    return(<>
      <div className = "logoContainer"><img src = "./Logo.png" className="logo"/></div>
    <form className = "loginPage" onSubmit={handleSubmit}>
      <div><label>Enter your name:</label></div>
        <input 
          type="text" 
          value={name}
          onChange={(e) => {setName(e.target.value);
          }}
        />
      <div><input className = "inputField" type="submit" /></div>
    </form></>);
  }

  if(dueDisplay){
  return(
  <><NavBar/><div class="container">
  <div class="column">
    <h2> {name}'s current stats </h2>
  <p>Money: ${money}</p>
  <p>Portfolio: {stockPortfolio}</p>
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
    <h2> Clients </h2>
    <div className = "clientButtons">
    <button className = "clientButton" onClick = {toggleDueDisplay}>Client Information</button>

    <Clients/>
    
    {/* <ClientComponent clientName="Hello" desiredReturns="0" dueDate="0" givenMoney="0"/>
    <ClientComponent clientName="Hello" desiredReturns="0" dueDate="0" givenMoney="0"/>
    <ClientComponent clientName="Hello" desiredReturns="0" dueDate="0" givenMoney="0"/> */}
    </div>
  </div>
</div> </>);}
else if(dueDisplay==false){
  return(
    <><NavBar/><div class="container">
    <div class="column">
      <h2> {name}'s current stats </h2>
    <p>Money: ${money}</p>
    <p>Portfolio: {stockPortfolio}</p>
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
      <h2> Clients </h2>
      <div className = "clientButtons">
      <button className = "clientButton" onClick = {toggleDueDisplay}>Client Information</button>
      </div>
    </div>
  </div> </>);
}
}

function App() {

  return (
    <>
    <Control displayLogin={true} />
  </>
  );
}

export default App;