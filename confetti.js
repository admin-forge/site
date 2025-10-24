const canvas = document.createElement("canvas");
canvas.id = "confetti";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let confettiParticles = [];

function createConfetti(){
  const colors = ["#ff0a54","#ff477e","#ff7096","#ff85a1","#fbb1b9","#f9bec7"];
  for(let i=0;i<150;i++){
    confettiParticles.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height - canvas.height,
      r: Math.random()*6+2,
      d: Math.random()*20+10,
      color: colors[Math.floor(Math.random()*colors.length)],
      tilt: Math.random()*10-10
    });
  }
}

function drawConfetti(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  confettiParticles.forEach(p=>{
    ctx.beginPath();
    ctx.lineWidth = p.r;
    ctx.strokeStyle = p.color;
    ctx.moveTo(p.x + p.tilt + p.r/2, p.y);
    ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r/2);
    ctx.stroke();
    p.y += (Math.cos(0.01)+p.d/2);
    p.x += Math.sin(0.01);
    if(p.y > canvas.height){ p.y=0-p.r; p.x=Math.random()*canvas.width;}
  });
}

let confettiInterval;
function launchConfetti(){
  createConfetti();
  confettiInterval = setInterval(drawConfetti,20);
  setTimeout(()=>clearInterval(confettiInterval),5000);
}

window.addEventListener('resize', ()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
