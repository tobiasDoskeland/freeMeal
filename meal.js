async function body_onload() {
  //henter tilfeldig matrett, på body onload
  //henter APIen
  try {
    var response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    var data = await response.json();
  } catch (error) {
    console.error("Error ved henting av data", error);
  }

  var strIngredient, strMeasure;
  var fullListe = "";

  for (let i = 1; i < 20; i++) {
    if (data.meals[0]["strIngredient" + i] != "" && data.meals[0]["strIngredient" + i] != "_" && data.meals[0]["strIngredient" + i] != null) {
      strIngredient = data.meals[0]["strIngredient" + i];
      strMeasure = data.meals[0]["strMeasure" + i];
      fullListe += `<li><input type="checkbox" id="check${[
        i,
      ]}"> ${strMeasure} ${strIngredient} <li/>`;
    }
  }
  var html = `<img src='${data.meals[0].strMealThumb}' class="storbilde"> <br /><h1>${data.meals[0].strMeal}</h1><p id="underskrift">${data.meals[0].strCategory} - ${data.meals[0].strArea}</p>
    <br><p>${data.meals[0].strInstructions}</p><br><h2>Ingredients</h2><ul>${fullListe}</ul>`;
  html = html.replaceAll("\r\n", "<br/>"); //bytter ut linjeskift med html linjeskift
  document.getElementById("side").innerHTML = html;
}

document.getElementById("mKat").addEventListener("click", kategori);

async function kategori() {
  //henter APIen
  try {
    var response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    var data = await response.json();
    var html = "<div id='kategori'>";
    for (var i = 0; i < data.categories.length; i++) {
      html += `
    <div id='${data.categories[i].strCategory}' class="kategori_css">
    <img src='${data.categories[i].strCategoryThumb}'> <br />
    <p id="underskrift">${data.categories[i].strCategory}</p></div>`;
    }
    html += "</div";
    document.getElementById("side").innerHTML = html;
  } catch (error) {
    console.error("Error ved henting av data", error);
  }
  const container = document.querySelector("#kategori");
  container.addEventListener("click", function (event) {
    if (event.target.tagName === "IMG" || event.target.tagName === "P") {
      const id = event.target.parentNode.id;
      matretter(id);
    }
  });
}

async function matretter(kategori) {
  //henter APIen
  try {
    var response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${kategori}`);
    var data = await response.json();
  } catch (error) {
    console.error("Error ved henting av data", error);
  }

  var html = "<div id='matretter' class='row'>";
  for (let i = 0; i < data.meals.length; i++) {
    html += `<div id='${data.meals[i].idMeal}' class='column' ><img src='${data.meals[i].strMealThumb}'> <br />
    <p id="underskrift">${data.meals[i].strMeal}</p></div>`;
  }
  html += "</div>";
  document.getElementById("side").innerHTML = html;

  const container = document.querySelector("#matretter");
  container.addEventListener("click", function (event) {
    if (event.target.tagName === "IMG" || event.target.tagName === "P") {
      const id = event.target.parentNode.id;
      oppskrift(id);
    }
  });
}
async function oppskrift(matretter) {
  try {
    var response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${matretter}`);
    var data = await response.json();
  } catch (error) {
    console.error("Error ved henting av data", error);
  }
  var strIngredient, strMeasure;
  var fullListe = "";

  for (let i = 1; i < 20; i++) {
    if (data.meals[0]["strIngredient" + i] != "" && data.meals[0]["strIngredient" + i] != "_" && data.meals[0]["strIngredient" + i] != null) {
      strIngredient = data.meals[0]["strIngredient" + i];
      strMeasure = data.meals[0]["strMeasure" + i];
      fullListe += `<li><input type="checkbox" id="check${[
        i,
      ]}"> ${strMeasure} ${strIngredient} <li/>`;
    }
  }
  var html = `<img src='${data.meals[0].strMealThumb}'> <br /><h1>${data.meals[0].strMeal}</h1><p id="underskrift">${data.meals[0].strCategory} - ${data.meals[0].strArea}</p>
    <br><p>${data.meals[0].strInstructions}</p><br><h2>Ingredients</h2><ul>${fullListe}</ul>`;
  html = html.replaceAll("\r\n", "<br/>"); //bytter ut linjeskift med html linjeskift
  document.getElementById("side").innerHTML = html;
}

//eventlistener for knapp
document.getElementById("sok").addEventListener("click",sokOppskrift)
//eventlistener for Enter knapp
var input = document.getElementById("sokFelt");
input.addEventListener("keypress", function(event) {
  if(event.key === "Enter") {
    sokOppskrift();
  }
});
  

async function sokOppskrift() {
  var soket = document.getElementById("sokFelt").value;
  var spraak = document.getElementById("LanSelect").value;
  try {
    if(spraak == 'no') {
      //oversettelse
      var rep = await fetch(`https://api.mymemory.translated.net/get?q=${soket}!&langpair=no|en`);
      var dataen = await rep.json();
      soket = dataen.responseData.translatedText;
    } 

    var response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${soket}`);
    var data = await response.json();

  } catch (error) {
    console.error("Error ved henting av data", error);
  }

  var html = "<div id='matretter' class='row'>";
  for (let i = 0; i < data.meals.length; i++) {
    html += `<div id='${data.meals[i].idMeal}' class='column' ><img src='${data.meals[i].strMealThumb}'> <br />
    <p id="underskrift">${data.meals[i].strMeal}</p></div>`;
  }
  html += "</div>";
  document.getElementById("side").innerHTML = html;

  const container = document.querySelector("#matretter");
  container.addEventListener("click", function (event) {
    if (event.target.tagName === "IMG" || event.target.tagName === "P") {
      const id = event.target.parentNode.id;
      oppskrift(id);
    }
  });
}