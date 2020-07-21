// function to set a given theme/color-scheme
function setTheme(themeName) {
  localStorage.setItem("theme", themeName);
  document.documentElement.className = themeName;
}

// function to toggle between light and dark theme
function toggleTheme() {
  if (localStorage.getItem("theme") === "theme-dark") {
    setTheme("theme-light");
  } else {
    setTheme("theme-dark");
  }
}

// Immediately invoked function to set the theme on initial load
(function () {
  if (localStorage.getItem("theme") === "theme-dark") {
    setTheme("theme-dark");
    // console.log(document.getElementById("slider").checked)
    // document.getElementById("slider").checked = true;
  } else {
    setTheme("theme-light");
    // document.getElementById("slider").checked = false;
  }
})();

//Get theme on window load and change slider position
function getTheme() {
    var pp = localStorage.getItem("theme");
    // document.documentElement.className = pp;
    console.log(pp);
    if (pp === "theme-dark") {
      document.getElementById("slider").checked = true;
    } else {
      document.getElementById("slider").checked = false;
    }
  }