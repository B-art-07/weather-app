import React, { useState } from 'react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog, WiHumidity, WiStrongWind, WiBarometer, WiDayHaze } from 'react-icons/wi'; // Import sleek icons
import { IoSearch } from "react-icons/io5"; // Search Icon

// API CONFIG (Uses your .env file)
const api = {
  key: import.meta.env.VITE_OPENWEATHER_API_KEY,
  base: "https://api.openweathermap.org/data/2.5/"
};

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. SEARCH FUNCTION
  const search = async (evt) => {
    if (evt.key === "Enter" || evt.type === "click") {
      if(query.trim() === '') return;
      
      setLoading(true);
      setError('');
      setWeather({});

      try {
        const response = await fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`);
        const result = await response.json();
        
        if (result.cod !== 200) {
          setError(result.message);
        } else {
          setWeather(result);
        }
      } catch (err) {
        setError("Network Error");
      }
      setLoading(false);
    }
  };

  // 2. GET DATE
  const dateBuilder = (d) => {
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    
    return `${day}, ${date} ${month}`;
  };

  // 3. GET DYNAMIC BACKGROUND IMAGE
  // This sets a real photo background based on the weather condition
  const getBackgroundImage = () => {
    if (!weather.main) return 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?q=80&w=2544&auto=format&fit=crop'; // Default nice landscape
    
    const condition = weather.weather[0].main.toLowerCase();
    
    if (condition.includes('cloud')) return 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2551&auto=format&fit=crop';
    if (condition.includes('rain')) return 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2553&auto=format&fit=crop';
    if (condition.includes('snow')) return 'https://images.unsplash.com/photo-1517299321609-52687d1bc55a?q=80&w=2670&auto=format&fit=crop';
    if (condition.includes('clear')) return 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=2574&auto=format&fit=crop';
    if (condition.includes('thunder')) return 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=2671&auto=format&fit=crop';
    if (condition.includes('haze') || condition.includes('mist')) return 'https://images.unsplash.com/photo-1522163723043-478ef79a5bb4?q=80&w=2653&auto=format&fit=crop';

    return 'https://images.unsplash.com/photo-1558486012-817176f84c6d?q=80&w=2504&auto=format&fit=crop'; // Fallback
  };

  // 4. GET ICON COMPONENT
  const getWeatherIcon = (main) => {
    switch(main.toLowerCase()) {
      case 'clouds': return <WiCloudy className="text-8xl text-blue-200" />;
      case 'rain': return <WiRain className="text-8xl text-blue-400" />;
      case 'snow': return <WiSnow className="text-8xl text-white" />;
      case 'thunderstorm': return <WiThunderstorm className="text-8xl text-purple-400" />;
      case 'clear': return <WiDaySunny className="text-8xl text-yellow-400 animate-spin-slow" />; // Spinning sun
      case 'haze': return <WiDayHaze className="text-8xl text-orange-200" />;
      case 'mist': return <WiFog className="text-8xl text-gray-300" />;
      default: return <WiDaySunny className="text-8xl text-yellow-400" />;
    }
  };

  return (
    // MAIN CONTAINER WITH BACKGROUND IMAGE
    <div 
      className="min-h-screen bg-cover bg-center transition-all duration-1000 flex items-center justify-center p-4 relative"
      style={{ backgroundImage: `url(${getBackgroundImage()})` }}
    >
      {/* Dark Overlay to make text readable */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* THE GLASS CARD */}
      <div className="relative z-10 w-full max-w-[400px] bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl text-white overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
        
        {/* Search Bar */}
        <div className="flex items-center bg-black/30 rounded-full px-4 py-3 mb-8 border border-white/10 shadow-inner">
          <input 
            type="text"
            className="bg-transparent border-none outline-none text-white w-full placeholder-white/60 font-light tracking-wide"
            placeholder="Search City..."
            onChange={e => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
          <button onClick={search} className="text-white/70 hover:text-white transition">
            <IoSearch size={20} />
          </button>
        </div>

        {/* LOADING & ERROR STATES */}
        {loading && <div className="text-center py-10 animate-pulse">Scanning Satellite...</div>}
        {error && <div className="text-center py-10 text-red-300 bg-red-900/20 rounded-xl border border-red-500/30">{error}</div>}

        {/* WEATHER CONTENT */}
        {weather.main && !loading && (
          <div className="animate-fade-in text-center">
            
            {/* Top Info */}
            <div className="flex flex-col items-center">
              <h2 className="text-3xl font-bold tracking-wider drop-shadow-lg">{weather.name}, <span className="text-sm align-top opacity-80">{weather.sys.country}</span></h2>
              <p className="text-sm font-light opacity-80 mt-1 mb-6">{dateBuilder(new Date())}</p>
            </div>

            {/* Icon & Temp */}
            <div className="my-4 drop-shadow-2xl filter flex justify-center">
               {getWeatherIcon(weather.weather[0].main)}
            </div>
            
            <div className="text-7xl font-bold tracking-tighter mb-2 relative inline-block">
              {Math.round(weather.main.temp)}
              <span className="text-3xl absolute top-2 -right-6 font-light">°</span>
            </div>
            <p className="text-xl capitalize font-medium tracking-widest mb-8 text-blue-100">{weather.weather[0].description}</p>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              
              <div className="bg-black/20 p-3 rounded-2xl border border-white/5 flex items-center justify-center gap-2 hover:bg-black/30 transition">
                <WiHumidity className="text-3xl text-blue-300" />
                <div className="text-left">
                  <span className="block text-xs opacity-60 uppercase">Humidity</span>
                  <span className="font-bold">{weather.main.humidity}%</span>
                </div>
              </div>

              <div className="bg-black/20 p-3 rounded-2xl border border-white/5 flex items-center justify-center gap-2 hover:bg-black/30 transition">
                <WiStrongWind className="text-3xl text-gray-300" />
                <div className="text-left">
                  <span className="block text-xs opacity-60 uppercase">Wind</span>
                  <span className="font-bold">{weather.wind.speed} m/s</span>
                </div>
              </div>

              <div className="bg-black/20 p-3 rounded-2xl border border-white/5 flex items-center justify-center gap-2 hover:bg-black/30 transition">
                 <WiBarometer className="text-3xl text-red-200" />
                 <div className="text-left">
                    <span className="block text-xs opacity-60 uppercase">Pressure</span>
                    <span className="font-bold">{weather.main.pressure} hPa</span>
                 </div>
              </div>

               <div className="bg-black/20 p-3 rounded-2xl border border-white/5 flex items-center justify-center gap-2 hover:bg-black/30 transition">
                 <WiDaySunny className="text-3xl text-yellow-200" /> {/* Simulating 'Feels Like' icon */}
                 <div className="text-left">
                    <span className="block text-xs opacity-60 uppercase">Feels Like</span>
                    <span className="font-bold">{Math.round(weather.main.feels_like)}°</span>
                 </div>
              </div>

            </div>
          </div>
        )}

        {/* DEFAULT STATE */}
        {!weather.main && !loading && !error && (
           <div className="text-center py-12 opacity-50">
             <p className="text-lg font-light tracking-wide">Enter a location to explore</p>
           </div>
        )}

      </div>
    </div>
  );
}

export default App;