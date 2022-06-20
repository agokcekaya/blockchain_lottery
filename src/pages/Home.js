import React, { useState } from "react";
import { Content } from "../components/content/Content";
import { makeStyles } from "@material-ui/core/styles";
import DisplacementSphere from "../components/background/DisplacementSphere";
import { ThemeToggle } from "../components/theme/ThemeToggle";
import { SideNavbar } from "../components/nav/SideNavbar";
import { Wallet } from "../components/wallet/Wallet";
import { Lottery } from "../components/lottery/Lottery";
import { Prize } from "../components/prize/Prize";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
}));

export const Home = () => {
  const classes = useStyles();
  const [reload, setReload] = useState(false);

  const handlereload = (e) => {
    setReload(e);
  };

  return (
    <>
      <div className={classes.root} id="home">
        <DisplacementSphere />
        <Content />
        <ThemeToggle />
      </div>
      <SideNavbar />
      <Wallet />
      <Lottery trigger={reload} />
      <Prize handlereload={handlereload} />
    </>
  );
};
