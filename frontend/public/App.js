import './App.css';
import { useEffect, useState, useMemo } from "react"; // useState for storing data and useEffect for changing data on click 
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

var closeValues = ["150.94"];
var stockTickers = ["MMM"];
let clients = [];
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
let portfolioStats = {};
for(let i = 0; i < stockPortfolio.length; i++){
  if(stockPortfolio[i] in portfolioStats){
    portfolioStats[stockPortfolio[i]]+=1;
  }
  else{
    portfolioStats[stockPortfolio[i]]=1;
  }
}

  function PortfolioElement({stockTicker, count, value}){
    return(<><div className = "grid"><span><strong>{stockTicker}</strong></span><span>{count}</span><span><strong className = "biggerText">${value}</strong></span></div>
    </>);
  }


  function TickerDisplay({closeVal, stockTicker}){
    if(typeof(closeVal)===undefined){
      closeVal="105.94"
    }
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
    <div>Ticker: {stockTicker} Value: ${parseFloat(closeVal.trim()).toFixed(2)}</div>
    <img src = {path} className = "images"/>
      <button className = "buyButton" onClick = {buy}>Buy</button>
      <button className = "sellButton" onClick = {sell}>Sell</button></div></>
      );
  }


  const [ text, setText ] = useState();

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

        let portfolioArray = [];
        let x = 0;
        for (const [key, value] of Object.entries(portfolioStats)) {
          let multiply = 0;
          if(typeof(closeValues[x])!==undefined){
            multiply = closeValues[x];
          }
          // portfolioArray.push([key, value, parseFloat(value)*parseFloat(multiply).toFixed(2)]);
          portfolioArray.push(<PortfolioElement stockTicker = {key} count = {value} value = {parseFloat(value)*parseFloat(multiply).toFixed(2)}/>);
          console.log("Key value pair: ", [key, value, value*closeValues[x+1]]);
          console.log("portfolio array: ", portfolioArray);
          x += 1;
        }
        portfolioArray = portfolioArray.slice(1,);
        
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

  let acceptedClients = {};
function ClientComponent({clientName, desiredReturns, dueDate, givenMoney}){
  const [bgC, setBGC] = useState("");
  const [vB, setVB] = useState("visible");
  function acceptClient(){
    acceptedClients[clientName]=[desiredReturns, dueDate, givenMoney];
    console.log(acceptedClients);
    setBGC("red");
    setVB("hidden");
    setMoney(money+givenMoney);
  }

  return(<>
    <div className = "clientComponent" style={{backgroundColor:bgC}}>
    <div><strong>{clientName}</strong></div>
    <div>Desired % APY: {desiredReturns}%</div>
    <div>Due In {dueDate} Days</div>
    <div>${givenMoney}</div>
    <div style={{visibility:vB}}>
    <button className = "acceptButton" onClick = {acceptClient}>Accept</button><button className = "declineButton">Decline</button>
    </div></div>
    </>);
}


function Clients(){
  if(clients.length!=3){
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
    let desiredReturn = Math.floor(Math.random() * (5));
    let DueDate = Math.floor(Math.random() * (50)+50);
    let givenMoneys = Math.floor(Math.random() * (10)*1000);
    let clientName = clientNames[Math.floor(Math.random()*26)];
    clients.push(<ClientComponent clientName = {clientName} desiredReturns = {desiredReturn} dueDate = {DueDate} givenMoney = {givenMoneys}/>)
  }
}
  return(<>{clients}</>);
}

  if(true){
  return(
  <><NavBar/><div class="container">
  <div class="column firstColumn">
    <h2> User: {name}</h2>
  <p>Money: ${money.toFixed(2)}</p>
  <h2>Portfolio: </h2>
  <div className = "spacing"></div>
  {portfolioArray.map((item, index) => <div className = "grid">{item}</div>)}
  </div>
  <div class="column" >
  <h2> Stocks </h2>
  <ul>
{filterData && filterData.map((item, index) => <li>{item}</li>)}
</ul>
<ReactPaginate
  containerClassName={"pagination"}
  pageClassName={"page-item"}
  activeClassName={"active"}
  className = "graphs"
  onPageChange={(event) => setPage(event.selected)}
  pageCount={Math.ceil(rows.length / n)}
  breakLabel="."
  previousLabel={
    "←"
  }
  nextLabel={
    "→"
  }
/>

  </div>

  <div class="column">
    <h2> Clients </h2>
    <Clients/>

  </div>
</div> </>);}
}




function App() {

  return (
    <>
    <Control displayLogin={true} />
  </>
  );
}

export default App;