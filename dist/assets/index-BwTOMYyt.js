import{initializeApp as re}from"https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";import{getAuth as de,signInWithCustomToken as ce,signInAnonymously as ue,onAuthStateChanged as me}from"https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";import{setDoc as Q,doc as R,getFirestore as pe,collection as be,onSnapshot as fe,deleteDoc as Z}from"https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function t(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(a){if(a.ep)return;a.ep=!0;const o=t(a);fetch(a.href,o)}})();let L="init",_=!0,g=!1,z,N,E;const ge=typeof __app_id<"u"?__app_id:"emergency-id-default",G=typeof __firebase_config<"u"?__firebase_config:null,J=typeof __initial_auth_token<"u"?__initial_auth_token:null,b={getLocal(e){try{return localStorage.getItem(e)}catch{return null}},setLocal(e,s){try{localStorage.setItem(e,s)}catch{}},removeLocal(e){try{localStorage.removeItem(e)}catch{}},getSession(e){try{return sessionStorage.getItem(e)}catch{return null}},setSession(e,s){try{sessionStorage.setItem(e,s)}catch{}},removeSession(e){try{sessionStorage.removeItem(e)}catch{}}},U="emergencyID_v3",D="emergencyID_admin",q="emergencyID_session",j="emergencyID_filled",l={profiles:[],activeProfileIndex:0,isAdminLoggedIn:!1,loadLocalAuth(){const e=b.getSession(q);this.isAdminLoggedIn=e==="authenticated"},loadLocalData(){try{const e=b.getLocal(U);if(e){const s=JSON.parse(e);this.profiles=s.profiles||[],this.activeProfileIndex=s.activeProfileIndex||0}}catch{this.profiles=[]}},saveLocalData(){b.setLocal(U,JSON.stringify({profiles:this.profiles,activeProfileIndex:this.activeProfileIndex}))},hasProfiles(){return this.profiles.length>0},getActive(){return this.profiles[this.activeProfileIndex]||null},getProfileById(e){return this.profiles.find(s=>s.id===e)},getProfileIndexById(e){return this.profiles.findIndex(s=>s.id===e)},async addProfile(e,s=!1){if((!s||!e.id)&&(e.id=Date.now().toString(36)+Math.random().toString(36).slice(2,7)),e.createdAt=new Date().toISOString(),e.status||(e.status="active"),e.plan||(e.plan="premium"),this.profiles.push(e),this.activeProfileIndex=this.profiles.length-1,g)try{await Q(R(E,e.id),e)}catch(t){console.error("Error guardando en la nube:",t)}else this.saveLocalData();return e},async generateEmptyProfile(e="premium"){const s={id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),name:"Código Vacío",status:"pending",type:"person",plan:e};await this.addProfile(s,!0)},async updateProfile(e,s){if(this.profiles[e]){const t={...this.profiles[e],...s,updatedAt:new Date().toISOString()};if(this.profiles[e]=t,g)try{await Q(R(E,t.id),t,{merge:!0})}catch(i){console.error("Error actualizando en la nube:",i)}else this.saveLocalData()}},async deleteProfile(e){const s=this.profiles[e];if(s)if(this.profiles.splice(e,1),this.activeProfileIndex>=this.profiles.length&&(this.activeProfileIndex=Math.max(0,this.profiles.length-1)),g)try{await Z(R(E,s.id))}catch(t){console.error("Error eliminando en la nube:",t)}else this.saveLocalData()}},m={async hashPassword(e){if(!window.crypto||!window.crypto.subtle){let o=0;const n=e+"_emergency_salt_2024";for(let c=0;c<n.length;c++){const r=n.charCodeAt(c);o=(o<<5)-o+r,o=o&o}return o.toString(16)}const t=new TextEncoder().encode(e+"_emergency_salt_2024"),i=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(i)).map(o=>o.toString(16).padStart(2,"0")).join("")},async setPassword(e){const s=await this.hashPassword(e);return b.setLocal(D,s),!0},async verifyPassword(e){const s=b.getLocal(D);return s?await this.hashPassword(e)===s:!1},hasPassword(){return b.getLocal(D)!==null},login(){b.setSession(q,"authenticated"),l.isAdminLoggedIn=!0},logout(){b.removeSession(q),l.isAdminLoggedIn=!1},isLoggedIn(){return l.isAdminLoggedIn},async changePassword(e,s){return await this.verifyPassword(e)?(await this.setPassword(s),{success:!0}):{success:!1,error:"Contraseña actual incorrecta"}},resetPassword(){b.removeLocal(D),this.logout()}};function xe(){const e=new URLSearchParams(window.location.search),s=e.get("view"),t=e.get("id"),i=e.get("data");return s==="emergency"&&(t||i)?{view:"emergency",id:t,data:i}:s==="setup"&&t?{view:"setup",id:t}:{view:"app"}}async function he(){if(G)try{const e=JSON.parse(G),s=re(e);N=de(s),z=pe(s),E=be(z,"artifacts",ge,"public","data","profiles"),g=!0,J?await ce(N,J):await ue(N),me(N,t=>{t&&fe(E,i=>{var a;l.profiles=[],i.forEach(o=>l.profiles.push(o.data())),_?(_=!1,ee()):L==="dashboard"?x():L==="admin"?k(((a=document.getElementById("search-input"))==null?void 0:a.value)||""):L==="welcome"&&l.hasProfiles()&&x()},i=>{console.error("Error syncing with Firestore:",i),F()})})}catch(e){console.error("Fallo la inicialización de Firebase:",e),F()}else F()}function F(){g=!1,l.loadLocalData(),_&&(_=!1,ee())}function ee(){const e=xe(),s=b.getLocal(j)==="true";if(e.view==="emergency")y(e.id,e.data);else if(e.view==="setup"){const t=l.getProfileById(e.id);if(t&&t.status!=="pending")y(e.id);else if(s&&!m.isLoggedIn()){const i=l.getActive()?l.getActive().id:"";y(i),u("Ya has completado tu registro. Para cambiar datos contacta al Administrador.","error")}else S(null,e.id)}else if(s&&!m.isLoggedIn()){const t=l.getActive();t?y(t.id):B()}else l.hasProfiles()?x():B()}function Y(e,s="login"){const t=document.getElementById("modal-container"),i=s==="setup";t.innerHTML=`
            <div class="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 fade-in" id="login-modal">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden slide-up">
                    <div class="bg-gradient-to-r from-amber-500 to-yellow-500 p-5 text-white text-center">
                        <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i data-lucide="${i?"shield-plus":"lock"}" class="w-8 h-8"></i>
                        </div>
                        <h2 class="text-xl font-bold">${i?"Crear Contraseña Admin":"Acceso Administrativo"}</h2>
                        <p class="text-amber-100 text-sm mt-1">${i?"Protege el acceso a la gestión de datos":"Ingresa tu contraseña para continuar"}</p>
                    </div>
                    <div class="p-5">
                        <form id="login-form" class="space-y-4">
                            ${i?`
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1.5">Nueva contraseña</label>
                                <div class="relative">
                                    <input type="password" id="admin-pass" required minlength="4"
                                        class="w-full px-4 py-3 pr-11 rounded-xl border border-slate-300 secure-input outline-none transition-all text-slate-800"
                                        placeholder="Mínimo 4 caracteres">
                                    <button type="button" onclick="togglePassVisibility('admin-pass')" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        <i data-lucide="eye" class="w-5 h-5" id="eye-admin-pass"></i>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1.5">Confirmar contraseña</label>
                                <div class="relative">
                                    <input type="password" id="admin-pass-confirm" required minlength="4"
                                        class="w-full px-4 py-3 pr-11 rounded-xl border border-slate-300 secure-input outline-none transition-all text-slate-800"
                                        placeholder="Repite la contraseña">
                                    <button type="button" onclick="togglePassVisibility('admin-pass-confirm')" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        <i data-lucide="eye" class="w-5 h-5" id="eye-admin-pass-confirm"></i>
                                    </button>
                                </div>
                            </div>
                            `:`
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1.5">Contraseña</label>
                                <div class="relative">
                                    <input type="password" id="admin-pass" required autofocus
                                        class="w-full px-4 py-3 pr-11 rounded-xl border border-slate-300 secure-input outline-none transition-all text-slate-800"
                                        placeholder="Ingresa tu contraseña">
                                    <button type="button" onclick="togglePassVisibility('admin-pass')" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                        <i data-lucide="eye" class="w-5 h-5" id="eye-admin-pass"></i>
                                    </button>
                                </div>
                            </div>
                            `}
                            <div id="login-error" class="hidden bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl"></div>
                            <button type="submit"
                                class="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2">
                                <i data-lucide="${i?"shield-check":"unlock"}" class="w-5 h-5"></i>
                                ${i?"Crear Contraseña":"Ingresar"}
                            </button>
                        </form>
                        <button onclick="closeLoginModal()" class="w-full mt-3 text-slate-400 hover:text-slate-600 text-sm font-medium py-2 transition-colors">
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        `,lucide.createIcons(),document.getElementById("login-form").onsubmit=async a=>{a.preventDefault();const o=document.getElementById("login-error"),n=document.getElementById("admin-pass").value;if(i){const c=document.getElementById("admin-pass-confirm").value;if(n!==c){o.textContent="Las contraseñas no coinciden",o.classList.remove("hidden"),document.getElementById("login-form").classList.add("shake"),setTimeout(()=>document.getElementById("login-form").classList.remove("shake"),500);return}if(n.length<4){o.textContent="La contraseña debe tener al menos 4 caracteres",o.classList.remove("hidden");return}await m.setPassword(n),m.login(),A(),u("Contraseña creada exitosamente","success"),e&&e()}else await m.verifyPassword(n)?(m.login(),A(),u("Acceso concedido","success"),e&&e()):(o.textContent="Contraseña incorrecta",o.classList.remove("hidden"),document.getElementById("login-form").classList.add("shake"),setTimeout(()=>document.getElementById("login-form").classList.remove("shake"),500))}}function A(){const e=document.getElementById("modal-container");e.innerHTML=""}function ve(e){const s=document.getElementById(e),t=document.getElementById("eye-"+e);s.type==="password"?(s.type="text",t.setAttribute("data-lucide","eye-off")):(s.type="password",t.setAttribute("data-lucide","eye")),lucide.createIcons()}function M(e){m.isLoggedIn()?e():m.hasPassword()?Y(e,"login"):Y(e,"setup")}function we(e){try{const s=decodeURIComponent(escape(atob(e))),t=JSON.parse(s);return!t||!t.name||!t.phone?null:t}catch(s){return console.error("Error decoding QR data:",s),null}}function y(e,s){L="emergency";let t=null;e&&(t=l.profiles.find(I=>I.id===e)),!t&&s&&(t=we(s));const i=document.getElementById("app");if(!t){i.innerHTML=`
                <div class="min-h-screen flex items-center justify-center bg-red-50 p-6">
                    <div class="text-center fade-in">
                        <div class="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                            <i data-lucide="alert-triangle" class="w-10 h-10 text-red-600"></i>
                        </div>
                        <h1 class="text-2xl font-bold text-red-800 mb-2">Perfil no encontrado</h1>
                        <p class="text-red-600">El código QR no corresponde a ningún perfil registrado.</p>
                    </div>
                </div>
            `,lucide.createIcons();return}if(t.status==="pending"){const I=t.plan!=="basic",O=I?"Premium":"Básico",H=I?"from-amber-500 to-orange-500":"from-slate-500 to-slate-600";i.innerHTML=`
                <div class="min-h-screen flex flex-col">
                    <!-- Header con gradiente según plan -->
                    <div class="bg-gradient-to-r ${H} px-6 pt-8 pb-16 text-white relative overflow-hidden">
                        <div class="absolute inset-0 opacity-10">
                            <div class="absolute top-4 right-4 w-32 h-32 rounded-full border-4 border-white/30"></div>
                            <div class="absolute bottom-4 left-4 w-24 h-24 rounded-full border-4 border-white/20"></div>
                        </div>
                        <div class="relative z-10 text-center fade-in">
                            <div class="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 border-4 border-white/40">
                                <i data-lucide="qr-code" class="w-12 h-12 text-white/80"></i>
                            </div>
                            <h1 class="text-2xl font-bold mb-1">Código Vacío</h1>
                            <span class="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium">${O}</span>
                        </div>
                    </div>

                    <!-- Contenido -->
                    <div class="flex-1 -mt-8 px-4 pb-6">
                        <div class="bg-white rounded-2xl shadow-lg p-6 slide-up">
                            <div class="text-center">
                                <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                    <i data-lucide="file-question" class="w-8 h-8 text-slate-400"></i>
                                </div>
                                <h2 class="text-xl font-bold text-slate-800 mb-2">Sin Datos Registrados</h2>
                                <p class="text-slate-500 text-sm mb-4">Este código QR aún no ha sido completado con información de emergencia.</p>
                                <div class="bg-slate-50 rounded-xl p-4 text-left">
                                    <p class="text-xs text-slate-400 mb-2">ID del código:</p>
                                    <p class="text-sm font-mono text-slate-600 break-all">${t.id}</p>
                                </div>
                                ${I?`
                                <div class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                    <p class="text-amber-700 text-sm font-medium"><i data-lucide="crown" class="w-4 h-4 inline mr-1"></i> Plan Premium disponible</p>
                                    <p class="text-amber-600 text-xs mt-1">Foto, datos médicos, dirección y más</p>
                                </div>
                                `:`
                                <div class="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                    <p class="text-slate-600 text-sm font-medium">Plan Básico</p>
                                    <p class="text-slate-500 text-xs mt-1">Nombre, teléfono y contacto de emergencia</p>
                                </div>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            `,lucide.createIcons();return}const a=t.type==="pet",o=t.plan!=="basic",n=a?"Mascota":"Persona",c=a?"paw-print":"user",r=o&&t.photo?`<img src="${t.photo}" alt="Foto" class="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg">`:`<div class="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/40">
                 <i data-lucide="${c}" class="w-14 h-14 text-white/80"></i>
               </div>`,h=o&&t.medicalNotes?`
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 slide-up" style="animation-delay: 0.2s">
                <div class="flex items-center gap-2 mb-2">
                    <i data-lucide="heart-pulse" class="w-5 h-5 text-amber-600"></i>
                    <h3 class="font-bold text-amber-800">Información Médica</h3>
                </div>
                <p class="text-amber-900 text-sm leading-relaxed">${d(t.medicalNotes)}</p>
            </div>`:"",v=o&&t.address?`
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 slide-up" style="animation-delay: 0.25s">
                <div class="flex items-center gap-2 mb-1">
                    <i data-lucide="map-pin" class="w-5 h-5 text-blue-600"></i>
                    <h3 class="font-bold text-blue-800">Dirección</h3>
                </div>
                <p class="text-blue-900 text-sm">${d(t.address)}</p>
            </div>`:"",f=a&&t.ownerName?`
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 slide-up" style="animation-delay: 0.15s">
                <div class="flex items-center gap-2 mb-1">
                    <i data-lucide="user" class="w-5 h-5 text-slate-600"></i>
                    <h3 class="font-bold text-slate-800">Dueño/a</h3>
                </div>
                <p class="text-slate-900 font-medium">${d(t.ownerName)}</p>
            </div>`:"",w=o&&a?`
            ${t.breed?`<div class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500 text-sm">Raza</span>
                <span class="text-slate-800 font-medium text-sm">${d(t.breed)}</span>
            </div>`:""}
            ${t.color?`<div class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500 text-sm">Color</span>
                <span class="text-slate-800 font-medium text-sm">${d(t.color)}</span>
            </div>`:""}
            ${t.weight?`<div class="flex justify-between py-2">
                <span class="text-slate-500 text-sm">Peso</span>
                <span class="text-slate-800 font-medium text-sm">${d(t.weight)}</span>
            </div>`:""}
        `:"",p=o&&!a&&t.bloodType?`
            <div class="flex justify-between py-2 border-b border-slate-100">
                <span class="text-slate-500 text-sm">Tipo de Sangre</span>
                <span class="text-slate-800 font-bold text-sm bg-red-50 px-3 py-0.5 rounded-full text-red-700">${d(t.bloodType)}</span>
            </div>`:"",$=o&&t.allergies?`
            <div class="bg-red-50 border border-red-200 rounded-xl p-4 slide-up" style="animation-delay: 0.3s">
                <div class="flex items-center gap-2 mb-2">
                    <i data-lucide="shield-alert" class="w-5 h-5 text-red-600"></i>
                    <h3 class="font-bold text-red-800">Alergias</h3>
                </div>
                <p class="text-red-900 text-sm leading-relaxed">${d(t.allergies)}</p>
            </div>`:"",P=m.isLoggedIn()?`
            <div class="px-5 mt-4 text-center">
                <button onclick="renderDashboard()" class="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2.5 px-5 rounded-xl transition-all text-sm shadow">
                    <i data-lucide="layout-dashboard" class="w-4 h-4"></i> Volver a Dashboard
                </button>
            </div>
        `:"",T=f!==""||w!==""||p!==""?`
            <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 p-4 slide-up" style="animation-delay: 0.1s">
                <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <i data-lucide="clipboard-list" class="w-3.5 h-3.5"></i> Datos
                </h2>
                ${p}
                ${w}
                ${f}
            </div>
        `:"";i.innerHTML=`
            <div class="min-h-screen bg-white">
                <div class="bg-gradient-to-br ${o?"from-red-600 via-red-700 to-red-800":"from-indigo-600 via-indigo-700 to-indigo-800"} text-white pt-10 pb-16 px-6 text-center relative overflow-hidden transition-colors">
                    <div class="absolute inset-0 opacity-10">
                        <div class="absolute top-4 left-4 w-32 h-32 border border-white/30 rounded-full"></div>
                        <div class="absolute bottom-4 right-4 w-48 h-48 border border-white/20 rounded-full"></div>
                    </div>
                    <div class="relative z-10">
                        <div class="flex items-center justify-center gap-2 mb-4">
                            <i data-lucide="shield-check" class="w-5 h-5"></i>
                            <span class="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Ficha de Emergencia ${o?"":"Básica"}</span>
                        </div>
                        <div class="flex justify-center mb-4 fade-in">
                            ${r}
                        </div>
                        <h1 class="text-3xl font-black tracking-tight fade-in">${d(t.name)}</h1>
                        <div class="inline-flex items-center gap-1.5 mt-2 bg-white/15 px-3 py-1 rounded-full text-sm font-medium">
                            <i data-lucide="${c}" class="w-4 h-4"></i>
                            ${n}
                        </div>
                    </div>
                </div>

                <div class="px-5 -mt-8 pb-8 space-y-4 relative z-10">
                    <div class="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 p-4 slide-up">
                        <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <i data-lucide="phone" class="w-3.5 h-3.5"></i> Contactos de Emergencia
                        </h2>
                        <a href="tel:${d(t.phone)}"
                           class="flex items-center gap-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-4 px-5 rounded-xl transition-all emergency-pulse mb-3 w-full">
                            <i data-lucide="phone-call" class="w-6 h-6 shrink-0"></i>
                            <div class="text-left">
                                <div class="text-xs text-green-200 font-medium">${a?"Llamar al dueño":"Contacto principal"}</div>
                                <div class="text-lg">${d(t.phone)}</div>
                            </div>
                        </a>

                        ${t.phoneAlt?`
                        <a href="tel:${d(t.phoneAlt)}"
                           class="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-5 rounded-xl transition-all mb-3 w-full">
                            <i data-lucide="phone" class="w-5 h-5 shrink-0"></i>
                            <div class="text-left">
                                <div class="text-xs text-blue-200 font-medium">Contacto alternativo</div>
                                <div>${d(t.phoneAlt)}</div>
                            </div>
                        </a>`:""}

                        <div class="grid grid-cols-2 gap-2">
                            <a href="tel:911"
                               class="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 active:bg-red-900 text-white font-bold py-3 px-4 rounded-xl transition-all">
                                <i data-lucide="siren" class="w-5 h-5"></i>
                                <span>911</span>
                            </a>
                            <a href="tel:065"
                               class="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 px-4 rounded-xl transition-all">
                                <i data-lucide="cross" class="w-5 h-5"></i>
                                <span>Cruz Roja</span>
                            </a>
                        </div>

                        <button onclick="shareLocation('${d(t.phone)}', '${d(t.name)}')" 
                            class="w-full mt-2 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 active:bg-black text-white font-bold py-3 px-4 rounded-xl transition-all">
                            <i data-lucide="map-pin" class="w-5 h-5 text-amber-400"></i>
                            <span>Enviar mi ubicación por WhatsApp</span>
                        </button>
                    </div>

                    ${T}
                    ${h}
                    ${$}
                    ${v}

                    ${P}

                    <div class="text-center pt-4">
                        <p class="text-xs text-slate-400">Ficha generada por <span class="font-bold text-slate-500">ID Emergencia</span></p>
                        <p class="text-xs text-slate-300 mt-1">${g?"Sincronizado de manera segura en la nube":"Datos almacenados localmente"}</p>
                    </div>
                </div>
            </div>
        `,lucide.createIcons()}function S(e=null,s=null){L="registration";const t=e!==null,i=s!==null,a=t?l.profiles[e]:i?l.getProfileById(s):null,o=document.getElementById("app");if(b.getLocal(j)==="true"&&!m.isLoggedIn()){const h=l.getActive()?l.getActive().id:"";y(h),u("Los cambios solo están permitidos con contraseña de Administrador","error");return}const n=a&&a.plan?a.plan:"premium";window._selectedPlan=n;const c=a&&a.type?a.type:"person";window._selectedType=c;const r=i&&a&&a.plan;if(o.innerHTML=`
            <div class="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-10">
                <div class="bg-white border-b border-slate-200 px-5 py-4 sticky top-0 z-20 shadow-sm flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        ${t||l.hasProfiles()?`
                        <button onclick="backToDashboardOrEmergency()" class="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors">
                            <i data-lucide="arrow-left" class="w-5 h-5 text-slate-600"></i>
                        </button>`:""}
                        <div>
                            <h1 class="text-lg font-bold text-slate-800">${t?"Editar Perfil":i?"Configurar QR":"Nuevo Registro"}</h1>
                            <p class="text-xs text-slate-400">${t?"Modifica los datos del perfil":i?"Llena tus datos para activar este código":"Crea una ficha de identificación"}</p>
                        </div>
                    </div>
                </div>

                <div class="p-5 fade-in">
                    <!-- Selector de Plan -->
                    <div class="mb-6 ${r?"hidden":""}">
                        <label class="block text-sm font-bold text-slate-700 mb-2">Tipo de Plan</label>
                        <div class="grid grid-cols-2 gap-3 bg-slate-100 p-1.5 rounded-xl">
                            <button type="button" onclick="selectPlan('basic')" id="btn-plan-basic"
                                class="py-2.5 rounded-lg text-sm font-bold transition-all ${n==="basic"?"bg-white text-indigo-700 shadow-sm":"text-slate-500 hover:text-slate-700"}">
                                Básico
                            </button>
                            <button type="button" onclick="selectPlan('premium')" id="btn-plan-premium"
                                class="py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${n==="premium"?"bg-white text-amber-600 shadow-sm":"text-slate-500 hover:text-slate-700"}">
                                <i data-lucide="star" class="w-4 h-4"></i> Premium
                            </button>
                        </div>
                        <p class="text-xs text-slate-500 mt-2 text-center" id="plan-desc">
                            ${n==="basic"?"Solo información de contacto de emergencia.":"Incluye datos médicos, dirección y fotos."}
                        </p>
                    </div>

                    ${r?`
                    <div class="mb-6 bg-slate-100 rounded-xl p-3 flex items-center justify-center gap-2">
                        <i data-lucide="${n==="premium"?"star":"shield"}" class="w-4 h-4 ${n==="premium"?"text-amber-500":"text-indigo-500"}"></i>
                        <span class="text-sm font-bold text-slate-700">Completando QR ${n==="premium"?"Premium":"Básico"}</span>
                    </div>
                    `:""}

                    <div class="mb-6">
                        <label class="block text-sm font-bold text-slate-700 mb-2">Tipo de perfil</label>
                        <div class="grid grid-cols-2 gap-3">
                            <button type="button" onclick="selectType('person')" id="btn-person"
                                class="type-btn flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-slate-200 hover:border-blue-400 transition-all bg-white">
                                <i data-lucide="user" class="w-8 h-8 text-slate-400"></i>
                                <span class="text-sm font-semibold text-slate-600">Persona</span>
                            </button>
                            <button type="button" onclick="selectType('pet')" id="btn-pet"
                                class="type-btn flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-slate-200 hover:border-blue-400 transition-all bg-white">
                                <i data-lucide="paw-print" class="w-8 h-8 text-slate-400"></i>
                                <span class="text-sm font-semibold text-slate-600">Mascota</span>
                            </button>
                        </div>
                    </div>

                    <form id="registration-form" class="space-y-5" onsubmit="handleSubmit(event, ${e}, ${s?`'${s}'`:"null"})">
                        
                        <!-- Bloque de Foto (PREMIUM ONLY) -->
                        <div class="premium-feature">
                            <label class="block text-sm font-bold text-slate-700 mb-2">Foto (Premium)</label>
                            <div class="photo-upload rounded-xl p-6 text-center" id="photo-area" onclick="document.getElementById('photo-input').click()">
                                <div id="photo-preview-area">
                                    <i data-lucide="camera" class="w-8 h-8 text-slate-300 mx-auto mb-2"></i>
                                    <p class="text-sm text-slate-400">Toca para agregar foto</p>
                                </div>
                                <input type="file" id="photo-input" accept="image/*" class="hidden" onchange="handlePhoto(this)">
                            </div>
                        </div>

                        <div>
                            <label for="name" class="block text-sm font-bold text-slate-700 mb-1.5">
                                Nombre <span class="text-red-500">*</span>
                            </label>
                            <input type="text" id="name" required
                                class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800"
                                placeholder="Nombre completo"
                                value="${t&&a.name!=="Código Vacío"?d(a.name):""}">
                        </div>

                        <div id="owner-field" class="hidden">
                            <label for="ownerName" class="block text-sm font-bold text-slate-700 mb-1.5">
                                Nombre del dueño/a <span class="text-red-500">*</span>
                            </label>
                            <input type="text" id="ownerName"
                                class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800"
                                placeholder="Tu nombre"
                                value="${(t||i)&&(a!=null&&a.ownerName)?d(a.ownerName):""}">
                        </div>

                        <div>
                            <label for="phone" class="block text-sm font-bold text-slate-700 mb-1.5">
                                Teléfono de Emergencia <span class="text-red-500">*</span>
                            </label>
                            <input type="tel" id="phone" required
                                class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800"
                                placeholder="+52 55 1234 5678"
                                value="${(t||i)&&(a!=null&&a.phone)?d(a.phone):""}">
                        </div>

                        <div>
                            <label for="phoneAlt" class="block text-sm font-bold text-slate-700 mb-1.5">
                                Teléfono alternativo
                            </label>
                            <input type="tel" id="phoneAlt"
                                class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800"
                                placeholder="Otro número de contacto"
                                value="${(t||i)&&(a!=null&&a.phoneAlt)?d(a.phoneAlt):""}">
                        </div>

                        <!-- Bloques PREMIUM de Mascotas -->
                        <div id="pet-fields" class="hidden space-y-5 premium-feature">
                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label for="breed" class="block text-sm font-bold text-slate-700 mb-1.5">Raza</label>
                                    <input type="text" id="breed"
                                        class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800"
                                        placeholder="Ej: Labrador"
                                        value="${(t||i)&&(a!=null&&a.breed)?d(a.breed):""}">
                                </div>
                                <div>
                                    <label for="color" class="block text-sm font-bold text-slate-700 mb-1.5">Color</label>
                                    <input type="text" id="color"
                                        class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800"
                                        placeholder="Ej: Negro"
                                        value="${(t||i)&&(a!=null&&a.color)?d(a.color):""}">
                                </div>
                            </div>
                            <div>
                                <label for="weight" class="block text-sm font-bold text-slate-700 mb-1.5">Peso</label>
                                <input type="text" id="weight"
                                    class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800"
                                    placeholder="Ej: 12 kg"
                                    value="${(t||i)&&(a!=null&&a.weight)?d(a.weight):""}">
                            </div>
                        </div>

                        <!-- Bloques PREMIUM de Personas -->
                        <div id="person-fields" class="hidden premium-feature">
                            <label for="bloodType" class="block text-sm font-bold text-slate-700 mb-1.5">Tipo de sangre</label>
                            <select id="bloodType"
                                class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800 bg-white">
                                <option value="">Seleccionar...</option>
                                <option value="A+" ${(t||i)&&a&&a.bloodType==="A+"?"selected":""}>A+</option>
                                <option value="A-" ${(t||i)&&a&&a.bloodType==="A-"?"selected":""}>A-</option>
                                <option value="B+" ${(t||i)&&a&&a.bloodType==="B+"?"selected":""}>B+</option>
                                <option value="B-" ${(t||i)&&a&&a.bloodType==="B-"?"selected":""}>B-</option>
                                <option value="AB+" ${(t||i)&&a&&a.bloodType==="AB+"?"selected":""}>AB+</option>
                                <option value="AB-" ${(t||i)&&a&&a.bloodType==="AB-"?"selected":""}>AB-</option>
                                <option value="O+" ${(t||i)&&a&&a.bloodType==="O+"?"selected":""}>O+</option>
                                <option value="O-" ${(t||i)&&a&&a.bloodType==="O-"?"selected":""}>O-</option>
                            </select>
                        </div>

                        <div class="premium-feature">
                            <label for="address" class="block text-sm font-bold text-slate-700 mb-1.5">Dirección</label>
                            <input type="text" id="address"
                                class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800"
                                placeholder="Dirección del hogar"
                                value="${(t||i)&&(a!=null&&a.address)?d(a.address):""}">
                        </div>

                        <div class="premium-feature">
                            <label for="medicalNotes" class="block text-sm font-bold text-slate-700 mb-1.5">
                                Notas médicas
                            </label>
                            <textarea id="medicalNotes" rows="3"
                                class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800 resize-none"
                                placeholder="Condiciones, medicamentos, etc.">${(t||i)&&(a!=null&&a.medicalNotes)?d(a.medicalNotes):""}</textarea>
                        </div>

                        <div class="premium-feature">
                            <label for="allergies" class="block text-sm font-bold text-slate-700 mb-1.5">
                                Alergias
                            </label>
                            <textarea id="allergies" rows="2"
                                class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800 resize-none"
                                placeholder="Alergias conocidas">${(t||i)&&(a!=null&&a.allergies)?d(a.allergies):""}</textarea>
                        </div>

                        <button type="submit" id="btn-submit-form"
                            class="w-full bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-700/25 mt-6">
                            <i data-lucide="${t?"save":"check-circle"}" class="w-5 h-5"></i>
                            ${t?"Guardar Cambios":i?"Activar Código QR":"Crear Ficha de Emergencia"}
                        </button>
                    </form>
                </div>
            </div>
        `,lucide.createIcons(),V(c),te(n),(t||i)&&a&&a.photo){window._currentPhoto=a.photo;const h=document.getElementById("photo-preview-area"),v=document.getElementById("photo-area");h.innerHTML=`<img src="${a.photo}" class="w-20 h-20 rounded-full object-cover mx-auto">
                <p class="text-xs text-green-600 font-medium mt-2">Toca para cambiar</p>`,v.classList.add("has-photo")}else window._currentPhoto=null}function te(e){window._selectedPlan=e;const s=document.getElementById("btn-plan-basic"),t=document.getElementById("btn-plan-premium"),i=document.getElementById("plan-desc");s&&t&&(e==="basic"?(s.className="py-2.5 rounded-lg text-sm font-bold transition-all bg-white text-indigo-700 shadow-sm",t.className="py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-700",i&&(i.textContent="Solo información de contacto de emergencia.")):(s.className="py-2.5 rounded-lg text-sm font-bold transition-all text-slate-500 hover:text-slate-700",t.className="py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 bg-white text-amber-600 shadow-sm",i&&(i.textContent="Incluye datos médicos, dirección y fotos."))),document.querySelectorAll(".premium-feature").forEach(a=>{e==="basic"?a.classList.add("hidden"):a.classList.remove("hidden")}),V(window._selectedType)}function V(e){window._selectedType=e;const s=document.getElementById("btn-person"),t=document.getElementById("btn-pet"),i=document.getElementById("pet-fields"),a=document.getElementById("person-fields"),o=document.getElementById("owner-field");!s||!t||(document.querySelectorAll(".type-btn").forEach(n=>{n.classList.remove("border-blue-500","bg-blue-50"),n.classList.add("border-slate-200","bg-white")}),e==="person"?(s.classList.add("border-blue-500","bg-blue-50"),s.classList.remove("border-slate-200","bg-white"),window._selectedPlan==="premium"?a.classList.remove("hidden"):a.classList.add("hidden"),i.classList.add("hidden"),o.classList.add("hidden")):(t.classList.add("border-blue-500","bg-blue-50"),t.classList.remove("border-slate-200","bg-white"),window._selectedPlan==="premium"?i.classList.remove("hidden"):i.classList.add("hidden"),a.classList.add("hidden"),o.classList.remove("hidden")))}function ye(e){const s=e.files[0];if(!s)return;const t=new FileReader;t.onload=function(i){const a=new Image;a.onload=function(){const o=document.createElement("canvas"),n=300;let c=a.width,r=a.height;c>r?c>n&&(r*=n/c,c=n):r>n&&(c*=n/r,r=n),o.width=c,o.height=r,o.getContext("2d").drawImage(a,0,0,c,r),window._currentPhoto=o.toDataURL("image/jpeg",.7);const v=document.getElementById("photo-preview-area"),f=document.getElementById("photo-area");v.innerHTML=`<img src="${window._currentPhoto}" class="w-20 h-20 rounded-full object-cover mx-auto">
                    <p class="text-xs text-green-600 font-medium mt-2">Toca para cambiar</p>`,f.classList.add("has-photo")},a.src=i.target.result},t.readAsDataURL(s)}async function $e(e,s,t=null){e.preventDefault();const i=document.getElementById("btn-submit-form");i.disabled=!0;const a=i.innerHTML;i.innerHTML='<i data-lucide="loader-2" class="w-5 h-5 animate-spin"></i> Guardando...',lucide.createIcons();const o={type:window._selectedType,plan:window._selectedPlan,name:document.getElementById("name").value.trim(),phone:document.getElementById("phone").value.trim(),phoneAlt:document.getElementById("phoneAlt").value.trim()};if(window._selectedType==="pet"&&(o.ownerName=document.getElementById("ownerName").value.trim()),window._selectedPlan==="premium"&&(o.address=document.getElementById("address").value.trim(),o.medicalNotes=document.getElementById("medicalNotes").value.trim(),o.allergies=document.getElementById("allergies").value.trim(),o.photo=window._currentPhoto||null,window._selectedType==="pet"?(o.breed=document.getElementById("breed").value.trim(),o.color=document.getElementById("color").value.trim(),o.weight=document.getElementById("weight").value.trim()):o.bloodType=document.getElementById("bloodType").value),!o.name||!o.phone||o.type==="pet"&&!o.ownerName){u("Completa los campos obligatorios","error"),i.disabled=!1,i.innerHTML=a;return}let n=null;if(s!==null)await l.updateProfile(s,{...o,status:"active"}),n=l.profiles[s].id;else if(t){const c=l.getProfileIndexById(t);c>=0?(await l.updateProfile(c,{...o,status:"active"}),n=t):(o.id=t,o.status="active",await l.addProfile(o,!0),n=t)}else o.status="active",n=(await l.addProfile(o)).id;window._currentPhoto=null,t&&b.setLocal(j,"true"),!m.isLoggedIn()&&t?(y(n),u("Ficha activada de manera segura","success")):(x(),u(s!==null?"Perfil actualizado":"Ficha creada exitosamente","success"))}function Le(){if(m.isLoggedIn())x();else{const e=l.getActive();e?y(e.id):B()}}function x(){if(L="dashboard",b.getLocal(j)==="true"&&!m.isLoggedIn()){const p=l.getActive();if(p){y(p.id);return}}const e=document.getElementById("app"),s=l.getActive(),t=m.isLoggedIn();if(!s){B();return}const i=s.type==="pet",a=s.status==="pending",o=s.plan!=="basic",n=a?"qr-code":i?"paw-print":"user",c=se(s.id),r=ae(s),h=Ne(s.id),v=l.profiles.map((p,$)=>{const P=$===l.activeProfileIndex,C=p.status==="pending",T=p.plan!=="basic",I=C?"qr-code":p.type==="pet"?"paw-print":"user",O=C?"Código Vacío":d(p.name),H=C?"Pendiente":p.type==="pet"?"Mascota":"Persona",ne=T?"text-amber-500":"text-indigo-500";return`
                <button onclick="switchProfile(${$})"
                    class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all shrink-0 ${P?"border-blue-500 bg-blue-50":"border-slate-200 bg-white hover:border-slate-300"}">
                    ${p.photo&&!C&&T?`<img src="${p.photo}" class="w-10 h-10 rounded-full object-cover shrink-0">`:`<div class="w-10 h-10 rounded-full ${P?"bg-blue-200":"bg-slate-200"} flex items-center justify-center shrink-0">
                             <i data-lucide="${I}" class="w-5 h-5 ${P?"text-blue-700":"text-slate-500"}"></i>
                           </div>`}
                    <div class="text-left min-w-0">
                        <div class="flex items-center gap-1.5">
                            <p class="text-sm font-bold ${P?"text-blue-800":"text-slate-700"} truncate">${O}</p>
                            <i data-lucide="${T?"star":"shield"}" class="w-3 h-3 ${ne}"></i>
                        </div>
                        <p class="text-xs ${P?"text-blue-500":"text-slate-400"}">${H}</p>
                    </div>
                </button>`}).join(""),f=s.photo&&!a&&o?`<img src="${s.photo}" alt="${d(s.name)}" class="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow">`:`<div class="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center border-2 border-white shadow">
                 <i data-lucide="${n}" class="w-8 h-8 text-blue-600"></i>
               </div>`;let w="";a?(w=`
                <div class="${o?"bg-amber-50 border-amber-200":"bg-indigo-50 border-indigo-200"} rounded-2xl shadow-sm border p-5 text-center relative overflow-hidden transition-colors">
                    <div class="w-16 h-16 ${o?"bg-amber-100":"bg-indigo-100"} rounded-full flex items-center justify-center mx-auto mb-3">
                        <i data-lucide="qr-code" class="w-8 h-8 ${o?"text-amber-600":"text-indigo-600"}"></i>
                    </div>
                    <h2 class="text-xl font-black ${o?"text-amber-800":"text-indigo-800"} mb-1 flex justify-center items-center gap-2">
                        Código Pendiente 
                        <span class="text-xs font-bold px-2 py-0.5 rounded-full ${o?"bg-amber-200 text-amber-800":"bg-indigo-200 text-indigo-800"}">${o?"Premium":"Básico"}</span>
                    </h2>
                    <p class="text-sm ${o?"text-amber-700":"text-indigo-600"} mb-4 px-2">Este código QR aún no tiene datos. Imprímelo para que el usuario lo escanee y llene su ficha <b>${o?"Premium completa":"Básica"}</b>.</p>
                    
                    <div class="bg-white p-4 rounded-xl border border-slate-100 mb-4 flex justify-center shadow-sm">
                        <div id="qr-display-pending"></div>
                    </div>
                    <p class="text-[10px] text-slate-400 font-mono break-all px-2 mb-4">${d(h)}</p>
                    
                    <div class="grid grid-cols-2 gap-2 mb-4">
                        <button onclick="downloadQRPending()" class="flex items-center justify-center gap-1.5 py-2.5 rounded-xl ${o?"bg-amber-600 hover:bg-amber-700":"bg-indigo-600 hover:bg-indigo-700"} text-white font-semibold text-sm transition-colors">
                            <i data-lucide="download" class="w-4 h-4"></i> Descargar
                        </button>
                        <button onclick="printQR()" class="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-semibold text-sm transition-colors">
                            <i data-lucide="printer" class="w-4 h-4"></i> Imprimir
                        </button>
                    </div>

                    <div class="pt-4 border-t ${o?"border-amber-200":"border-indigo-200"}">
                        <button onclick="handleEditProfile(${l.activeProfileIndex})" class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed ${o?"border-amber-300 text-amber-600 hover:border-amber-400":"border-indigo-300 text-indigo-600 hover:border-indigo-400"} font-semibold text-sm hover:bg-white transition-all">
                            <i data-lucide="pencil" class="w-4 h-4"></i>
                            Llenar datos manualmente ahora
                        </button>
                    </div>
                    <button onclick="handleDeleteProfile(${l.activeProfileIndex})" class="w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-xl text-red-500 font-semibold text-sm hover:bg-red-50 transition-all">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                        Eliminar este código vacío
                    </button>
                </div>
            `,setTimeout(()=>{const p=document.getElementById("qr-display-pending"),$=o?"#b45309":"#3730a3";p&&new QRCode(p,{text:h,width:200,height:200,colorDark:$,colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.H})},100)):(w=`
                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 relative overflow-hidden">
                    <div class="absolute top-0 right-0 p-3">
                        <span class="text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${o?"plan-badge-premium":"plan-badge-basic"}">
                            <i data-lucide="${o?"star":"shield"}" class="w-3 h-3"></i> ${o?"Premium":"Básico"}
                        </span>
                    </div>
                    <div class="flex items-start justify-between mb-4 mt-2">
                        <div class="flex items-center gap-4">
                            ${f}
                            <div>
                                <h2 class="text-xl font-black text-slate-800 pr-16">${d(s.name)}</h2>
                                <div class="flex items-center gap-1.5 mt-0.5">
                                    <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${i?"bg-amber-100 text-amber-700":"bg-blue-100 text-blue-700"}">
                                        ${i?"🐾 Mascota":"👤 Persona"}
                                    </span>
                                    ${!i&&o&&s.bloodType?`<span class="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">${d(s.bloodType)}</span>`:""}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="space-y-2 mb-4">
                        <div class="flex items-center gap-2 text-sm text-slate-600">
                            <i data-lucide="phone" class="w-4 h-4 text-slate-400"></i>
                            <span>${d(s.phone)}</span>
                        </div>
                        ${s.phoneAlt?`
                        <div class="flex items-center gap-2 text-sm text-slate-600">
                            <i data-lucide="phone" class="w-4 h-4 text-slate-400"></i>
                            <span>${d(s.phoneAlt)} (alt.)</span>
                        </div>`:""}
                        ${o&&s.address?`
                        <div class="flex items-center gap-2 text-sm text-slate-600">
                            <i data-lucide="map-pin" class="w-4 h-4 text-slate-400"></i>
                            <span>${d(s.address)}</span>
                        </div>`:""}
                    </div>

                    <div class="flex gap-2">
                        <button onclick="handleEditProfile(${l.activeProfileIndex})"
                            class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border ${t?"border-slate-300 text-slate-700 hover:bg-slate-50":"border-slate-200 text-slate-400"} font-medium text-sm transition-colors ${t?"":"cursor-not-allowed"}">
                            <i data-lucide="${t?"pencil":"lock"}" class="w-4 h-4"></i> Editar
                        </button>
                        <button onclick="handleDeleteProfile(${l.activeProfileIndex})"
                            class="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border ${t?"border-red-200 text-red-600 hover:bg-red-50":"border-slate-200 text-slate-400"} font-medium text-sm transition-colors ${t?"":"cursor-not-allowed"}">
                            <i data-lucide="${t?"trash-2":"lock"}" class="w-4 h-4"></i>
                        </button>
                    </div>
                    ${t?"":`
                    <p class="text-xs text-slate-400 mt-3 text-center flex items-center justify-center gap-1">
                        <i data-lucide="info" class="w-3 h-3"></i> Inicia sesión como administrador para editar
                    </p>`}
                </div>

                <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5" id="print-area">
                    <div class="text-center mb-4">
                        <h3 class="text-sm font-bold text-slate-800 mb-1 flex items-center justify-center gap-1.5">
                            <i data-lucide="qr-code" class="w-4 h-4"></i> Código QR de Emergencia
                        </h3>
                        <p class="text-xs text-slate-400">Escanea para ver la ficha de emergencia</p>
                    </div>

                    <div class="bg-white p-4 rounded-xl border border-slate-100 mb-4 flex justify-center shadow-sm">
                        <div id="qr-display"></div>
                    </div>

                    <div class="grid grid-cols-2 gap-2 mb-4">
                        <button onclick="setQRMode('portable')" id="qr-mode-portable"
                            class="qr-mode-btn bg-blue-600 text-white text-xs font-bold py-2 rounded-lg">QR Móvil (Datos)</button>
                        <button onclick="setQRMode('local')" id="qr-mode-local"
                            class="qr-mode-btn bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded-lg">QR Local (ID)</button>
                    </div>

                    <div class="text-center mb-4">
                        <p class="text-[10px] text-slate-400 font-mono break-all px-2" id="qr-url-display">${d(r)}</p>
                        <p class="text-[10px] text-slate-400 mt-1">Modo recomendado para abrir desde cualquier móvil</p>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                        <button onclick="downloadQR()" class="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm transition-colors">
                            <i data-lucide="download" class="w-4 h-4"></i> Descargar
                        </button>
                        <button onclick="printQR()" class="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-semibold text-sm transition-colors">
                            <i data-lucide="printer" class="w-4 h-4"></i> Imprimir
                        </button>
                    </div>
                </div>

                <button onclick="previewEmergency('${s.id}')"
                    class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 font-semibold text-sm hover:border-blue-400 hover:text-blue-600 transition-all">
                    <i data-lucide="eye" class="w-4 h-4"></i> Vista previa de la ficha
                </button>
            `,setTimeout(()=>{oe(r,c)},100)),e.innerHTML=`
            <div class="min-h-screen bg-slate-50 pb-10">
                <div class="bg-white border-b border-slate-200 px-5 py-3">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                <i data-lucide="shield-check" class="w-5 h-5 text-white"></i>
                            </div>
                            <span class="font-bold text-slate-800 text-sm hidden sm:inline">ID Emergencia</span>
                            ${t?'<span class="ml-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full admin-glow flex items-center gap-1"><i data-lucide="shield" class="w-3 h-3"></i> Admin</span>':""}
                        </div>
                        <div class="flex items-center gap-1.5">
                            ${t?`
                            <div class="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                                <button onclick="handleGenerateEmpty('basic')" class="flex items-center justify-center text-indigo-600 hover:bg-white hover:shadow-sm font-semibold text-[11px] transition-all px-2.5 py-1.5 rounded-md" title="Generar QR Básico Vacío">
                                    <i data-lucide="qr-code" class="w-3 h-3 mr-1"></i> Básico
                                </button>
                                <button onclick="handleGenerateEmpty('premium')" class="flex items-center justify-center text-amber-600 hover:bg-white hover:shadow-sm font-semibold text-[11px] transition-all px-2.5 py-1.5 rounded-md" title="Generar QR Premium Vacío">
                                    <i data-lucide="qr-code" class="w-3 h-3 mr-1"></i> Premium
                                </button>
                            </div>
                            <button onclick="renderAdminPanel()" class="flex items-center gap-1.5 text-slate-600 hover:text-slate-800 font-semibold text-sm transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg ml-1">
                                <i data-lucide="database" class="w-4 h-4"></i>
                            </button>`:`
                            <button onclick="requireAdmin(renderDashboard)" class="flex items-center gap-1 text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors px-2 py-2 rounded-lg hover:bg-slate-100">
                                <i data-lucide="lock" class="w-4 h-4"></i>
                            </button>`}
                            ${t?`
                            <button onclick="renderRegistration()" class="flex items-center justify-center text-blue-600 hover:text-blue-800 font-semibold text-sm transition-colors bg-blue-50 hover:bg-blue-100 w-9 h-9 rounded-lg shrink-0">
                                <i data-lucide="plus" class="w-5 h-5"></i>
                            </button>`:""}
                        </div>
                    </div>
                </div>

                ${l.profiles.length>1?`
                <div class="px-5 pt-4">
                    <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        ${v}
                    </div>
                </div>`:""}

                <div class="p-5 space-y-4 fade-in">
                    ${w}

                    <div class="bg-slate-100 rounded-xl p-4">
                        <div class="flex items-center justify-between">
                            ${t?`
                            <div class="flex items-center gap-2 text-sm text-slate-600">
                                <i data-lucide="shield-check" class="w-4 h-4 text-green-600"></i>
                                <span class="font-medium">Sesión activa</span>
                            </div>
                            <button onclick="handleLogout()" class="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 transition-colors">
                                <i data-lucide="log-out" class="w-4 h-4"></i> Cerrar sesión
                            </button>
                            `:`
                            <div class="flex items-center gap-2 text-sm text-slate-500">
                                <i data-lucide="lock" class="w-4 h-4"></i>
                                <span>Modo visualización</span>
                            </div>
                            <button onclick="requireAdmin(renderDashboard)" class="text-sm text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 transition-colors">
                                <i data-lucide="key" class="w-4 h-4"></i> Acceder como Admin
                            </button>
                            `}
                        </div>
                    </div>

                    <div class="text-center pt-2">
                        <p class="text-xs text-slate-400 flex justify-center items-center gap-1">
                            ${g?'<i data-lucide="cloud" class="w-3.5 h-3.5 text-blue-500"></i> Base de datos en línea activa':'<i data-lucide="database" class="w-3.5 h-3.5"></i> Datos almacenados localmente'}
                        </p>
                    </div>
                </div>
            </div>
        `,lucide.createIcons()}function Pe(e="premium"){m.isLoggedIn()?(l.generateEmptyProfile(e),u(`Código QR Vacío (${e==="premium"?"Premium":"Básico"}) generado`,"success")):M(()=>{l.generateEmptyProfile(e),u(`Código QR Vacío (${e==="premium"?"Premium":"Básico"}) generado`,"success")})}function k(e=""){if(L="admin",!m.isLoggedIn()){M(()=>k(e));return}const s=document.getElementById("app"),t=l.profiles,i=e?t.filter(r=>r.name.toLowerCase().includes(e.toLowerCase())||r.phone&&r.phone.includes(e)||r.type==="pet"&&r.ownerName&&r.ownerName.toLowerCase().includes(e.toLowerCase())):t,a=t.length,o=t.filter(r=>r.plan!=="basic"&&r.status!=="pending").length,n=t.filter(r=>r.plan==="basic"&&r.status!=="pending").length,c=i.map((r,h)=>{const v=l.getProfileIndexById(r.id),f=r.status==="pending",w=r.plan!=="basic",p=f?"qr-code":r.type==="pet"?"paw-print":"user",$=f?"Vacío":r.type==="pet"?"Mascota":"Persona";return new Date(r.createdAt).toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"}),`
                <tr class="table-row border-b border-slate-100 transition-colors">
                    <td class="py-3 px-4">
                        <div class="flex items-center gap-3">
                            ${r.photo&&!f&&w?`<img src="${r.photo}" class="w-10 h-10 rounded-full object-cover shrink-0">`:`<div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                     <i data-lucide="${p}" class="w-5 h-5 ${f?"text-indigo-400":"text-slate-400"}"></i>
                                   </div>`}
                            <div>
                                <p class="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                                    ${f?"Código Vacío":d(r.name)}
                                </p>
                                <div class="flex items-center gap-2 mt-0.5">
                                    <span class="text-[10px] font-bold px-1.5 py-0.5 rounded ${w?"bg-amber-100 text-amber-700":"bg-slate-100 text-slate-600"}">${w?"Premium":"Básico"}</span>
                                    ${r.type==="pet"&&r.ownerName&&!f?`<span class="text-xs text-slate-400">Dueño: ${d(r.ownerName)}</span>`:""}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td class="py-3 px-4">
                        <span class="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${f?"bg-indigo-100 text-indigo-700":r.type==="pet"?"bg-amber-100 text-amber-700":"bg-blue-100 text-blue-700"}">
                            <i data-lucide="${p}" class="w-3 h-3"></i>
                            ${$}
                        </span>
                    </td>
                    <td class="py-3 px-4">
                        ${f?'<span class="text-sm text-slate-300">-</span>':`<a href="tel:${d(r.phone)}" class="text-sm text-blue-600 hover:underline font-medium">${d(r.phone)}</a>`}
                    </td>
                    <td class="py-3 px-4">
                        <div class="flex items-center gap-1">
                            ${f?"":`
                            <button onclick="previewEmergencyFromAdmin('${r.id}')" 
                                class="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver ficha">
                                <i data-lucide="eye" class="w-4 h-4"></i>
                            </button>`}
                            <button onclick="editProfileFromAdmin(${v})" 
                                class="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="${f?"Llenar datos":"Editar"}">
                                <i data-lucide="pencil" class="w-4 h-4"></i>
                            </button>
                            <button onclick="deleteProfileFromAdmin(${v})" 
                                class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `}).join("");s.innerHTML=`
            <div class="min-h-screen bg-slate-50 pb-10">
                <div class="bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-5 py-4">
                    <div class="flex items-center gap-3">
                        <button onclick="renderDashboard()" class="p-2 -ml-2 rounded-lg hover:bg-white/20 transition-colors">
                            <i data-lucide="arrow-left" class="w-5 h-5"></i>
                        </button>
                        <div class="flex-1">
                            <h1 class="text-lg font-bold flex items-center gap-2">
                                <i data-lucide="database" class="w-5 h-5"></i> Administrador
                            </h1>
                            <p class="text-amber-100 text-xs">Gestión en tiempo real</p>
                        </div>
                        <button onclick="showAdminSettings()" class="p-2 rounded-lg hover:bg-white/20 transition-colors">
                            <i data-lucide="settings" class="w-5 h-5"></i>
                        </button>
                    </div>
                </div>

                <div class="p-5 space-y-4 fade-in">
                    <div class="grid grid-cols-3 gap-3">
                        <div class="bg-white rounded-xl p-4 border border-slate-200 text-center">
                            <div class="text-2xl font-black text-slate-800">${a}</div>
                            <div class="text-xs text-slate-400 font-medium">Total</div>
                        </div>
                        <div class="bg-white rounded-xl p-4 border border-slate-200 text-center">
                            <div class="text-2xl font-black text-amber-600">${o}</div>
                            <div class="text-xs text-slate-400 font-medium">Premium</div>
                        </div>
                        <div class="bg-white rounded-xl p-4 border border-slate-200 text-center">
                            <div class="text-2xl font-black text-indigo-600">${n}</div>
                            <div class="text-xs text-slate-400 font-medium">Básicos</div>
                        </div>
                    </div>

                    <div class="relative">
                        <i data-lucide="search" class="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"></i>
                        <input type="text" id="search-input" placeholder="Buscar por nombre o teléfono..."
                            class="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 outline-none transition-all text-slate-800"
                            value="${d(e)}"
                            oninput="handleSearch(this.value)">
                    </div>

                    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        ${i.length>0?`
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th class="text-left text-xs font-bold text-slate-500 uppercase tracking-wider py-3 px-4">Usuario</th>
                                        <th class="text-left text-xs font-bold text-slate-500 uppercase tracking-wider py-3 px-4">Tipo</th>
                                        <th class="text-left text-xs font-bold text-slate-500 uppercase tracking-wider py-3 px-4">Teléfono</th>
                                        <th class="text-left text-xs font-bold text-slate-500 uppercase tracking-wider py-3 px-4">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${c}
                                </tbody>
                            </table>
                        </div>
                        `:`
                        <div class="p-8 text-center">
                            <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <i data-lucide="users" class="w-8 h-8 text-slate-300"></i>
                            </div>
                            <p class="text-slate-500 font-medium">${e?"No se encontraron resultados":"No hay usuarios registrados"}</p>
                            ${e?`<button onclick="handleSearch('')" class="text-amber-600 hover:underline text-sm mt-2">Limpiar búsqueda</button>`:""}
                        </div>
                        `}
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <button onclick="exportData()"
                            class="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-700 hover:bg-slate-800 text-white font-semibold text-sm transition-colors">
                            <i data-lucide="download" class="w-4 h-4"></i> Exportar
                        </button>
                        <button onclick="confirmImportData()"
                            class="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-colors">
                            <i data-lucide="upload" class="w-4 h-4"></i> Importar
                        </button>
                    </div>
                </div>
            </div>
        `,lucide.createIcons()}let K;function Ie(e){clearTimeout(K),K=setTimeout(()=>{k(e)},300)}function Ee(e){y(e);const s=document.getElementById("app"),t=document.createElement("button");t.onclick=()=>k(),t.className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur shadow-lg rounded-full p-2.5 hover:bg-white transition-all",t.innerHTML='<i data-lucide="arrow-left" class="w-5 h-5 text-slate-700"></i>',s.appendChild(t),lucide.createIcons()}function ke(e){S(e)}async function Ae(e){const s=l.profiles[e];confirm(`¿Eliminar ${s.status==="pending"?"este código vacío":`la ficha de "${s.name}"`}?

Esta acción no se puede deshacer.`)&&(await l.deleteProfile(e),g||k(),u("Elemento eliminado","info"))}function Be(){const e=document.getElementById("modal-container");e.innerHTML=`
            <div class="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 fade-in">
                <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden slide-up">
                    <div class="bg-slate-100 px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                        <h2 class="font-bold text-slate-800 flex items-center gap-2">
                            <i data-lucide="settings" class="w-5 h-5"></i> Configuración
                        </h2>
                        <button onclick="closeLoginModal()" class="p-1 hover:bg-slate-200 rounded-lg transition-colors">
                            <i data-lucide="x" class="w-5 h-5 text-slate-500"></i>
                        </button>
                    </div>

                    <div class="p-5 space-y-4">
                        <div class="bg-amber-50 rounded-xl p-4 border border-amber-200">
                            <h3 class="font-bold text-amber-800 text-sm mb-3 flex items-center gap-2">
                                <i data-lucide="key" class="w-4 h-4"></i> Cambiar Contraseña Local
                            </h3>
                            <form id="change-pass-form" class="space-y-3">
                                <input type="password" id="current-pass" placeholder="Contraseña actual" required
                                    class="w-full px-3 py-2 rounded-lg border border-amber-200 text-sm focus:border-amber-400 outline-none transition-all">
                                <input type="password" id="new-pass" placeholder="Nueva contraseña" required minlength="4"
                                    class="w-full px-3 py-2 rounded-lg border border-amber-200 text-sm focus:border-amber-400 outline-none transition-all">
                                <input type="password" id="confirm-new-pass" placeholder="Confirmar nueva contraseña" required minlength="4"
                                    class="w-full px-3 py-2 rounded-lg border border-amber-200 text-sm focus:border-amber-400 outline-none transition-all">
                                <div id="change-pass-error" class="hidden text-red-600 text-xs"></div>
                                <button type="submit" class="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg text-sm transition-colors">
                                    Actualizar Contraseña
                                </button>
                            </form>
                        </div>

                        <div class="bg-red-50 rounded-xl p-4 border border-red-200">
                            <h3 class="font-bold text-red-800 text-sm mb-3 flex items-center gap-2">
                                <i data-lucide="alert-triangle" class="w-4 h-4"></i> Zona de Peligro
                            </h3>
                            <button onclick="confirmResetPassword()" class="w-full bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 rounded-lg text-sm transition-colors mb-2">
                                Eliminar Contraseña Admin
                            </button>
                            <button onclick="confirmDeleteAllData()" class="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg text-sm transition-colors">
                                Eliminar TODOS los Datos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `,lucide.createIcons(),document.getElementById("change-pass-form").onsubmit=async s=>{s.preventDefault();const t=document.getElementById("change-pass-error"),i=document.getElementById("current-pass").value,a=document.getElementById("new-pass").value,o=document.getElementById("confirm-new-pass").value;if(a!==o){t.textContent="Las nuevas contraseñas no coinciden",t.classList.remove("hidden");return}const n=await m.changePassword(i,a);n.success?(A(),u("Contraseña actualizada","success")):(t.textContent=n.error,t.classList.remove("hidden"))}}function Ce(){confirm(`¿Eliminar la contraseña de administrador?

Cualquier persona en este dispositivo podrá acceder al panel.`)&&(m.resetPassword(),A(),x(),u("Contraseña eliminada","info"))}function Te(){confirm(`⚠️ ADVERTENCIA ⚠️

¿Estás SEGURO de que deseas eliminar TODOS los datos de la base de datos?

Esta acción eliminará todos los perfiles de forma definitiva.`)&&confirm(`ÚLTIMA CONFIRMACIÓN

¿Realmente deseas eliminar todo?`)&&(g&&l.profiles.forEach(e=>Z(R(E,e.id))),b.removeLocal(U),b.removeLocal(D),b.removeLocal(j),b.removeSession(q),l.profiles=[],l.activeProfileIndex=0,l.isAdminLoggedIn=!1,A(),B(),u("Todos los datos han sido eliminados","info"))}function De(){const e={version:"2.1",exportedAt:new Date().toISOString(),profiles:l.profiles},s=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),t=URL.createObjectURL(s),i=document.createElement("a");i.href=t,i.download=`ID-Emergencia-Backup-${new Date().toISOString().split("T")[0]}.json`,i.click(),URL.revokeObjectURL(t),u("Datos exportados","success")}function Re(){const e=document.createElement("input");e.type="file",e.accept=".json",e.onchange=async s=>{const t=s.target.files[0];if(t)try{const i=await t.text(),a=JSON.parse(i);if(!a.profiles||!Array.isArray(a.profiles))throw new Error("Formato inválido");if(confirm(`Se encontraron ${a.profiles.length} perfiles.

¿Deseas importarlos a la base de datos?`)){u("Importando...","info");for(const o of a.profiles)if(o.plan||(o.plan="premium"),g)await Q(R(E,o.id),o,{merge:!0});else{const n=l.profiles.findIndex(c=>c.id===o.id);n>=0?l.profiles[n]=o:l.profiles.push(o)}g||(l.saveLocalData(),k()),u(`${a.profiles.length} perfiles importados`,"success")}}catch{u("Error al importar: archivo inválido","error")}},e.click()}function Se(e){m.isLoggedIn()?S(e):M(()=>S(e))}function je(e){m.isLoggedIn()?W(e):M(()=>W(e))}function Me(){m.logout(),x(),u("Sesión cerrada","info")}function d(e){if(!e)return"";const s=document.createElement("div");return s.textContent=e,s.innerHTML}function se(e){return`${window.location.origin+window.location.pathname}?view=emergency&id=${e}`}function Ne(e){return`${window.location.origin+window.location.pathname}?view=setup&id=${e}`}function ae(e){const s=window.location.origin+window.location.pathname,t={id:e.id,type:e.type,plan:e.plan||"premium",name:e.name,phone:e.phone,phoneAlt:e.phoneAlt||""};t.plan==="premium"?(e.type==="pet"?(t.ownerName=e.ownerName||"",t.breed=e.breed||"",t.color=e.color||"",t.weight=e.weight||""):t.bloodType=e.bloodType||"",t.allergies=e.allergies||"",t.medicalNotes=e.medicalNotes||"",t.address=e.address||"",t.photo=e.photo||""):e.type==="pet"&&(t.ownerName=e.ownerName||"");const i=btoa(unescape(encodeURIComponent(JSON.stringify(t))));return`${s}?view=emergency&data=${i}`}function _e(e){l.activeProfileIndex=e,l.saveLocalData(),x()}async function W(e){const s=l.profiles[e];confirm(`¿Eliminar ${s.status==="pending"?"este código vacío":`la ficha de "${s.name}"`}? Esta acción no se puede deshacer.`)&&(await l.deleteProfile(e),g||(l.hasProfiles()?x():B()),u("Elemento eliminado","info"))}function qe(e){y(e);const s=document.getElementById("app"),t=document.createElement("button");t.onclick=()=>x(),t.className="fixed top-4 left-4 z-50 bg-white/90 backdrop-blur shadow-lg rounded-full p-2.5 hover:bg-white transition-all",t.innerHTML='<i data-lucide="arrow-left" class="w-5 h-5 text-slate-700"></i>',s.appendChild(t),lucide.createIcons()}function Oe(e){const s=l.getActive();if(!s)return;const t=ae(s),i=se(s.id),a=e==="local"?i:t,o=document.getElementById("qr-mode-portable"),n=document.getElementById("qr-mode-local"),c=document.getElementById("qr-url-display");o&&n&&(o.className="qr-mode-btn text-xs font-bold py-2 rounded-lg "+(e==="portable"?"bg-blue-600 text-white":"bg-slate-200 text-slate-700"),n.className="qr-mode-btn text-xs font-bold py-2 rounded-lg "+(e==="local"?"bg-blue-600 text-white":"bg-slate-200 text-slate-700")),c&&(c.textContent=a),oe(t,i,e)}function oe(e,s,t="portable"){const i=document.getElementById("qr-display");if(i){i.innerHTML="";const a=t==="local"?s:e;new QRCode(i,{text:a,width:200,height:200,colorDark:"#1e293b",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.H})}}function He(){const e=document.querySelector("#qr-display canvas");if(e){const s=document.createElement("a");s.download=`QR-Emergencia-${l.getActive().name.replace(/\s+/g,"-")}.png`,s.href=e.toDataURL("image/png"),s.click(),u("QR descargado","success")}}function Fe(){const e=document.querySelector("#qr-display-pending canvas");if(e){const s=document.createElement("a");s.download=`QR-Vacio-${l.getActive().plan==="basic"?"Basico":"Premium"}-${l.getActive().id}.png`,s.href=e.toDataURL("image/png"),s.click(),u("QR descargado","success")}}function Qe(){window.print()}function u(e,s="info"){const t={success:"bg-green-600",error:"bg-red-600",info:"bg-slate-700"},i={success:"check-circle",error:"alert-circle",info:"info"},a=document.createElement("div");a.className=`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] ${t[s]} text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-medium slide-up`,a.innerHTML=`<i data-lucide="${i[s]}" class="w-5 h-5"></i> <span class="whitespace-nowrap">${e}</span>`,document.body.appendChild(a),lucide.createIcons(),setTimeout(()=>{a.style.opacity="0",a.style.transition="opacity 0.3s",setTimeout(()=>a.remove(),300)},2500)}function Ue(e,s){if(!navigator.geolocation)return u("Tu navegador no soporta geolocalización","error");u("Obteniendo tu ubicación actual...","info"),navigator.geolocation.getCurrentPosition(t=>{const i=t.coords.latitude,a=t.coords.longitude,o=`https://www.google.com/maps?q=${i},${a}`,n=`🚨 *EMERGENCIA* 🚨
Hola, he escaneado la placa de emergencia de *${s}* y necesita ayuda.

📍 Aquí está nuestra ubicación actual:
${o}`,c=e.replace(/[^0-9+]/g,"");window.open(`https://wa.me/${c}?text=${encodeURIComponent(n)}`,"_blank"),u("Abriendo WhatsApp...","success")},t=>{console.error(t.message||t),u(t.code===1?"Permiso de ubicación denegado.":"Error al obtener la ubicación","error")},{enableHighAccuracy:!0,timeout:1e4,maximumAge:0})}function B(){L="welcome";const e=document.getElementById("app");e.innerHTML=`
            <div class="min-h-screen bg-gradient-to-b from-white via-slate-50 to-blue-50 flex flex-col items-center justify-center p-6 text-center">
                <div class="fade-in">
                    <div class="relative mb-8">
                        <div class="w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-red-600/30 rotate-3 hover:rotate-0 transition-transform">
                            <i data-lucide="shield-check" class="w-12 h-12 text-white"></i>
                        </div>
                        <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg -rotate-6">
                            <i data-lucide="qr-code" class="w-5 h-5 text-white"></i>
                        </div>
                    </div>
                    <h1 class="text-3xl font-black text-slate-800 mb-2 tracking-tight">ID de Emergencia</h1>
                    <p class="text-slate-500 text-base mb-8 max-w-xs mx-auto leading-relaxed">
                        Crea fichas de identificación (Básicas o Premium) con código QR sincronizadas en <span class="font-semibold text-blue-600">tiempo real</span>.
                    </p>
                    <button onclick="renderRegistration()" class="w-full max-w-xs bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-blue-700/25 flex items-center justify-center gap-2 mx-auto">
                        <i data-lucide="plus-circle" class="w-5 h-5"></i> Crear Primera Ficha
                    </button>
                    <p class="text-xs text-slate-400 mt-6"><i data-lucide="cloud" class="w-3 h-3 inline"></i> Sincronización en la nube lista</p>
                </div>
            </div>
        `,lucide.createIcons()}window.togglePassVisibility=ve;window.closeLoginModal=A;window.requireAdmin=M;window.renderDashboard=x;window.handleGenerateEmpty=Pe;window.renderAdminPanel=k;window.renderRegistration=S;window.handleLogout=Me;window.showAdminSettings=Be;window.exportData=De;window.confirmImportData=Re;window.handleSearch=Ie;window.previewEmergencyFromAdmin=Ee;window.editProfileFromAdmin=ke;window.deleteProfileFromAdmin=Ae;window.confirmResetPassword=Ce;window.confirmDeleteAllData=Te;window.selectPlan=te;window.selectType=V;window.handlePhoto=ye;window.handleSubmit=$e;window.backToDashboardOrEmergency=Le;window.switchProfile=_e;window.handleEditProfile=Se;window.handleDeleteProfile=je;window.setQRMode=Oe;window.downloadQR=He;window.downloadQRPending=Fe;window.printQR=Qe;window.previewEmergency=qe;window.shareLocation=Ue;const Ve="1973",ie="emergencyID_global_access";function ze(){const e=document.getElementById("app");e.innerHTML=`
            <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
                <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm fade-in text-center border border-slate-100">
                    <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
                        <i data-lucide="lock" class="w-8 h-8 text-blue-600"></i>
                    </div>
                    <h2 class="text-2xl font-bold text-slate-800 mb-2">Acceso a la App</h2>
                    <p class="text-slate-500 text-sm mb-6">Ingresa el código de acceso general para continuar.</p>
                    
                    <form id="app-access-form" class="space-y-4">
                        <input type="password" id="app-access-input" required autofocus
                            class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-center text-xl tracking-widest text-slate-800"
                            placeholder="****">
                        <div id="app-access-error" class="hidden text-red-500 text-sm font-medium bg-red-50 p-2 rounded-lg">Código incorrecto</div>
                        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl transition-all shadow shadow-blue-600/20">
                            Ingresar
                        </button>
                        <p class="text-xs text-slate-400 mt-2">Administrador / Usuario</p>
                    </form>
                </div>
            </div>
        `,lucide.createIcons(),document.getElementById("app-access-form").onsubmit=s=>{if(s.preventDefault(),document.getElementById("app-access-input").value===Ve)b.setLocal(ie,"true"),le();else{document.getElementById("app-access-error").classList.remove("hidden");const a=document.getElementById("app-access-form");a.classList.add("shake"),setTimeout(()=>a.classList.remove("shake"),500)}}}function le(){l.loadLocalAuth();const e=document.getElementById("app");e.innerHTML=`
            <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 shadow"></div>
                <p class="text-slate-500 font-medium fade-in">Conectando...</p>
            </div>
        `,he()}function X(){b.getLocal(ie)==="true"?le():ze()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",X):X();
