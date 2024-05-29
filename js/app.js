const KEY = '657860e52789687f8ba8fdf18fd032b2';


const link = 'https://api.openweathermap.org/data/2.5/weather';

const root = document.getElementById('root');
const popup = document.getElementById('popup');
const textInput = document.getElementById('text-input');
const form = document.getElementById('form');
const closeBtn = document.getElementById('close');



let store = {
	city: 'Paxtachi',
	feels_like: 0,
	temp: 0,
	clouds: 99,
	timezone: 18000,
	country: 'UZ',
	properties: {
		speed: {},
		clouds: {},
		humidity: {},
		visibility: {},
	}
}

const fetchData = async () => {
	try {
		const query = localStorage.getItem('query') || store.city;
		const result = await fetch(`${link}?q=${query}&units=metric&appid=${KEY}`);
		const data = await result.json();
		// console.log(data.main.temp)
	
		const {
			main: {temp, feels_like, humidity, pressure },
			sys: { country },
			weather: weather,
			clouds: { all },
			timezone,
			visibility,
			wind: { speed },
			name,
		} = data;
	
	
		store = {
			...store,
			feels_like,
			temp,
			city: name,
			timezone,
			country,
			weather: weather[0].main,
			properties: {
				all: {
					title: 'clouds',
					value: `${all} %`,
					icon: 'cloud.png'
				},
	
				speed: {
					title: 'wind speed',
					value: `${speed} km/h`,
					icon: 'wind.png'
				},
	
				pressure: {
					title: 'pressure',
					value: `${pressure} mb`,
					icon: 'gauge.png'
				},
				
				humidity: {
					title: 'humidity',
					value: `${humidity} %`,
					icon: 'humidity.png'
				},
				visibility: {
					title: 'visibility',
					value: `${visibility/1000} km`,
					icon: 'visibility.png'
				}
			}
		}
		renderComponent();
		const iconImg = document.getElementById('img');
		iconImg.src = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
	} catch (err) {
		console.log(err);
	}
};


/* const getImage = (description) => {
	const value = description.toLowerCase();

	switch(value) {
		case 'clouds':
			return 'cloud.png';
		case 'rain':
			return 'fog.png';
		case 'snow':
			return 'fog.png';
		case 'clear':
			return 'clear.png';
		case 'sunny':
			return 'sunny.png';
		case 'mist':
			return 'fog.png'
		default:
			return 'the.png';
	}
}; */

const renderProperty = (properties) => {
	return Object.values(properties).map(({ title, value, icon }) => {
		return `
			<div class="property">
				<div class="property-icon">
					<img src="./img/icons/${icon}" alt="">
				</div>
				<div class="property-info">
					<div class="property-info__value"> ${value} </div>
					<div class="property-info__description"> ${title} </div>
				</div>
			</div>
		`;
	}).join('')
}

const markup = () => {
	const { city, weather, temp, timezone, properties, country } = store;

	return `
		<div class="container">
			<div class="top">
				<div class="city">
					<div class="city-subtitle">Weather Today in</div>
					<div class="city-title" id="city">
						<span> ${city}, ${country} </span>
					</div>
				</div>
				<div class="city-info">
					<div class="top-left">
						<img class="icon" src="" alt=""  id="img"/>
						<div class="description"> ${weather} </div>
					</div>

					<div class="top-right">
						<div class="city-info__subtitle"> ${timezone} </div>
						<div class="city-info__title">${temp}°</div>
					</div>
				</div>
			</div>
			<div id="properties">${renderProperty(properties)} </div>
		</div>
	`;
	
}

const togglePopupClass = () => {
	popup.classList.toggle('active');
}

const renderComponent = () => {
	root.innerHTML = markup();
	
	const city = document.getElementById('city');
	city.addEventListener('click', togglePopupClass);
}

const handleInput = (e) => {
	store = {
		...store,
		city: e.target.value,
		
	}
};

const handleSubmit = (e) => {
	e.preventDefault();
	const value = store.city;

	if (!value) return null;


	localStorage.setItem('query', value)
	fetchData();
	togglePopupClass();
	form.reset();

}

form.addEventListener('submit', handleSubmit);
textInput.addEventListener('input', handleInput);
closeBtn.addEventListener('click', togglePopupClass);



fetchData();