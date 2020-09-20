import React, { useContext } from "react";

import IconBattery0 from "@material-ui/icons/BatteryAlert";
import IconBattery20 from "@material-ui/icons/Battery20";
import IconBattery30 from "@material-ui/icons/Battery30";
import IconBattery50 from "@material-ui/icons/Battery50";
import IconBattery60 from "@material-ui/icons/Battery60";
import IconBattery80 from "@material-ui/icons/Battery80";
import IconBattery90 from "@material-ui/icons/Battery90";
import IconBatteryFull from "@material-ui/icons/BatteryFull";

import GlobalContext from "../../Context/global-context";

const InteractiveBattery = () => {
  const context = useContext(GlobalContext);
  const currentCapacity = context.convertAvailableStepsToBatteryCapacity();
  switch (true) {
    case currentCapacity >= 90:
      return <IconBatteryFull />;

    case currentCapacity >= 80:
      return <IconBattery90 />;

    case currentCapacity >= 70:
      return <IconBattery80 />;

    case currentCapacity >= 50:
      return <IconBattery60 />;

    case currentCapacity >= 40:
      return <IconBattery50 />;

    case currentCapacity >= 20:
      return <IconBattery30 />;

    case currentCapacity > 0:
      return <IconBattery20 />;

    case currentCapacity === 0:
      return <IconBattery0 />;

    default:
      console.log("Default case in InteractiveBattery");
      return <IconBatteryFull />;
  }
};

export default InteractiveBattery;
