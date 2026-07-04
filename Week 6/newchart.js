let chart;

// Gets the data about births or deaths
const getStatData = async (contentsCode) => {
  const popDataURL = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/12dy.px";

  const urlParams = new URLSearchParams(window.location.search);
  const areaCode = urlParams.get("code") || "SSS";

  const res = await fetch(popDataURL, {
    method: "POST",
    headers: {"content-type": "application/json"},
    body: JSON.stringify({
      "query": [
        {
          "code": "timeperiod_y",
          "selection": {
            "filter": "item",
            "values": ["2000","2001","2002","2003","2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019","2020","2021"]
          }
        },
        {
          "code": "alue_23_20260101",
          "selection": {
            "filter": "item",
            "values": [areaCode]
          }
        },
        {
          "code": "contentscode",
          "selection": {
            "filter": "item",
            "values": [contentsCode]
          }
        }
      ],
      "response": { "format": "json-stat2" }
    })
  });

  if (!res.ok) {
    return;
  }
  const data = await res.json();
  return data;
};

// Builds the chart
const buildChart = async () => {
  
  const birthData = await getStatData("synt-vm01");
  const deathData = await getStatData("synt-vm11");

  const years = Object.values(birthData.dimension.timeperiod_y.category.label);
  const birthValues = birthData.value;
  const deathValues = deathData.value;
  
  const chartData = {
    labels: years,
    datasets: [
      {
        name: "Births",
        values: birthValues
      },
      {
        name: "Deaths",
        values: deathValues
      }
    ]
  };

  chart = new frappe.Chart("#chart", {
    title: "Births and Deaths",
    data: chartData,
    type: "bar",
    height: 450,
    colors: ["#63d0ff", "#363636"]
  });
};

buildChart();