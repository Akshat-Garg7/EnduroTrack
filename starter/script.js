'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout
{
    date=new Date();
    id=(Date.now()+'').slice(-10);
    constructor(coords,distance,duration)
    {
        this.coords=coords;
        this.distance=distance;
        this.duration=duration;
    }
}
class Running extends Workout
{
    type='running';
    constructor(coords,distance,duration,cadence)
    {
        super(coords,distance,duration);
        this.cadence=cadence;
        this.calcPace();
    }
    calcPace()
    {
        this.pace=this.duration/this.distance;
        return this.pace;
    }
}
class Cycling extends Workout
{
    type='cycling';
    constructor(coords,distance,duration,elevationGain)
    {
        super(coords,distance,duration);
        this.elevationGain=elevationGain;
        this.calcSpeed();
    }
    calcSpeed()
    {
        this.speed=this.distance/(this.duration/60);
        return this.speed;
    }
}
const run1=new Running([32,32],31,3,134);
const Cycling1=new Cycling([123,32],32,31,31);
console.log(run1,Cycling1);
class App
{
    #map;
    #mapEvent;
    #workouts=[];
    constructor()
    {
        this._getPosition();
        form.addEventListener('submit',this._newWorkout.bind(this));
        inputType.addEventListener('change',this._toggleElevationField);
    }
    _getPosition()
    {
        if(navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(
            this._loadMap.bind(this),
            function()
            {
                alert("Could not get your position");
            });
        }
    }
    _loadMap(position)
    {
        const {latitude}=position.coords;
        const {longitude}=position.coords;
        const coords=[latitude,longitude];

        this.#map = L.map('map').setView(coords, 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.#map);
        this.#map.on('click',this._showForm.bind(this));

        
    }
    _showForm(mapE)
    {
        this.#mapEvent=mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
        
    }
    _newWorkout(e)
    {
        e.preventDefault();
        inputDistance.value=inputDuration.value=inputCadence.value=inputElevation.value='';
        const {lat,lng}=this.#mapEvent.latlng;
        const type=inputType.value;
        const distance=+inputDistance.value;
        const duration=+inputDuration.value;
        const validInputs=(...inputs)=>inputs.every(inp=>Number.isFinite(inp));
        const allPositive=(...inputs)=>inputs.every(inp=>inp>0);
        let workout;
        if(type==='running'){
            const cadence=+inputCadence.value;
            if(!validInputs(distance,duration,cadence) || !allPositive(distance,duration,cadence)) return alert('Fill the Inputs Correctly');
            workout=new Running([lat,lng],distance,duration,cadence);
        }
        if(type==='cycling'){
            const elevation=+inputElevation.value;
            if(!validInputs(distance,duration,elevation) || !allPositive(distance,duration)) return alert('Fill the Inputs Correctly');
            workout=new Cycling([lat,lng],distance,duration,elevation);

        }
        this.#workouts.push(workout);
        this.renderWorkoutMarker(workout);
    }
    renderWorkoutMarker(workout)
    {
        L.marker(workout.coords).addTo(this.#map).bindPopup(L.popup({
            maxWidth:250,
            minwidth:100,
            autoClose:false,
            closeOnClick:false,
            className:`${workout.type}-popup`
        }
        )).setPopupContent('Workout').openPopup();
    }
    _toggleElevationField(){
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

}
const app=new App();



