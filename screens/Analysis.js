import React, { useState, useEffect } from "react";
import { Dimensions, View, ScrollView, StyleSheet, Text } from "react-native";
import { LineChart, PieChart, ContributionGraph } from "react-native-chart-kit";
import Hr from "../components/HorizontalRule";
import AppSafeAreaView from "../components/AppSafeAreaView";
const colorDefinitions = require("../assets/colorDefinition.json");
const dummyData = require("../assets/dummyData.json");

/* https://github.com/indiespirit/react-native-chart-kit */

export default function Analysis(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const dataArray = dummyData.map((item) => {
      let rObj = { ...item };
      rObj["date"] = new Date(item.date);
      rObj["createdAt"] = new Date(item.createdAt);
      rObj["modifiedAt"] = new Date(item.modifiedAt);
      return rObj;
    });

    dataArray.sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    setData(dataArray);
  }, []);

  const dataStartDate = new Date(
    Math.min(...dummyData.map((e) => new Date(e.date)))
  );
  const dataEndDate = new Date(
    Math.max(...dummyData.map((e) => new Date(e.date)))
  );
  const msOneDay = 24 * 60 * 60 * 1000;
  const diffDays =
    Math.round(Math.abs((dataEndDate - dataStartDate) / msOneDay)) + 1;

  /* Ausgaben pro Tag */
  const valueDateArray = createDateArray(dataStartDate, diffDays);

  valueDateArray.forEach((element) => {
    let value = element.value;
    for (let index = 0; index < data.length; index++) {
      if (data[index].date.toDateString() === element.date.toDateString()) {
        value = value + data[index].amount;
      }
    }
    element.count = value;
  });
  /* Ausgaben pro Tag Ende */

  /* Ausgaben pro Monat */
  const chartMonthArray = createMonthArray(dataStartDate, dataEndDate, data);
  /* Ausgaben pro Monat Ende */

  /* Ausgaben pro Kategorie */
  const chartCategoryArray = createCategoryArray(data);

  const chartData = [
    {
      name: "Seoul",
      population: 21500000,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Toronto",
      population: 2800000,
      color: "#F00",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Beijing",
      population: 527612,
      color: "red",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "New York",
      population: 8538000,
      color: "#ffffff",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Moscow",
      population: 11920000,
      color: "rgb(0, 0, 255)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];
  /* Ausgaben pro Kategorie Ende */

  const chartWidth = Dimensions.get("window").width * 0.95;
  const chartHeight = 250;

  const chartConfig2 = {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  };

  return (
    <AppSafeAreaView title="Analyse">
      <ScrollView style={styles.container}>
        <Text style={styles.chartDescription}>
          Übersicht der Ausgaben pro Tag
        </Text>
        <ContributionGraph
          values={valueDateArray}
          endDate={dataEndDate}
          numDays={diffDays}
          width={chartWidth}
          height={chartHeight}
          chartConfig={chartConfig2}
          style={styles.chartSelf}
        />

        <Hr />

        <Text style={styles.chartDescription}>Übersicht der Ausgaben</Text>
        {/*         <LineChart
          data={{
            labels: chartMonthArray.labels,
            datasets: [{ data: chartMonthArray.values }],
          }}
          width={chartWidth} // from react-native
          height={chartHeight}
          yAxisLabel=""
          yAxisSuffix="€"
          yAxisInterval={10} // optional, defaults to 1
          chartConfig={chartConfig2}
          style={styles.chartSelf}
          bezier
        /> */}

        <Hr />

        <Text style={styles.chartDescription}>
          Übersicht der Kategorien (TODO)
        </Text>
        <PieChart
          //data={chartData}
          data={chartCategoryArray}
          //accessor={"population"}
          accessor={"value"}
          width={chartWidth}
          height={chartHeight}
          chartConfig={chartConfig2}
        />
        <Text>Ausgaben pro Geschäft</Text>
        <Text>Komponente kommt hier</Text>
      </ScrollView>
    </AppSafeAreaView>
  );
}

function createDateArray(startDate, days) {
  const array = [];
  for (let index = 0; index < days; index++) {
    array.push({
      date: addDays(startDate, index),
      value: 0,
    });
  }
  return array;

  function addDays(date, days) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}

function createMonthArray(startDate, endDate, data) {
  const months = monthDiff(startDate, endDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const array = [];
  const returnArray = { labels: [], values: [] };

  for (let index = 0; index < months; index++) {
    array.push({
      date: addMonths(startDate, index),
      value: 0,
    });
  }

  array.forEach((element) => {
    const date = new Date(element.date);
    let value = 0;
    for (let index = 0; index < data.length; index++) {
      if (
        data[index].date.getUTCMonth() === date.getUTCMonth() &&
        data[index].date.getUTCFullYear() === date.getUTCFullYear()
      ) {
        value = value + data[index].amount;
      }
    }

    returnArray.labels.push(
      monthNames[date.getUTCMonth()] + " " + date.getUTCFullYear().toString()
    );
    returnArray.values.push(value);
  });

  return returnArray;

  function addMonths(date, months) {
    let result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  function monthDiff(d1, d2) {
    let months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months + 1;
  }
}

function createCategoryArray(data) {
  const returnArray = [];

  data.forEach((element) => {
    let val = 0;
    for (let index = 0; index < data.length; index++) {
      if (data[index].category === element.category) {
        const elVal = parseFloat(data[index].amount);
        val += elVal;
      }
    }
    returnArray.push({
      name: element.category,
      value: val,
      color: "red",
      legendFontColor: "red",
      legendFontSize: 15,
    });
  });

  /* Add Color */
  const colorArray = generateColor(
    colorDefinitions.light.pink,
    colorDefinitions.light.blue,
    returnArray.length
  );
  for (let index = 0; index < returnArray.length; index++) {
    returnArray[index].color = "#" + colorArray[index];
    if (returnArray[index].value < 0) {
      returnArray[index].value = returnArray[index].value * -1;
    } else {
      returnArray.splice(index, 1);
    }
  }

  console.log(returnArray);
  return returnArray;

  function hex(c) {
    let s = "0123456789abcdef";
    let i = parseInt(c);
    if (i == 0 || isNaN(c)) return "00";
    i = Math.round(Math.min(Math.max(0, i), 255));
    return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16);
  }

  /* Convert an RGB triplet to a hex string */
  function convertToHex(rgb) {
    return hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
  }

  /* Remove '#' in color hex string */
  function trim(s) {
    return s.charAt(0) == "#" ? s.substring(1, 7) : s;
  }

  /* Convert a hex string to an RGB triplet */
  function convertToRGB(hex) {
    let color = [];
    color[0] = parseInt(trim(hex).substring(0, 2), 16);
    color[1] = parseInt(trim(hex).substring(2, 4), 16);
    color[2] = parseInt(trim(hex).substring(4, 6), 16);
    return color;
  }

  function generateColor(colorStart, colorEnd, colorCount) {
    // The beginning of your gradient
    let start = convertToRGB(colorStart);

    // The end of your gradient
    let end = convertToRGB(colorEnd);

    // The number of colors to compute
    let len = colorCount;

    //Alpha blending amount
    let alpha = 0.0;

    let saida = [];

    for (let i = 0; i < len; i++) {
      let c = [];
      alpha += 1.0 / len;

      c[0] = start[0] * alpha + (1 - alpha) * end[0];
      c[1] = start[1] * alpha + (1 - alpha) * end[1];
      c[2] = start[2] * alpha + (1 - alpha) * end[2];

      saida.push(convertToHex(c));
    }

    return saida;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  chartSelf: {
    alignSelf: "center",
    marginVertical: 8,
    borderRadius: 16,
  },
  chartDescription: {
    marginHorizontal: 10,
    fontSize: 20,
  },
});
