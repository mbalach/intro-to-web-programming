let foundCode = "";
let chart;

// Changes the chart depending on what city user inputs
const submitButton = document.getElementById("submit-data");
submitButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const inputArea = document.getElementById("input-area");
  let municipalityToSearch = inputArea.value.toLowerCase();
  foundCode = await getMunicipalityCode(municipalityToSearch);
  //console.log(foundCode);
  const areaPopulationData = await getPopulationData(foundCode);

  if (areaPopulationData) {
    const areaPopYears = Object.values(areaPopulationData.dimension.timeperiod_y.category.label);
    const areaPopValues = areaPopulationData.value;
    
    chart.update({
    labels: areaPopYears,
    datasets: [
      {
        name: inputArea.value || "Whole Country",
        values: areaPopValues
      }
    ]
  });
  }

});

const navButton = document.getElementById("navigation");
if (navButton) {
  navButton.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = `newchart.html?code=${foundCode || "SSS"}`;
  });
}

const estimateButton = document.getElementById("add-data");
estimateButton.addEventListener("click", () => {
  const currentPopValues = chart.data.datasets[0].values;
  const currentYears = chart.data.labels;

  let totalDelta = 0;

  for (let i = 1; i < currentPopValues.length; i++) {
    const thisDelta = currentPopValues[i] - currentPopValues[i - 1];
    totalDelta += thisDelta;
  }

  const meanDelta = totalDelta / (currentPopValues.length - 1);
  const nextPopValue = (currentPopValues[currentPopValues.length - 1]) + meanDelta;
  
  const lastYear = parseInt(currentYears[currentYears.length - 1]);
  const nextYear = (lastYear + 1).toString(); // Used AI understand that frappe chart needs string arrays

  // Got help from AI to append data more efficiently
  const updatedYears = [...currentYears, nextYear];
  const updatedPopValues = [...currentPopValues, nextPopValue];

  chart.update({
    labels: updatedYears,
    datasets: [
      {
        name: chart.data.datasets[0].name,
        values: updatedPopValues
      }
    ]
  });

});

// Returns the municipality code
const getMunicipalityCode = async (areaToFind) => {
  const areaUrl = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/12dy.px";

  const res = await fetch(areaUrl);

  if (!res.ok) {
    return;
  }

  const areaData = await res.json();
  //console.log(data);

  const areaCodes = areaData.variables[1].values;
  const areaNames = areaData.variables[1].valueTexts;
  //console.log(areaNames);
  //console.log(areaCodes);

  let areaDic = {}

  // Dictionary for faster lookup
  areaNames.forEach( (thisAreaName,index) => {
    areaDic[thisAreaName.toLowerCase()] = areaCodes[index];
  });
  //console.log(areaDic);

  if (areaDic[areaToFind]) {
    return areaDic[areaToFind];
  } else {
    return "";
  }

};

//getMunicipalityCode();

// To get the data about the population 
const getPopulationData = async (areaCode) => {
  const popDataURL = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/12dy.px";

  let res;

  if (areaCode == "" || !areaCode) {

    res = await fetch(popDataURL, {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify(
        {
    "query": [
      {
        "code":"timeperiod_y",
        "selection": {
          "filter":"item",
          "values":[
            "2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019","2020","2021"
          ]
          }
        },
        {
          "code":"alue_23_20260101",
          "selection": {
            "filter":"item",
            "values":[
              "SSS"
              ]
            }
          },
          {
            "code":"contentscode",
            "selection": {
              "filter":"item",
              "values":[
                "synt-vaesto"
                ]
              }
            }
          ],
          "response": {
            "format":"json-stat2"
            }
          }
      )
    });
  } else {
    res = await fetch(popDataURL, {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify(
        {
    "query": [
      {
        "code":"timeperiod_y",
        "selection": {
          "filter":"item",
          "values":[
            "2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019","2020","2021"
          ]
          }
        },
        {
          "code":"alue_23_20260101",
          "selection": {
            "filter":"item",
            "values":[
              areaCode
              ]
            }
          },
          {
            "code":"contentscode",
            "selection": {
              "filter":"item",
              "values":[
                "synt-vaesto"
                ]
              }
            }
          ],
          "response": {
            "format":"json-stat2"
            }
          }
      )
    });
  }

  if(!res.ok) {
        return;
    }
    const data = await res.json()

    return data

};

// To build the chart
const buildChart = async () => {

  const populationData = await getPopulationData();
  console.log(populationData);

  const years = Object.values(populationData.dimension.timeperiod_y.category.label);
  const popValues = populationData.value;

  console.log(years);
  console.log(popValues);
  
  const chartData = {
    labels: years,
    datasets: [
      {
      name: "Population", // The label shown in the legend
      values: popValues   // The actual numbers that map to the points on the graph
      }
    ]
  };

  chart = new frappe.Chart("#chart", {
    title: "Finnish population chart",
    data: chartData,
    type: "line",
    height: 450,
    colors: ["#eb5146"]
  });

};

buildChart();



