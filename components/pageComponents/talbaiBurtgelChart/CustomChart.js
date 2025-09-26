import React, { useLayoutEffect } from "react";

import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

function CustomLabel(props) {
  const chartID = props.chartID;
  useLayoutEffect(() => {
    var root = am5.Root.new(chartID);

    root.setThemes([am5themes_Animated.new(root)]);

    var chart = root.container.children.push(
      am5radar.RadarChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        innerRadius: am5.percent(20),
        startAngle: -90,
        endAngle: 180,
      })
    );
    var data = [
      {
        category: "Research",
        value: 80,
        full: 100,
        columnSettings: {
          fill: chart.get("colors").getIndex(0),
        },
      },
      {
        category: "Marketing",
        value: 35,
        full: 100,
        columnSettings: {
          fill: chart.get("colors").getIndex(1),
        },
      },
      {
        category: "Distribution",
        value: 92,
        full: 100,
        columnSettings: {
          fill: chart.get("colors").getIndex(2),
        },
      },
      {
        category: "Human Resources",
        value: 68,
        full: 100,
        columnSettings: {
          fill: chart.get("colors").getIndex(3),
        },
      },
    ];
    var cursor = chart.set(
      "cursor",
      am5radar.RadarCursor.new(root, {
        behavior: "zoomX",
      })
    );

    cursor.lineY.set("visible", false);
    var xRenderer = am5radar.AxisRendererCircular.new(root, {});

    xRenderer.labels.template.setAll({
      radius: 10,
    });

    xRenderer.grid.template.setAll({
      forceHidden: true,
    });

    var xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: xRenderer,
        min: 0,
        max: 100,
        strictMinMax: true,
        numberFormat: "#'%'",
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    var yRenderer = am5radar.AxisRendererRadial.new(root, {
      minGridDistance: 20,
    });

    yRenderer.labels.template.setAll({
      centerX: am5.p100,
      fontWeight: "500",
      fontSize: 18,
      templateField: "columnSettings",
    });

    yRenderer.grid.template.setAll({
      forceHidden: true,
    });

    var yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: yRenderer,
      })
    );

    yAxis.data.setAll(data);
    var series1 = chart.series.push(
      am5radar.RadarColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        clustered: false,
        valueXField: "full",
        categoryYField: "category",
        fill: root.interfaceColors.get("alternativeBackground"),
      })
    );

    series1.columns.template.setAll({
      width: am5.p100,
      fillOpacity: 0.08,
      strokeOpacity: 0,
      cornerRadius: 20,
    });

    series1.data.setAll(data);

    var series2 = chart.series.push(
      am5radar.RadarColumnSeries.new(root, {
        xAxis: xAxis,
        yAxis: yAxis,
        clustered: false,
        valueXField: "value",
        categoryYField: "category",
      })
    );

    series2.columns.template.setAll({
      width: am5.p100,
      strokeOpacity: 0,
      tooltipText: "{category}: {valueX}%",
      cornerRadius: 20,
      templateField: "columnSettings",
    });

    series2.data.setAll(data);
    series1.appear(1000);
    series2.appear(1000);
    chart.appear(1000, 100);
  }, [chartID]);

  return <div id={chartID} className="h-full w-full"></div>;
}
export default CustomLabel;
