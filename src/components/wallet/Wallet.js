/* eslint-disable no-unused-vars */
import React from "react";
import { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Typography, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import lott from "../../utils/constants.js";
import styles from "./metamask-auth.module.css";
import Web3 from "web3";
//import LoadingButton from "@mui/lab/LoadingButton";

import "./Wallet.css";

const useStyles = makeStyles((theme) => ({
  main: {
    maxWidth: "100vw",
    marginTop: "auto",
    marginBottom: "auto",
  },
}));

async function connect(onConnected) {
  if (!window.ethereum) {
    alert("Get MetaMask!");
    return;
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  onConnected(accounts[0]);
}

export const Wallet = () => {
  const classes = useStyles();
  const [userAddress, setUserAddress] = useState("init");
  const [ticketCount, setTicketCount] = React.useState(0);
  const [winCount, setWinCount] = React.useState(0);
  const [balance, setBalance] = React.useState(1.5);
  const [ticketPrice, setTicketPrice] = React.useState(0.002);
  const [ticketAmount, setTicketAmount] = React.useState(0);

  useEffect(() => {
    checkIfWalletIsConnected();
    /*console.log(userAddress);
    if (userAddress !== "init") {
      var num = lott.methods.user_ticket_pair(userAddress).call();
      setTicketCount(num);

      num = lott.methods.getWinCount(userAddress).call();
      setWinCount(num);
    }*/
  });

  async function checkIfWalletIsConnected() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length > 0) {
        const account = accounts[0];
        lott.methods
          .user_ticket_pair(account)
          .call()
          .then((res) => {
            setTicketCount(res);
          });

        lott.methods
          .getWinCount(account)
          .call()
          .then((res) => {
            setWinCount(res);
          });

        var price;
        debugger;
        lott.methods
          .getTicketPrice()
          .call()
          .then((res) => {
            price = res;
          });

        var web3 = new Web3(window.ethereum);

        //setTicketPrice(web3.utils.fromWei(price, "ether"));

        setUserAddress(account);

        var bal;

        //bal = await web3.eth.getBalance(accounts[0]);

        //setBalance(web3.utils.fromWei(bal, "ether"));

        setTicketAmount(balance / ticketPrice);

        return;
      }
    }
  }
  return userAddress !== "init" ? (
    <section id="wallet">
      <Container component="main" className={classes.main} maxWidth="md">
        <div
          className="project"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Typography variant="h5" component="h2">
            Successfully linked with your MetaMask Account
          </Typography>
          <Typography variant="h6" component="h2">
            Connected with <Address userAddress={userAddress} />
          </Typography>
          <div className="infos">
            <Row>
              <Col lg={8} xl={8} md={8}>
                <Typography variant="h6" component="h2">
                  Number Of Tickets Bought
                </Typography>
              </Col>
              <Col lg={4} xl={4} md={4}>
                <Typography variant="h6" component="h2">
                  {ticketCount} Tickets
                </Typography>
              </Col>
              <Col lg={8} xl={8} md={8}>
                <Typography variant="h6" component="h2">
                  Your Win Count
                </Typography>
              </Col>
              <Col lg={4} xl={4} md={4}>
                <Typography variant="h6" component="h2">
                  {winCount} Wins
                </Typography>
              </Col>
              <Col lg={8} xl={8} md={8}>
                <Typography variant="h6" component="h2">
                  Account Balance
                </Typography>
              </Col>
              <Col lg={4} xl={4} md={4}>
                <Typography variant="h6" component="h2">
                  {balance.toFixed(2)} Ether
                </Typography>
              </Col>
              <Col lg={8} xl={8} md={8}>
                <Typography variant="h6" component="h2">
                  Maximum Buyable Tickets
                </Typography>
              </Col>
              <Col lg={4} xl={4} md={4}>
                <Typography variant="h6" component="h2">
                  {ticketAmount.toFixed(2)} Tickets
                </Typography>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    </section>
  ) : (
    <section id="wallet">
      <Container component="main" className={classes.main} maxWidth="md">
        <div
          className="project"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div
            style={{
              marginBottom: 30,
            }}
          >
            <Typography variant="h5" component="h2">
              Please Connect Your Metamask Wallet To Enter The Lottery
            </Typography>
          </div>
          <Connect setUserAddress={setUserAddress} />
        </div>
      </Container>
    </section>
  );
};

function Connect({ setUserAddress }) {
  return (
    <button className={styles.button} onClick={() => connect(setUserAddress)}>
      Connect to MetaMask
    </button>
  );
}

function Address({ userAddress }) {
  return (
    <span className={styles.address}>
      {userAddress.substring(0, 5)}…
      {userAddress.substring(userAddress.length - 4)}
    </span>
  );
}
