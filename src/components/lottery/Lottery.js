/* eslint-disable no-unused-vars */
import React from "react";
import { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import { Container, Row, Col } from "react-bootstrap";
import LoadingButton from "@mui/lab/LoadingButton";
import lott from "../../utils/constants.js";
import Web3 from "web3";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import "./Lottery.css";

import ticket from "../../assets/Desktopticket.svg";

export const Lottery = () => {
  const [balance, setBalance] = React.useState(0);
  const [ticketCount, setTicketCount] = React.useState(0);
  const [playerCount, setPlayerCount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const init = async () => {
      var web3 = new Web3(window.ethereum);
      var bal = await lott.methods.getBalance().call();
      bal = web3.utils.fromWei(bal, "ether");
      setBalance(bal);

      var ticketC = await lott.methods.getTicketCount().call();
      setTicketCount(ticketC);

      var playerC = await lott.methods.getPlayerCount().call();
      setPlayerCount(playerC);
    };
    init();
  }, [reload]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessOpen(false);
    setErrorOpen(false);
  };

  const buyFunc = async (e) => {
    e.preventDefault();
    setLoading(true);
    var web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    try {
      await lott.methods.buyTicket().send({
        from: accounts[0],
        value: web3.utils.toWei("0.002", "ether"),
      });
      setSuccessOpen(true);
      setReload(!reload);
    } catch (e) {
      console.error(e);
      setErrorOpen(true);
      setReload(!reload);
    }
    setLoading(false);
  };

  return (
    <section id="lottery">
      <div className="parent">
        <div className="lottery">
          <div
            className="_img"
            style={{
              background: "url(" + ticket + ")",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div>
            <LoadingButton
              size="large"
              onClick={buyFunc}
              loading={loading}
              variant="contained"
            >
              <Typography variant="h5" component="h2">
                Buy Ticket
              </Typography>
            </LoadingButton>
          </div>
        </div>
        <div className="__content_wrapper2">
          <Container fluid>
            <Row>
              <Col lg={8} xl={8} md={8}>
                <Typography variant="h5" component="h2">
                  Total Tickets Sold
                </Typography>
              </Col>
              <Col lg={4} xl={4} md={4}>
                <Typography variant="h5" component="h2">
                  {ticketCount} Tickets
                </Typography>
              </Col>
              <Col lg={8} xl={8} md={8}>
                <Typography variant="h5" component="h2">
                  Total Money Pool
                </Typography>
              </Col>
              <Col lg={4} xl={4} md={4}>
                <Typography variant="h5" component="h2">
                  {balance} Ether
                </Typography>
              </Col>
              <Col lg={8} xl={8} md={8}>
                <Typography variant="h5" component="h2">
                  Total Participators
                </Typography>
              </Col>
              <Col lg={4} xl={4} md={4}>
                <Typography variant="h5" component="h2">
                  {playerCount} Players
                </Typography>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      <Snackbar
        open={successOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          A ticket successfully purchased!
        </Alert>
      </Snackbar>
      <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          An error occured! Please try again.
        </Alert>
      </Snackbar>
    </section>
  );
};
