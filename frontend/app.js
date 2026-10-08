const API = window.API_BASE || "http://localhost:3000";
const $ = id => document.getElementById(id);
let state = { page: 1, limit: 12, search: "", location: "", category: "", sort: "newest" };

const locations = ["Lahore","Islamabad","Rawalpindi","Karachi","Faisalabad","Peshawar","Multan","Gujranwala","Sialkot","Remote"];
const categories = ["Software Development","Web Development","Data Science","AI & Machine Learning","Cybersecurity","UI/UX Design","Cloud & DevOps","Mobile Development","QA & Testing","Business Analytics"];
locations.forEach(x => $("location").insertAdjacentHTML("beforeend", `<option>${x}</option>`));
categories.forEach(x => $("category").insertAdjacentHTML("beforeend", `<option>${x}</option>`));

function escapeHtml(s){return String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function debounce(fn, ms){let t;return (...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}}

async function load(){
  $("cards").innerHTML = "<div class='skeleton'></div><div class='skeleton'></div><div class='skeleton'></div>";
  const qs = new URLSearchParams({...state});
  const r = await fetch(`${API}/internships?${qs}`);
  if(!r.ok) throw new Error("Request failed");
  const x = await r.json();
  $("status").textContent = `${x.total} internships found`;
  $("cards").innerHTML = x.data.length ? x.data.map(i=>`
    <article class="card">
      <h2>${escapeHtml(i.title)}</h2>
      <strong>${escapeHtml(i.company.name)}</strong>
      <p class="meta">${escapeHtml(i.category)} · ${escapeHtml(i.location)} · ${escapeHtml(i.workMode)} · ${escapeHtml(i.duration)}</p>
      <p>${escapeHtml(i.description)}</p>
      <b>${i.stipend ? "PKR " + i.stipend.toLocaleString() : "Unpaid"}</b>
    </article>`).join("") : "<div class='card'>No internships found.</div>";
  $("pagination").innerHTML = "";
  for(let p=1;p<=x.totalPages;p++){
    if(p <= 5 || p === x.totalPages) {
      const b=document.createElement("button"); b.textContent=p; b.className="pagination";
      b.onclick=()=>{state.page=p;load()}; $("pagination").appendChild(b);
    }
  }
}
$("search").addEventListener("input", debounce(e=>{state.search=e.target.value;state.page=1;load().catch(console.error)},350));
["location","category","sort"].forEach(id=>$(id).addEventListener("change",e=>{state[id]=e.target.value;state.page=1;load().catch(console.error)}));
load().catch(e=>$("status").textContent=e.message);