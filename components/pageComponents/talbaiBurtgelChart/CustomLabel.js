import React, { useLayoutEffect } from "react";

import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

//chart type
import * as am5percent from "@amcharts/amcharts5/percent";

function CustomLabel(props) {
  const chartID = props.chartID;
  
  useLayoutEffect(() => {
    var root = am5.Root.new(chartID);

    root.setThemes([am5themes_Animated.new(root)]);

    var chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        radius: am5.percent(90),
        innerRadius: am5.percent(50),
      })
    );

    // Define data
    var data = [
      {
        country: "yum",
        sales: 100000,
      },
      {
        country: "bas yum",
        sales: 160000,
      },
      {
        country: "bas neg yum",
        sales: 80000,
      },
    ];

    // Create series
    var series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        valueField: "sales",
        categoryField: "country",
      })
    );

    series.data.setAll(data);

    series.labels.template.set("visible", false);
    series.ticks.template.set("visible", false);
  }, [chartID]);

  return <div id={chartID} className="h-full w-full"></div>;
}
export default CustomLabel;
