
setTimeout(()=>{document.getElementById('mainApp').style.display='block'},5000);

function showPage(id){
document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
document.getElementById(id).classList.add('active');
}

const locations={
'Bengaluru Urban':{
coords:[12.9716,77.5946],
drains:[
{name:'Whitefield Main Drain',coords:[12.9698,77.75]},
{name:'Koramangala Junction',coords:[12.9352,77.6245]},
{name:'BTM Overflow Point',coords:[12.9166,77.6101]}
]},
'Airport Road Hubli':{
coords:[15.3647,75.1240],
drains:[
{name:'Airport Canal Point',coords:[15.3920,75.0840]},
{name:'Hubli Drain Junction',coords:[15.3600,75.1200]},
{name:'NH Overflow Point',coords:[15.3700,75.1400]}
]},
'Davangere':{
coords:[14.4644,75.9218],
drains:[
{name:'Harihar Main Drain',coords:[14.5100,75.8000]},
{name:'Smart Canal',coords:[14.4700,75.9300]}
]}
};

const map=L.map('map').setView(locations['Bengaluru Urban'].coords,11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
attribution:'© OpenStreetMap'
}).addTo(map);

let markers=[];

function updateMap(area){

markers.forEach(m=>map.removeLayer(m));
markers=[];

const data=locations[area];

map.setView(data.coords,12);

markers.push(
L.marker(data.coords).addTo(map).bindPopup(area)
);

data.drains.forEach(point=>{
markers.push(
L.circleMarker(point.coords,{
radius:10,
color:'#00ffff',
fillColor:'#00ffff',
fillOpacity:0.9
}).addTo(map).bindPopup(point.name)
);
});

document.getElementById('areaName').innerText=area;
document.getElementById('floodPrediction').innerText='Flood Probability: '+Math.floor(Math.random()*15+80)+'%';
document.getElementById('radiusPrediction').innerText='Affected Radius: '+Math.floor(Math.random()*10+3)+' km';

const list=document.getElementById('drainageList');
list.innerHTML='';

data.drains.forEach(point=>{
list.innerHTML+=`<div class="drain-point">${point.name}</div>`;
});

updateRisk(area);
}

function updateRisk(area){
document.getElementById('riskTable').innerHTML=`
<tr><td>1</td><td>${area}</td><td>High</td><td>${Math.floor(Math.random()*15+80)}%</td><td>5 km</td></tr>
<tr><td>2</td><td>Nearby Radius</td><td>Medium</td><td>${Math.floor(Math.random()*20+60)}%</td><td>10 km</td></tr>
<tr><td>3</td><td>Outer Radius</td><td>Low</td><td>${Math.floor(Math.random()*20+30)}%</td><td>18 km</td></tr>
`;
}

updateMap('Bengaluru Urban');

const searchInput=document.getElementById('searchInput');
const suggestions=document.getElementById('suggestions');

searchInput.addEventListener('input',()=>{
const value=searchInput.value.toLowerCase();
suggestions.innerHTML='';
if(value.length===0){suggestions.style.display='none';return;}

Object.keys(locations).filter(l=>l.toLowerCase().includes(value)).forEach(item=>{
const div=document.createElement('div');
div.className='suggestion-item';
div.innerText=item;
div.onclick=()=>{
searchInput.value=item;
suggestions.style.display='none';
updateMap(item);
};
suggestions.appendChild(div);
});
suggestions.style.display='block';
});

new Chart(document.getElementById('rainChart'),{
type:'line',
data:{
labels:['6AM','9AM','12PM','3PM','6PM'],
datasets:[{
label:'Rainfall Prediction',
data:[20,35,60,82,70],
borderColor:'#fff',
backgroundColor:'rgba(255,255,255,0.1)',
fill:true
}]
}
});

setInterval(()=>{
document.getElementById('rainStat').innerText=Math.floor(Math.random()*20+60)+' mm';
document.getElementById('floodStat').innerText=Math.floor(Math.random()*15+75)+'%';
document.getElementById('tempStat').innerText=Math.floor(Math.random()*5+25)+'°C';
},4000);

function safeRoute(){alert('AI Safe Route Generated Successfully');}

const form=document.getElementById('complaintForm');
const complaintList=document.getElementById('complaintList');

form.addEventListener('submit',function(e){
e.preventDefault();

const inputs=form.querySelectorAll('input,textarea');
const file=document.getElementById('photoUpload').files[0];
const reader=new FileReader();

reader.onload=function(){
const data={
name:inputs[0].value,
area:inputs[1].value,
contact:inputs[2].value,
issue:inputs[3].value,
photo:reader.result
};

let complaints=JSON.parse(localStorage.getItem('complaints'))||[];
complaints.push(data);
localStorage.setItem('complaints',JSON.stringify(complaints));
renderComplaints();
form.reset();
};

if(file){reader.readAsDataURL(file)}else{reader.onload();}
});

function renderComplaints(){
let complaints=JSON.parse(localStorage.getItem('complaints'))||[];
complaintList.innerHTML='';

complaints.forEach(c=>{
complaintList.innerHTML+=`
<div class='complaint-card'>
<h3>${c.name}</h3>
<p>${c.area}</p>
<p>${c.issue}</p>
${c.photo?`<img src='${c.photo}'>`:''}
</div>`;
});
}

renderComplaints();

document.getElementById('analyzeBtn').addEventListener('click',()=>{
const area=searchInput.value||'Selected Area';

document.getElementById('aiOutput').innerHTML=`
<div class='ai-card'>
<h2>Municipality Recommendations</h2>
<ul>
<li>Increase drainage capacity near ${area}.</li>
<li>Deploy blockage sensors.</li>
<li>Create overflow channels.</li>
<li>Upgrade outdated pipelines.</li>
</ul>
</div>`;
});
