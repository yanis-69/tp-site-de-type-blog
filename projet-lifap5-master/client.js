 
// Constantes de configuration

// Clé Yanis REZAOUI : bdc8e0f8-e51a-4c64-8993-fb1df69ca583


const apiKey = "bdc8e0f8-e51a-4c64-8993-fb1df69ca583";
const serverUrl = "https://lifap5.univ-lyon1.fr";


/*
 ********************************************************************
 * Gestion des tabs "Voter" et "Toutes les citations"               *
 ******************************************************************** 
 */

/**
 * Affiche/masque les divs "div-duel" et "div-tout"
 * selon le tab indiqué dans l'état courant.
 *
 * @param {Etat} etatCourant l'état courant
 */

function set_none(tRemplir,tTout,tDuel,dTout,dDuel,dRemplir,dmodif,tmodif){
  tRemplir.classList.remove("is-active");
  tmodif.classList.remove("is-active");
  tTout.classList.remove("is-active");
  tDuel.classList.remove("is-active");
  dTout.style.display = "none";
  dDuel.style.display = "none";
  dRemplir.style.display = "none";
  dmodif.style.display = "none";
}

function active(etatCourant,tRemplir,tTout,tDuel,dTout,dDuel,dRemplir,dmodif,tmodif)
{
  if (etatCourant.tab === "duel") {
    dDuel.style.display = "flex";
    tDuel.classList.add("is-active");    
  } else if(etatCourant.tab === "tout"){
    dTout.style.display = "flex";
    tTout.classList.add("is-active");
    RemplieChamp();
  }else if(etatCourant.tab === "modif"){
     dmodif.style.display = "flex";
     tmodif.classList.add("is-active"); 
     get_tab_modif();
    }
     else{
        dRemplir.style.display = "flex";
        tRemplir.classList.add("is-active"); 
 } }

function majTab(etatCourant) {
  console.log("CALL majTab");
  const dDuel = document.getElementById("div-duel");
  const dTout = document.getElementById("div-tout");
  const tDuel = document.getElementById("tab-duel");
  const tTout = document.getElementById("tab-tout");
  const dRemplir= document.getElementById("div-Remplir");
  const tRemplir= document.getElementById("tab-Remplir");
  const dmodif= document.getElementById("div-modif");
  const tmodif= document.getElementById("tab-modif");
  set_none(tRemplir,tTout,tDuel,dTout,dDuel,dRemplir,dmodif,tmodif);
  active(etatCourant,tRemplir,tTout,tDuel,dTout,dDuel,dRemplir,dmodif,tmodif);
}

/**
 * Mets au besoin à jour l'état courant lors d'un click sur un tab.
 * En cas de mise à jour, déclenche une mise à jour de la page.
 *
 * @param {String} tab le nom du tab qui a été cliqué
 * @param {Etat} etatCourant l'état courant
 */
function clickTab(tab, etatCourant) {
  console.log(`CALL clickTab(${tab},...)`);
  if (etatCourant.tab !== tab) {
    etatCourant.tab = tab;
    majPage(etatCourant);
  }
}

/**
 * Enregistre les fonctions à utiliser lorsque l'on clique
 * sur un des tabs.
 *
 * @param {Etat} etatCourant l'état courant
 */
function registerTabClick(etatCourant) {
  console.log("CALL registerTabClick");
  
  document.getElementById("tab-duel").onclick = () =>
    clickTab("duel", etatCourant);
  document.getElementById("tab-tout").onclick = () =>
    clickTab("tout", etatCourant);
    document.getElementById("tab-Remplir").onclick = () =>
    clickTab("Remplir", etatCourant);
    document.getElementById("tab-modif").onclick = () =>
    clickTab("modif", etatCourant);
}

/* ******************************************************************
 * Gestion de la boîte de dialogue (a.k.a. modal) d'affichage de
 * l'utilisateur.
 * ****************************************************************** */

/**
 * Fait une requête GET authentifiée sur /whoami
 * @returns une promesse du login utilisateur ou du message d'erreur
 */
function fetchWhoami(k) {
  return fetch(serverUrl + "/whoami", { headers: { "x-api-key": k } })
    .then((response) => response.json())
    .then((jsonData) => {
      if (jsonData.status && Number(jsonData.status) != 200) {
        return { err: jsonData.message };
      }
      return jsonData;
    })
    .catch((erreur) => ({ err: erreur }));
}

function request(){
  const key_test = document.getElementById("champ").value;
  ok = lanceWhoamiEtInsereLogin(key_test);
  document.principal.champ.value=key_test;
  if(ok )
  {
    actualiser_duel();
  }
}

/**
 * Fait une requête sur le serveur et insère le login dans
 * la modale d'affichage de l'utilisateur.
 * @returns Une promesse de mise à jour
 */

function lanceWhoamiEtInsereLogin(k) {
  return fetchWhoami(k).then((data) => {
    const elt = document.getElementById("elt-affichage-login");
    const ok = data.err === undefined;
    if (!ok) {
      elt.innerHTML = `<span class="is-error">${data.err}</span>`;
    } else {
      elt.innerHTML = `Bonjour ${data.login}.`;
      document.log.champ_log.value=data.login;
    }
    return ok;
  });
}

/**
 * Affiche ou masque la fenêtre modale de login en fonction de l'état courant.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majModalLogin(etatCourant) {
  const modalClasses = document.getElementById("mdl-login").classList;
  if (etatCourant.loginModal) {
    modalClasses.add("is-active");
  } else {
    modalClasses.remove("is-active");
  }
}

/**
 * Déclenche l'affichage de la boîte de dialogue du nom de l'utilisateur.
 * @param {Etat} etatCourant
 */
function clickFermeModalLogin(etatCourant) {
  etatCourant.loginModal = false;
  majPage(etatCourant);
}

/**
 * Déclenche la fermeture de la boîte de dialogue du nom de l'utilisateur.
 * @param {Etat} etatCourant
 */
function clickOuvreModalLogin(etatCourant) {
  etatCourant.loginModal = true;
  majPage(etatCourant);
}

/**
 * Enregistre les actions à effectuer lors d'un click sur les boutons
 * d'ouverture/fermeture de la boîte de dialogue affichant l'utilisateur.
 * @param {Etat} etatCourant
 */
function registerLoginModalClick(etatCourant) {
  document.getElementById("btn-close-login-modal1").onclick = () =>
    clickFermeModalLogin(etatCourant);
  document.getElementById("btn-close-login-modal2").onclick = () =>
    clickFermeModalLogin(etatCourant);
  document.getElementById("btn-open-login-modal").onclick = () =>
    clickOuvreModalLogin(etatCourant);
  
}

/* ******************************************************************
 * Initialisation de la page et fonction de mise à jour
 * globale de la page.
 * ****************************************************************** */

/**
 * Mets à jour la page (contenu et événements) en fonction d'un nouvel état.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majPage(etatCourant) {
  console.log("CALL majPage");
  majTab(etatCourant);
  majModalLogin(etatCourant);
  registerTabClick(etatCourant);
  registerLoginModalClick(etatCourant);
}

/**
 * Appelé après le chargement de la page.
 * Met en place la mécanique de gestion des événements
 * en lançant la mise à jour de la page à partir d'un état initial.
 */
function initClientCitations() {
  console.log("CALL initClientCitations");
  const etatInitial = {
    tab: "duel",
    loginModal: false,
  };
  majPage(etatInitial);
}

// Appel de la fonction init_client_duels au après chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  console.log("Exécution du code après chargement de la page");
  initClientCitations();
});


// --------------------------------------------
// ------------ PARTIE ELEVE ------------------
// --------------------------------------------


/*
*****************************************************
* Fonction permettant d'afficher le tableau - Début *
*****************************************************
*/

// Fonction qui charge l'ensemble des citations + Gestion du duel

function getTabFromServ(){
  return fetch(serverUrl + "/citations")
    .then((response) => response.json())
    .then((jsonData) => {
      if (jsonData.status && Number(jsonData.status) != 200) {
        return { err: jsonData.message };
      }
      return jsonData;
    })
    .catch((erreur) => ({ err: erreur }));
}

// Fonction qui actualise le duel à chaque vote 
/**
 */
function actualiser_duel(){
  const test = document.getElementById("recup_api").value;
  console.log(test);
  if(test != "")
  {
    get_tab();
  }
}

// Fonction qui va appeler vote_tab tout en gérant les erreurs de connexion (API)

function get_tab(){
  return getTabFromServ().then((data) => {
    const ok = data.err === undefined;
    const t=data;
    if (!ok) {
      elt.innerHTML = `<span class="is-error">${data.err}</span>`;
    } else {
      vote_tab(t);
    }
    return ok;
  });
}

// Fonction d'affichage du tableau 
/**
 * appel affiche_citation qui affiche le tableau 
 */
function RemplieChamp(){
  return getTabFromServ().then((data) => {
    const ok = data.err === undefined;
    const t=data;
    if (!ok) {
      elt.innerHTML = `<span class="is-error">${data.err}</span>`;
    } else {
      affiche_citation(t);
    }
    const t2 = t;
  });  
}

// Fonction permettant d'afficher toutes les citations 

/**
 * affiche les citations (quote + character + id)
 * @param {tableau de citations} t 
 */
function affiche_citation(t){
  const tab = document.getElementById("tableau");
  const tblBody = document.createElement("tbody");
  for (const i of t) {
  let row = document.createElement("tr");
  let cell1 = document.createElement("th");
  let cell2 = document.createElement("th");
  let cell3 = document.createElement("th");
  let cellText1 = document.createTextNode( i.character);
   let cellText2 = document.createTextNode(i.quote );
  let cellText3 = document.createTextNode(i._id );
  cell1.appendChild(cellText1);
  row.appendChild(cell1);
  cell2.appendChild(cellText2);
  row.appendChild(cell2);
  cell3.appendChild(cellText3);
  row.appendChild(cell3);
  tblBody.appendChild(row); 
 }
  tab.appendChild(tblBody);}

/*
*****************************************************
* Fonction permettant d'afficher le tableau - Fin *
*****************************************************
*/

/*
**************************************************************
* Fonction permettant de modifier une citation (PUT) - Début *
**************************************************************
*/

/**
 * 
 * @returns une promesse tableau de citations
 */
 function get_tab_modif(){
  return getTabFromServ().then((data) => {
    const ok = data.err === undefined;
    const t=data;
      if (!ok) {
                  elt.innerHTML = `<span class="is-error">${data.err}</span>`;
               }
               else {
                      affiche_modif(t);
                    }  
  });
}

/**
 * 
 function recup_login(){
  const key_login = document.getElementById("recup_api").value;
    return fetchWhoami(key_login).then((data) => {
      const ok = data.err === undefined;
      if (!ok) {
        elt.innerHTML = `<span class="is-error">${data.err}</span>`;
      } 
  });
}

/**
 * fonction reset qui acutalise la page deconnectant le user
 */
function reset(){
  if(document.getElementById("login").value != "")
  {
    history.go(0);
  }
}

/**
 * Initalise les paramètres de modification
 * @returns Myinit qui initialise les éléments a envoyer pour modifier
 */
function init_para_modif(){
  const k = document.getElementById("recup_api").value;
   const form = JSON.stringify(
     {"quote": document.getElementById("input-mcitation").value, 
       "character": document.getElementById("input-mpersonnage").value,
       "image": document.getElementById("input-mlien").value,
       "direction" : document.getElementById("input-mdirection").value,
       "origin": document.getElementById("input-morigin").value
         })
          const myHeaders = new Headers();
myHeaders.append("x-api-key", k );
myHeaders.append("Content-type","Application/json");                 
const myInit = { method: 'PUT',
               headers: myHeaders,
               mode: 'cors',
               body : form,
               cache: 'default' };           
  return myInit;
}


 // Permet d'envoyer notre requête PUT
 
 function submit_modif(){
  id = document.getElementById("input-mid").value;
  fetch(serverUrl + '/citations/'+id ,init_para_modif())
  .then(function(response) {
    if (response.status != 200) {
      alert("erreur numéro :" + response.status);
   }else(alert("Formulaire ajouté sans problème" + response.status));
   return response.blob();
  })
};

/**
 * Affiche les éléments posté uniquement par User
 * @param {Etat} user permet de sélectionner les citations de user uniquement
 * @param {*} tab 
 * @param {*} tblBody 
 */
  function affiche_modif_2(user,tab,tblBody,t){
    for (const i of t)
     {
       let row = document.createElement("tr");
       let row2=document.createElement("tr");
        if(i.addedBy === user)
        {
        let cell = document.createElement("td");
        let cell2 = document.createElement("td");
        cellText = document.createTextNode( i._id );
        cellText2=document.createTextNode(i.quote);
        cell2.appendChild(cellText2);
        cell.appendChild(cellText);
        row.appendChild(cell);
        row.appendChild(cell2);
       }
       tblBody.appendChild(row);
       tblBody.appendChild(row2);
       tab.appendChild(tblBody);
     }
     tab.appendChild(tblBody);}

     /**
      * affiche les citations postés par l'utilisateur connécté
      * @param {tableau de citations} t 
      */
  function affiche_modif(t){
    user = document.getElementById("login").value;
    const tab = document.getElementById("tableau-modif");
    const  tblBody = document.createElement("tbody");
    affiche_modif_2(user,tab,tblBody,t);
   }
   /**
   * Fin AFFICHE                                                       
   */

  /*****************************************************************
   * Fin PUT                                                       *
   * ***************************************************************
   */

/* ******************************************************************
 * Fonction s'occupant de POST les votes
 ******************************************************************** */

/**
 * affiche les images en fonctions du coté
 * @param {lien de la citation} link 
 * @param {coté ou afficher l'image} coté 
 */
function affiche_image(link,coté){
  const get_id = document.getElementById(coté);
const debut = "<div class=\"card-image\"><figure class=\"image\">";
let image_s= "<img src="+link+" >";
let image =debut+image_s+"</figure></div>";
//console.log(image);
 get_id.innerHTML = image ;

}

/**
 * insère du text dans un coté
 * @param {écupère la citation (quote)} text 
 * @param {le place par raport au coté} coté 
 */
function affiche_text(text,coté){
const get_id = document.getElementById(coté);
get_id.insertAdjacentHTML('aftebegin', text);
 
}


/**
 * 
 
function vote(){
let image_t= "https://cdn.glitch.com/3c3ffadc-3406-4440-bb95-d40ec8fcde72%2FRalphWiggum.png?1497567511523";
affiche_image(image_t,"gauche");
let text = "<p class=\"title\">\"They taste like...burning.\"</p>";
affiche_text(text,"gauche");
}
*/

/**
 * 
 * @param {indique le numéro de tableau de la partie droite} d 
 * @param {indique le numéro de tableau de la partie gauche} l 
 * @param {tableau de citation} t 
 * @returns 
 */
function get_rand(d,l,t){
 if(d!=l)
 {
   return l
}
 else{
   get_rand(d,generateRandom(0,t.length-1))
  };
}

/**
 * verifie la direction des personnages
 * @param {numéro de tableau de l'élément de droite} d 
 * @param {numéro de tableau de l'élément de gauche} l 
 * @param {tableau de citation } t 
 * @returns true si les images sont bien orientés
 */
function check_dir(d,l,t){
  
  if(t[d].characterDirection="Left")
  {
    if(t[l].characterDirection="Right")
    {
      console.log("ma direction est Left normalement :"+ t[d].characterDirection);
  console.log("ma direction est Right normalement :"+ t[l].characterDirection);
      return true;
    }
  }
  if(t[d].characterDirection!="Left")
  {check_dir(generateRandom(0,t.length),l,t);}
  if(t[l].characterDirection!="Right")
  {check_dir(d,get_rand(d,l,t),t);}

}

/**
 * verifie si un lien commence avec au moins hhtps
 * @param {lien de la citation} lien 
 * @returns true si ca commence avec au moins https
 */
function verif_image(lien){
  if(lien.search("https:")==-1)
  {
     return false;
  }else
  {
    return true;
  }
}
const err = "https://pbs.twimg.com/media/EAZJNpyWkAE_kWP.jpg";

/**
 * affiche les parties droite et gauche pour voter
 * @param {tableau de citations} t 
 */
function vote_tab(t){
  d = generateRandom(0,t.length-1);
  l= generateRandom(0,t.length-1);
  l = get_rand(d,l,t);
  a = document.getElementById("recup_api").value;
  console.log(a);
  if(check_dir(d,l,t)==true)
  {
    if(verif_image(t[l].image)==true)
    {affiche_image(t[l].image,"gauche");}else{affiche_image(err,"gauche");}
    if(verif_image(t[d].image)==true)
    {affiche_image(t[d].image,"droite");}else{affiche_image(err,"droite");}
    affiche_text(t[l].quote,"gauche");
    affiche_text(t[d].quote,"droite");
    document.voteg.champ.value=t[l]._id;
    document.voted.champ.value=t[d]._id;  
  }}

/**
 * Initialise gauche gagnant
 * @returns myinit qui initialise les paramètre a envoyer au serveur
 */
function init_para_vote_gauche(){
  const k = document.getElementById("recup_api").value;
   const form = JSON.stringify(
     { "winner": document.getElementById("recup_gauche").value, 
       "looser": document.getElementById("recup_droite").value,
       
         })
          const myHeaders = new Headers();
myHeaders.append("x-api-key", k );
myHeaders.append("Content-type","Application/json");                 
const myInit = { method: 'POST',
               headers: myHeaders,
               mode: 'cors',
               body : form,
               cache: 'default' };           
  return myInit;
}


/**
 * Initialise droit gagnant
 * @returns myinit qui initialise les paramètre a envoyer au serveur
 */
function init_para_vote_droite(){
  const k = document.getElementById("recup_api").value;
   const form = JSON.stringify(
     { "winner": document.getElementById("recup_droite").value, 
       "looser": document.getElementById("recup_gauche").value,
       
         })
          const myHeaders = new Headers();
myHeaders.append("x-api-key", k );
myHeaders.append("Content-type","Application/json");                 
const myInit = { method: 'POST',
               headers: myHeaders,
               mode: 'cors',
               body : form,
               cache: 'default' };           
  return myInit;
}

/**
 * envoie au serveur gauche gagnant
 */
function submit_gauche(){
  fetch(serverUrl + '/citations/duels' , init_para_vote_gauche())
  .then(function(response){
    return response.blob();
  })
  actualiser_duel();
};

/**
 * envoie au serveur droit gagnant
 */
function submit_droite(){
  fetch(serverUrl + '/citations/duels' , init_para_vote_droite())
  .then(function(response){
    return response.blob();
  })
  actualiser_duel();
};

/*****************************************************************
   * Fin Voter                                                      *
   * ***************************************************************
   */



/* ******************************************************************
 * Fonction s'occupant de POST une citation
 ******************************************************************** */
/**
 * initialise les paramètres à envoyer
 * @returns les paramètres d'envois
 */
function init_para(){
  const k = document.getElementById("recup_api").value;
   const form = JSON.stringify(
     {"quote": document.getElementById("input-citation").value, 
       "character": document.getElementById("input-personnage").value,
       "image": document.getElementById("input-lien").value,
       "direction" : document.getElementById("input-direction").value,
       "origin": document.getElementById("input-origin").value
         })
          const myHeaders = new Headers();
myHeaders.append("x-api-key", k );
myHeaders.append("Content-type","Application/json");                 
const myInit = { method: 'POST',
               headers: myHeaders,
               mode: 'cors',
               body : form,
               cache: 'default' };           
  return myInit;
}
/********************************************* */

/**
 * envoie la citation au serveur
 */
 function submit(){
  fetch(serverUrl + '/citations',init_para())
  .then(function(response) {
    const ok = response.err ;
    if (response.status != 201) {
       alert("erreur numéro :" + response.status);
    }else(alert("Formulaire ajouté sans problème :" + response.status));
    return response.blob();  
  })
};
/********************************************** */

/*****************************************************************
   * Fin POST Citation                                                      *
   * ***************************************************************
   */

/**
 * Fonction aléatoire
 * @param {0} min 
 * @param {taille tableau moins 1} max 
 * @returns  un nombre entre min et max 
 */
function generateRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

