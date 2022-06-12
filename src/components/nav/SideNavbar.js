/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { Typography } from "@material-ui/core";
import { useState } from "react";

import "./SideNavbar.css";

export const SideNavbar = () => {
  const [activeNav, setActiveNav] = useState('#');

  return (
    <nav>
      <a href="#" 
        onClick={() => setActiveNav('#')}
        className={activeNav === '#' ? 'active' : ''}
      >
        <Typography>
          Welcome
        </Typography>
      </a>
      <a href="#wallet"
        onClick={() => setActiveNav('#wallet')}
        className={activeNav === '#wallet' ? 'active' : ''}
      >
        <Typography>
          Connect
        </Typography>
      </a>
      <a href="#lottery" 
        onClick={() => setActiveNav('#lottery')}
        className={activeNav === '#lottery' ? 'active' : ''}
      >
        <Typography>
          Lottery
        </Typography>
      </a>
      <a href="#prize"
        onClick={() => setActiveNav('#prize')}
        className={activeNav === '#prize' ? 'active' : ''}
      >
        <Typography>
          Prize
        </Typography>
      </a>
    </nav>
  );
};