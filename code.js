const setImageUrl = (url) => {
  const image = new Image(32,32);
  // image.src = "https://cdn-icons-png.flaticon.com/512/105/105220.png";
  image.src = url;
  console.log(image.src)
  return image;
}

const urlimg = "https://lh3.googleusercontent.com/fife/AAWUweUeaBpNP7oigQloxk-ykwxji5qhAfSI0Nol0GlKTrwxRrLAlr-2_q9pj-xgLrA6GAKg5I95hhLzdSXZ3pQdZKFE7OsbIR9FxZQwZAt_l6T6fV3PnUQHxqGsJcuD-EBMTYY1dsU2H_U9oiW1RBIn6vlJklWtARP_ehI2C0JoJEVWszRuiZ9NCbKJI75odbgft8i5dcUATLgVwMX6_0lIuiUeyRV217HT21ar_IGDTpzIjU_BD26fXVIG5epb1hNvcq0-N2v93flUjlX1LCYTXEp_AeU8YGKWb_sjwnm9jsi7_srez1pJNxFNfpR06cC5TRHQ3J5MUwfz0_0-JSLMr2bjb3fz5KslNH6UWKZbd9GIAZ4-nOmZ8Wy0PC4viepBRioQoDeQ3MO-ADjNtYlT4ZuTVd6cuO0M8-sPvqV1XmFBdE9bHo4TmdWrHGbNJK191QiCQamgcsCAJguIbf6TZIbQprNlts6RkVVSJkOJ4TB054mbWvjEYMvDx95y_sqGZqMLtuGIfIpMgvE5lOCpYUuj2f-LSHX8aUtIRsTTYixdoCA0-v5h6PVxe82cDMGJI7wAKqbmvS7nPxro2FH6qkrUdvzHWj0w1VS0ZpQj0DvoRftOxVP_m5R5w-mcVNAkGhk-fcZVyPhYp3GyweeVZP_dHY7dQefVagjD4-fv4RU3qQeKWuaQQD3KrZdMvDKmZ_BnGBj9CDw-VMOW40T1CFl4T5vrqu8-3CMazAdEJOWMIreRY1rabOwTjzTNArHMg4q7FL9FIavYafNiOkRmRbjrD-t-_JP4VqWREUU-zExgPR_lDt2xY41PCYeu0gdbVEe4RrxWpAmrD4cREwjw-noramMVzsjmFmmmCi2pcSidSWNwk_xDfLusBfwRqI6QikgEC1eG0ANeEZ3r5p3JcaOKxSVsn-amLiEA-YalswAIG452bgKKj1PQzCAyLsrW562VFWYd2tNoKbS3qXSEWbuAlaNJEJWN6VgvTFQ_HLPjWjBZUeQb00j0djdDUV46J4s_gdkEL_v3RpBjA9-PLmDfP2F1ePN3Z9rCKtPH-HA4y_uloAm95CP7jCFCWoif1XlS6kQV5WJi9mn00KDLylo015Ki-5RP5wNx5VC4mU3J14t0nt27tmVDEqXuWssd4s_yCKNO469rrRHgfOwvmz0TSVH-b3rwEI4Tb9caflxTKZpJNNictenfmcBGIySN_9UYSBwIYDs5_J9S5A-dF0j1JCZ1Bn0q2O8zLyADHbWs14uWeV-9llj9RqFAsmFcbaJdu_3NnQ=w1366-h597";

const sectors = [
  {color:"#f82", label: '', icon:"\uF66F", image: setImageUrl(urlimg) },
  {color:"#8cfc03", label: '', icon:"\uF57D", image: setImageUrl(urlimg) },
  {color:"#00bd94", label: '', icon:'\uF57D', image : setImageUrl(urlimg)},
  {color:"#3141eb", label: '', icon:"\uF57D", image : setImageUrl(urlimg)},
  {color:"#fb0", label: '', icon:"\uF57D", image : setImageUrl(urlimg)},
  {color:"#f82", label: '', icon:"\uF57D", image : setImageUrl(urlimg)},
  // {color:"#0fb", label:"50"},
  // {color:"#b0f", label:"100"},
  // {color:"#f0b", label:"5"},
  // {color:"#bf0", label:"500"},
];





// Generate random float in range min-max:
const rand = (m, M) => Math.random() * (M - m) + m;

const tot = sectors.length;
const elSpin = document.querySelector("#spin");
const imgSpin = document.querySelector("#image-spin")
const gameTitle = document.querySelector("#game-title")
const ctx = document.querySelector("#wheel").getContext`2d`;
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const arc = TAU / sectors.length;
const friction = 0.98;//0.991;  // 0.995=soft, 0.99=mid, 0.98=hard
const angVelMin = 0.002; // Below that number will be treated as a stop
const aceleration = 1.05; //1.06;
let angVelMax = 0; // Random ang.vel. to acceletare to 
let angVel = 0;    // Current angular velocity
let ang = 0;       // Angle rotation in radians
let isSpinning = false;
let isAccelerating = false;

let selected = ""

//* Get index of current sector */
const getIndex = () => Math.floor(tot - ang / TAU * tot) % tot;

//* Draw sectors and prizes texts to canvas */
const drawSector = (sector, i) => {
  const ang = arc * i;
  ctx.save();
  // COLOR
  ctx.beginPath();
  ctx.fillStyle = sector.color;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, ang, ang + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();
  // TEXT
  ctx.translate(rad, rad);
  ctx.rotate(ang + arc / 2);
  ctx.textAlign = "right";
  ctx.fillStyle = "#fff";
  ctx.font='32px FontAwesome';
  // ctx.font = "bold 25px sans-serif";
  // ctx.drawImage(sector.image, rad - 60, -15, 32, 32);
  ctx.fillText(sector.icon, rad - 25, 10);
  //
  ctx.restore();
};

//* CSS rotate CANVAS Element */
const rotate = () => {
  const sector = sectors[getIndex()];
  ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
  // imgSpin.src = sector.image.src;
  // elSpin.textContent = !angVel ? "SPIN" : "<i>"+sector.icon+"</i>";
  elSpin.style.background = sector.color;
  selected = sector.label;
};

const frame = () => {

  if (!isSpinning) return;

  if (angVel >= angVelMax) isAccelerating = false;

  // Accelerate
  if (isAccelerating) {
    angVel ||= angVelMin; // Initial velocity kick
    angVel *= aceleration; // Accelerate
  }
  
  // Decelerate
  else {
    isAccelerating = false;
    angVel *= friction; // Decelerate by friction  

    // SPIN END:
    if (angVel < angVelMin) {
      isSpinning = false;
      angVel = 0; 
      gameTitle.innerHTML = "Categoría: " + selected;
      // console.log(selected)
    }
  }

  ang += angVel; // Update angle
  ang %= TAU;    // Normalize angle
  rotate();      // CSS rotate!
};

const engine = () => {
  frame();
  requestAnimationFrame(engine)
};

elSpin.addEventListener("click", () => {
  if (isSpinning) return;
  isSpinning = true;
  isAccelerating = true;
  angVelMax = rand(0.25, 0.40);
});

// INIT!
sectors.forEach(drawSector);
rotate(); // Initial rotation
engine(); // Start engine!