import {useState, useEffect } from 'react'
import * as React from 'react';

import { SparkLineChart,LineChart } from '@mui/x-charts';

import './App.css';

import errorLogo from '../src/assets/error-icon.png';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import CircularProgress from '@mui/material/CircularProgress';
import {InputLabel,MenuItem,FormControl,Select} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Icon from '@mui/material/Icon';
import Stack from '@mui/material/Stack';

import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import TelegramIcon from '@mui/icons-material/Telegram';
import RedditIcon from '@mui/icons-material/Reddit';
import LanguageIcon from '@mui/icons-material/Language';
import GitHubIcon from '@mui/icons-material/GitHub';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ForumIcon from '@mui/icons-material/Forum';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';


function App(){

    const [timer, setTimer] = useState(0);

    //gestire la funzione che scarica il grafico e quella che scarica i dati della criptovaluta in modo separato.
    const [errorCoin, setErrorCoin] = useState(null)
    const [errorChartCoin,setErrorChartCoin] = useState(null)
    const [errorConnection, setErrorConnection] = useState(null)
    const [InProgess, setInProgress] = useState(null)

    const [ReadyCoin, setReadyCoin] = useState(null)
    const [ReadyChartCoin, setReadyChartCoin] = useState(null)
    

    //console.log("rendering pagina")
    const[history, setHistory]=useState([]);
    const[time, setTime]=useState([]);
    const[changeData, setChangeData]=useState('');
    const[coinData,setCoinData]=useState(null);
    const[coinDataLinks,setCoinDataLinks]=useState(null);
    const[coinList, setCoinList] = useState([]);

    const[ChartPeriod, setChardPeriod]=useState('24h')//settarlo di default su 24h
    const[IdCoin, setIdCoin]=useState("Qwsogvtv82FCd")// default setting bitcoin id code 

    const isMobile = window.innerWidth <= 768;
    const[i, setI]=useState(0)
    const[y, setY]=useState(isMobile? 3 : 9)

    
    let sparkLineNumber;



    const changeChartPeriod = (event) => {
        setChardPeriod(event.target.value);
      };

    const options= {method: "GET", Headers: {
        'Content-Type': 'application/json',
        'x-access-token:': 'coinrankingee224b7b7075079f4747a5ba3b93cb3884bdcfe0c213d28d',
    }}


    async function getSparkLineChartData(){
        
        setErrorChartCoin(null)
        setReadyChartCoin(false)
        setInProgress(true)

        try{
            if (!navigator.onLine){
              throw new Error('you are offline');
            }

            let Phistory=[]
            let Ptime=[]
            let Lcoin=[]

            await fetch(`https://api.coinranking.com/v2/coin/${IdCoin}/history?timePeriod=${ChartPeriod}`,options)
            .then(response => { 
                if (response.status==429){
                    throw new Error('Unable to download chart data')
                };
                return response.json()}
            )
            .then(json => {
                console.log("json getSparkLineChartData",json);
                setChangeData(json.data.change);
                json.data.history.map(value=>{
                    if (value.price!=null){
                        Phistory.push(Number(value.price))
                    }
                }), 
                setHistory(Phistory), 
                json.data.history.map(value=>{
                    Ptime.push(value.timestamp)
                }),
                Ptime.length = Number(Phistory.length),
                setTime(Ptime)
                setReadyChartCoin(true)
                }
            ) 
            .catch(fetchError => {setErrorChartCoin(fetchError)})
            .finally(()=> {setInProgress(false)}) 
        }
        catch(connectionError){
            setErrorConnection(connectionError)
        }
        finally{
            setInProgress(false)
        }

    }

    async function getCoinData(){

        setErrorCoin(null)
        setReadyCoin(false)
        setInProgress(true)
        
        try{

            if (!navigator.onLine){
              throw new Error('you are offline');
            }
            
            await fetch(`https://api.coinranking.com/v2/coin/${IdCoin}`,options)
            .then(response => { 
                if (response.status==429){
                    throw new Error('Unable to download cryptocurrency data.')
                };
                return response.json()
            })
            .then(json => {console.log("json coin data ",json.data.coin);setCoinData(json.data.coin);setCoinDataLinks(json.data.coin.links), setReadyCoin(true)}
            ) 
            .catch(fetchError => {setErrorCoin(fetchError)})
        }
        catch(connectionerror){
            setErrorConnection(connectionerror)
        }
        finally{
            setInProgress(false) 
        }

    }

    async function getCoinsList(){
        await fetch('https://api.coinranking.com/v2/coins',options)
        .then(response => response.json())
        .then(json => {
            //setJson(json.data.coins); 
            let coinL=[]
            json.data.coins.map((coin)=>{
                coinL.push(coin)
                console.log('lista monete array', coinL)
                setCoinList(coinL)
            });
        })
        .catch(fetchError => setError(fetchError))
    }


    async function updateCoinTime(){

        let Phistory=[];
        let Ptime=[];

        await fetch(`https://api.coinranking.com/v2/coin/${IdCoin}`,options)
        .then(response => { 
            if (response.status==429){
                throw new Error('Unable to download cryptocurrency data.')
            };
            return response.json()
        })
        .then(json => {console.log("json coin data ",json.data.coin);setCoinData(json.data.coin);setCoinDataLinks(json.data.coin.links), setReadyCoin(true), setErrorCoin(null)}
        ) 


        await fetch(`https://api.coinranking.com/v2/coin/${IdCoin}/history?timePeriod=${ChartPeriod}`,options)
        .then(response => { 
            if (response.status==429){
                throw new Error('Unable to download chart data')
            };
            return response.json()}
        )
        .then(json => {

            setChangeData(json.data.change);
            
            json.data.history.map(value=>{
                if (value.price!=null){
                    Phistory.push(Number(value.price))
                }
            });
            setHistory(Phistory);

            json.data.history.map(value=>{
                Ptime.push(value.timestamp)
            });
            Ptime.length = Number(Phistory.length),
            setTime(Ptime);

            setReadyChartCoin(true);
            setErrorChartCoin(null);

            }
        ) 

    }

    
    useEffect(()=>{getCoinData()},[IdCoin])

    useEffect(()=>{getSparkLineChartData()},[ChartPeriod, IdCoin])

    useEffect(()=>{getCoinsList()},[])

    useEffect(()=>{updateCoinTime()},[timer])

    useEffect(() => {
        const intervalId = setInterval(() => {
          setTimer(prevTimer => (prevTimer === 0 ? 1 : 0));
        }, 5000);  
    
        return () => clearInterval(intervalId);  
    }, [])
    


    //console.log(ChartPeriod)
    console.log("history non return",history)
    console.log("time non return",time)
    console.log("coinData",coinData)


    return (
        
        <Grid container spacing={3} border={5} padding={isMobile? 2: 8} backgroundColor={'white'} borderRadius={10}>
            <Grid size={{ xs: 12, md: 9 }} >
                <Box sx={{ display: 'flex'}}>
                    {/*
                        <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center'  }}>
                    
                            <InputBase 
                                type="text" 
                                onKeyDown={(event)=>{
                                    if (event.key==='Enter'){
                                        event.preventDefault();
                                        setIdCoin(props.dictionary[`${event.target.value}`]);
                                    }
                                }}
                                sx={{ ml: 1, flex: 1}} 
                                placeholder="insert krypto coin name"
                            />
                            
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={(event)=>{console.log("input value",event.target.value)}}>
                                <SearchIcon />
                            </IconButton>
                            
                        </Paper>
                   

                    <Box sx={{ minWidth: 100 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">time period</InputLabel>
                            <Select
                            disabled={InProgess? true:false}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={ChartPeriod}
                            label="time period"
                            onChange={changeChartPeriod}
                            >
                                <MenuItem value={"1h"}>1h</MenuItem>
                                <MenuItem value={"3h"}>3h</MenuItem>
                                <MenuItem value={"12h"}>12h</MenuItem>
                                <MenuItem value={"24h"}>24h</MenuItem>
                                <MenuItem value={"7d"}>7d</MenuItem>
                                <MenuItem value={"30d"}>30d</MenuItem>
                                <MenuItem value={"3m"}>3m</MenuItem>
                                <MenuItem value={"1y"}>1y</MenuItem>
                                <MenuItem value={"3y"}>3y</MenuItem>
                                <MenuItem value={"5y"}>5y</MenuItem>
                            </Select> 
                        </FormControl>
                    </Box> */}
                </Box>

            
                {ReadyCoin && 
                    <div style={{display:'flex',alignItems: 'center'}}>
                        <img src={coinData.iconUrl} alt={coinData.name} style={{width: 50, height:50}}/>
                        <h3> {coinData.name}</h3>
                        <Tooltip sx={{fontSize:15}} title={coinData.description}>
                            <ErrorOutlineIcon />
                        </Tooltip>
                        <Box sx={{ minWidth: 100 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">time period</InputLabel>
                            <Select
                            disabled={InProgess? true:false}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={ChartPeriod}
                            label="time period"
                            onChange={changeChartPeriod}
                            >
                                <MenuItem value={"1h"}>1h</MenuItem>
                                <MenuItem value={"3h"}>3h</MenuItem>
                                <MenuItem value={"12h"}>12h</MenuItem>
                                <MenuItem value={"24h"}>24h</MenuItem>
                                <MenuItem value={"7d"}>7d</MenuItem>
                                <MenuItem value={"30d"}>30d</MenuItem>
                                <MenuItem value={"3m"}>3m</MenuItem>
                                <MenuItem value={"1y"}>1y</MenuItem>
                                <MenuItem value={"3y"}>3y</MenuItem>
                                <MenuItem value={"5y"}>5y</MenuItem>
                            </Select> 
                        </FormControl>
                    </Box>
                    </div>
                    
                }
                
                {((errorCoin && errorChartCoin)|| errorChartCoin || errorConnection) &&
                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems: 'center'}} height={300} width={'auto'}>
                        <img src={errorLogo} alt="error" /> <br/>
                        {errorChartCoin && errorChartCoin.message} <br/>
                        {errorCoin && errorCoin.message} <br/>
                        {errorConnection && errorConnection.message}
                        'Please try again later'
                    </Box> 
                }

                {InProgess &&
                    <div>
                        <Box sx={{ display: 'flex', justifyContent:'center', alignItems: 'center'}} height={300} width={400}>
                            <CircularProgress />
                        </Box>
                    </div>
                }

                {ReadyChartCoin &&
                    <LineChart 
                        xAxis={[{ data: time, valueFormatter: time=>{
                            if(ChartPeriod==="1h"||ChartPeriod==="3h"||ChartPeriod==="12h"||ChartPeriod==="24h"){
                                return `${new Date (time * 1000).toLocaleTimeString('it-EU')}`
                            } else {
                                return `${new Date (time * 1000).toLocaleDateString('it-EU')}`
                            };
                        }                                
                        }]}
                        series={[{ data: history, showMark: false }]}
                        height={isMobile? 200 : 300} 
                        margin={{ top: 55, right: 55, bottom: 55, left: 55 }}
                    />
                }

            </Grid>
        
            <Grid size={{ xs: 12, md: 3}} >
                
                    {ReadyCoin && <Grid container spacing={2} columns={2} sx={{justifyContent: "center"}}>
                        <Grid className="data-container" xs={1}>

                            <Box sx={{display:'inline-flex',alignItems: "center"}} >
                                <Box sx={{fontSize:11,fontWeight: "bold"}}>price (dollar)</Box>   
                                <Tooltip sx={{fontSize:13}} title="actual price of the crypto coin">
                                    <ErrorOutlineIcon />
                                </Tooltip>   
                            </Box>
                            <Box sx={{fontSize:17, fontWeight: "bold"}}>${Number(coinData.price).toFixed(2)}</Box> 
                        
                        </Grid>

                        <Grid className="data-container" xs={1}>
                            <Box sx={{display:'inline-flex',alignItems: "center"}}>
                                <Box sx={{fontSize:11,fontWeight: "bold"}}> change ({ChartPeriod})</Box>
                                <Tooltip sx={{fontSize:15,alignItems: 'center'}} title="percentage of the change in value of the cryptocurrency in a certain time" > 
                                    <ErrorOutlineIcon />
                                </Tooltip>
                            </Box>
                            <Box>
                                {
                                    changeData.search("-")? 
                                    <Box sx={{ color:"green",fontSize:17, fontWeight: "bold"}}> +{changeData}% </Box> : 
                                    <Box sx={{ color:"red",fontSize:17, fontWeight: "bold" }}> {changeData}%</Box> 
                                }
                            </Box> 
                            
                        </Grid>

                        <Grid className="data-container" xs={1}>
                            <Box sx={{display:'inline-flex',alignItems: "center"}}>
                                <Box sx={{fontSize:11,fontWeight: "bold"}}> most hing  </Box>
                                <Tooltip sx={{fontSize:15,alignItems: 'center'}}title="The highest price that the coin has reached">
                                    <ErrorOutlineIcon  />
                                </Tooltip>
                            </Box>
                            <Box sx={{fontSize:17, fontWeight: "bold"}}> {coinData.allTimeHigh.price}</Box>
                        </Grid>

                        <Grid className="data-container" xs={1}>
                            <Box sx={{display:'inline-flex',alignItems: "center"}}>
                                <Box sx={{fontSize:11,fontWeight: "bold"}}>marketcap</Box>
                                <Tooltip sx={{fontSize:15,alignItems: 'center'}} title="The total market value of a cryptocurrency's circulating supply. 
                                It is analogous to the float-adjusted capitalization of the stock market.Market capitalization = current price x circulating supply.">
                                    <ErrorOutlineIcon />
                                </Tooltip>
                            </Box>
                            <Box sx={{fontSize:17, fontWeight: "bold"}}>${Intl.NumberFormat().format(coinData.marketCap)}</Box>
                        </Grid>

                        <Grid className="data-container" xs={1}>
                            <Box sx={{display:'inline-flex',alignItems: "center"}}>
                                <Box sx={{fontSize:11,fontWeight: "bold"}}> 24h volum </Box>
                                <Tooltip sx={{fontSize:15,alignItems: 'center'}} title="A measure of how much a cryptocurrency has been traded in the last 24 hours.">
                                    <ErrorOutlineIcon />
                                </Tooltip>
                            </Box>
                            <Box sx={{fontSize:17, fontWeight: "bold"}}> {coinData["24hVolume"]}</Box>
                        </Grid>

                        <Grid className="data-container" xs={1}>
                            <Box sx={{display:'inline-flex',alignItems: "center"}}>
                                <Box sx={{fontSize:11,fontWeight: "bold"}}> Circulating offer </Box>
                                <Tooltip sx={{fontSize:15,alignItems: 'center'}} title="Number of coins that are circulating in the public market">
                                    <ErrorOutlineIcon />
                                </Tooltip>
                            </Box>
                            <Box sx={{fontSize:17, fontWeight: "bold"}}> {coinData.supply.circulating}</Box>
                        </Grid>

                        <Grid className="data-container" xs={1}>
                            <Box sx={{display:'inline-flex',alignItems: "center"}}>
                                <Box sx={{fontSize:11,fontWeight: "bold"}}> Total offer</Box>
                                <Tooltip sx={{fontSize:15,alignItems: 'center'}} title="The amount of coins that have already been created, minus any coins that have been burned">
                                    <ErrorOutlineIcon />
                                </Tooltip>
                            </Box>
                            <Box sx={{fontSize:17, fontWeight: "bold"}}> {coinData.supply.total}</Box>
                        </Grid>
                        {coinData.supply.max!=null? 
                            <Grid className="data-container" xs={2}>
                                <Box>
                                    <Box style={{display:'inline-flex'}}>
                                        <Box sx={{fontSize:11,fontWeight: "bold"}}> max offer</Box>
                                            <Tooltip sx={{fontSize:15,alignItems: 'center'}} title="The maximum amount of coins that will ever exist in the lifetime of the cryptocurrency. ">
                                                <ErrorOutlineIcon />
                                            </Tooltip>
                                        </Box> 
                                    <Box sx={{fontSize:17, fontWeight: "bold"}}> {coinData.supply.max}</Box>
                                </Box>
                            </Grid>: null
                        }

                        <Grid xs={2}>
                            <Box >
                                {console.log(coinDataLinks)}
                                {coinDataLinks && coinDataLinks.map((link)=>{
                                    if (link.type === "cmc") {
                                        return (
                                        <IconButton href={link.url} sx={{ border: 1, borderRadius: 10 }}>
                                            <TrendingUpIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    if (link.type === "websites") {
                                        return (
                                        <IconButton href={link.url} sx={{ border: 1, borderRadius: 10 }}>
                                            <LanguageIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    if (link.type === "github") {
                                        return (
                                        <IconButton href={link.url} sx={{ border: 1, borderRadius: 10 }}>
                                            <GitHubIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    if (link.type === "reddit") {
                                        return (
                                        <IconButton href={link.url} sx={{ border: 1, borderRadius: 10 }}>
                                            <RedditIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    if (link.type === "telegram") {
                                        return (
                                        <IconButton href={link.url} sx={{ border: 1, borderRadius: 10 }}>
                                            <TelegramIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    if (link.type === "whitepaper") {
                                        return (
                                        <IconButton href={link.url} sx={{ border: 1, borderRadius: 10 }}>
                                            <tickyNote2Icon fontSize="small" />
                                        </IconButton>
                                    )}
                                    if (link.type === "facebook") {
                                        return (
                                        <IconButton href={link.url} sx={{ border: 1, borderRadius: 10 }}>
                                            <FacebookIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                })}
                            </Box>
                            
                        </Grid>

                    </Grid>}

                    {(errorCoin && !errorChartCoin) &&
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems: 'center'}} height={300} width={'auto'}>
                            <img src={errorLogo} alt="error"/> <br/>
                            {errorCoin && errorCoin.message} <br/>
                            'Please try again later'
                        </Box> 
                    }
                    
            </Grid>
            
            <Grid size={12}>
                <Box display={'flex'} justifyContent={'center'}> 
                    <Button onClick={()=>{setI(i=>i-3);setY(y=>y-3)}} disabled={i==0? true:false}> <ArrowBackIosIcon/> </Button>
                        <Box sx={{display: 'flex',flexDirection: 'row' , justifyContent: 'center', flexWrap: 'wrap'}}>
                            {coinList.slice(i,y).map((coin) => (
                                sparkLineNumber=[],
                                coin.sparkline.map((sparkData)=>{sparkLineNumber.push(Number(sparkData))}),
                                sparkLineNumber.pop(),
                                <Box sx={{display:"flex",flexDirection:{ xs: 'row', md: 'column' }}} alignItems='center' p={1} m={1} bordercolor={"black"} border={3} borderRadius={3} onClick={()=>{ setIdCoin(coin.uuid)}}>
                                    <img src={coin.iconUrl} alt={coin.name} style={{width: 50,height:50, }}/>
                                    {coin.symbol}
                                    {isMobile? null : <SparkLineChart data={sparkLineNumber} height={30} /> }
                                </Box>
                            ))}
                        </Box>
                    <Button onClick={()=>{setI(i=>i+3);setY(y=>y+3)}} disabled={y>=50? true:false}> <ArrowForwardIosIcon/> </Button>
                </Box>
            </Grid>

        </Grid>
        
    );

} export default App
