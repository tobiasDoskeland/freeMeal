async function tilfeldigCocktail() {
    //henter tilfeldig cocktail, på onclick
    //henter APIen
    var strDrink,
      strCategory,
      strAlcoholic,
      strInstructions,
      strGlass,
      strDrinkThumb,
      strIngredient,
      strMeasure;
    try {
      var response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php");
      var data = await response.json();
    } catch (error) {
      console.error("Error ved henting av data", error);
    }
    var element = data.drinks[0];
  
    strDrink = element.strDrink;
    strCategory = element.strCategory;
    strAlcoholic = element.strAlcoholic;
    strGlass = element.strGlass;
    strInstructions = element.strInstructions;
    strDrinkThumb = element.strDrinkThumb;
  
    var fullListe = "";
  
    for (let i = 1; i < 15; i++) {
      const ingredientKey = `strIngredient${i}`;
      const measureKey = `strMeasure${i}`;
      strIngredient = element[ingredientKey] || "";
      strMeasure = element[measureKey] || "";
  
      fullListe += `<li>${strMeasure} ${strIngredient} <li/>`;
      if (!element[measureKey]) {
        break;
      }
    }
    html = `<img src='${strDrinkThumb}' class="storbilde"> <br /><h1>${strDrink}</h1><p id="underskrift">${strCategory} - ${strAlcoholic} - ${strGlass}</p>
    <br><p>${strInstructions}</p><br><h2>Ingredients</h2><ul>${fullListe}</ul>`;
    document.getElementById("side").innerHTML = html;
}

document.getElementById("dKat").addEventListener("click", drikke_kategori);

async function drikke_kategori() {
  //henter APIen
  try {
    var response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list");
    var data = await response.json();
    var html = "<div id='kategori'>";

    for (var i = 0; i < data.drinks.length; i++) {
      html += `
    <div id='${data.drinks[i].strCategory}' class="drikke_kat">
    <p id="underskrift">${data.drinks[i].strCategory}</p></div>`;
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
      drikker(id);
    }
  });
}

async function drikker(kategori) {
  //henter APIen
  try {
    var response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${kategori}`);
    var data = await response.json();
  } catch (error) {
    console.error("Error ved henting av data", error);
  }

  var html = "<div id='drikker' class='row'>";

  for (let i = 0; i < data.drinks.length; i++) {
    html += `<div id='${data.drinks[i].idDrink}' class='column' ><img src='${data.drinks[i].strDrinkThumb}'> <br />
    <p id="underskrift">${data.drinks[i].strDrink}</p></div>`;
  }
  html += "</div>";
  document.getElementById("side").innerHTML = html;

  const container = document.querySelector("#drikker");
  container.addEventListener("click", function (event) {
    if (event.target.tagName === "IMG" || event.target.tagName === "P") {
      const id = event.target.parentNode.id;
      oppskrift_drikke(id);
    }
  });
}
async function oppskrift_drikke(drikker) {
  try {
    var response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drikker}`);
    var data = await response.json();
  } catch (error) {
    console.error("Error ved henting av data", error);
  }
  var strIngredient, strMeasure;
  var fullListe = "";

  for (let i = 1; i < 15; i++) {
    if (data.drinks[0]["strIngredient" + i] != "" && data.drinks[0]["strIngredient" + i] != null) {
      strIngredient = data.drinks[0]["strIngredient" + i];
      strMeasure = data.drinks[0]["strMeasure" + i];
      fullListe += `<li><input type="checkbox" id="check${[
        i,
      ]}"> ${strMeasure} ${strIngredient} <li/>`;
    }
  }
  var html = `<img src='${data.drinks[0].strDrinkThumb}'> <br /><h1>${data.drinks[0].strDrink}</h1><p id="underskrift">${data.drinks[0].strCategory} - ${data.drinks[0].strAlcoholic} - ${data.drinks[0].strGlass}</p>
    <br><p>${data.drinks[0].strInstructions}</p><br><h2>Ingredients</h2><ul>${fullListe}</ul>`;
  html = html.replaceAll("\r\n", "<br/>"); //bytter ut linjeskift med html linjeskift
  html = html.replaceAll("null", " ");
  document.getElementById("side").innerHTML = html;
}

//eventlistener for knapp
document.getElementById("sok").addEventListener("click",sokDrikke)
//eventlistener for Enter knapp
var input = document.getElementById("sokFelt");
input.addEventListener("keypress", function(event) {
  if(event.key === "Enter") {
    sokDrikke();
  }
});
  

async function sokDrikke() {
  var soket = document.getElementById("sokFelt").value;
  try {
    var response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${soket}`);
    var data = await response.json();
  } catch (error) {
    console.error("Error ved henting av data", error);
  }

  var html = "<div id='drikker' class='row'>";
  for (let i = 0; i < data.drinks.length; i++) {
    html += `<div id='${data.drinks[i].idDrink}' class='column' ><img src='${data.drinks[i].strDrinkThumb}'> <br />
    <p id="underskrift">${data.drinks[i].strDrink}</p></div>`;
  }
  html += "</div>";
  document.getElementById("side").innerHTML = html;

  const container = document.querySelector("#drikker");
  container.addEventListener("click", function (event) {
    if (event.target.tagName === "IMG" || event.target.tagName === "P") {
      const id = event.target.parentNode.id;
      oppskrift_drikke(id);
    }
  });
}