# Dashboard Management

## Overview

The Dashboad Management module, allow users to create and manage existing dashboard's in the system as well as allow user to add pre generated items with graphics to the desired dashboard. While managing the dashboard, a user have the ability to add, remove, resize and move items from a specific dashboard.

## Dashboards

- **Managemenet**
  Dashboards can be created, edited, and deleted, they serve to group related items. Created dashboards will be listed in inital menu, main dashboard is the dashboard rendered when this page is first visited, the user will be able to select which dashboard will be listed and can also define the refresh time to re-fetch dashboard items with fresh data.

## Item construction

- **Items Generation**
  While developing a module, the developer, if needs, can create items that will serve as data visualizer of the module in question. This can be done by creating seeders to generating items, specifyng the name, sqlRaw and the graphic's chart type.

- **The sqlRaw field**
  In this field, the developer needs to write the sql query that will generate data that will be used to mount the item graphic. In the end, this query needs to return an object called _result_ containing two _keys_ with arrays as _value_. The first key called xColumn, will include data that will be rendered in horizontal, and yColumn will include that will rendered in vertical. This is the most basic graphic sctructure, others are under development.

- **The chartType field**
  In this field, the developer needs to specify the chartType that will be used to represent the data in the item, chart types are available in the dashboard module, they are created according with graphics available to mount the item graphic.

## Item usage

Once a dashboard is created, it can receive any available items, items are added only once to dashboard, it can be done by dragging and dropping the item to allowed zone in dashboard

## Conclusion

This module is a powerfull tool because it gives to user the flexibility to group dashboard items with pre-selected graphics by topic and set how they will be represented depending on the importance or the data being showed.
