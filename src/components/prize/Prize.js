/* eslint-disable no-unused-vars */
import React from "react";
import { Container, Typography, Button } from "@material-ui/core";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Spinner from "react-bootstrap/Spinner";
import lott from "../../utils/constants.js";
import Web3 from "web3";
import LoadingButton from "@mui/lab/LoadingButton";
import Confetti from "react-confetti";

import "./Prize.css";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => ({
  main: {
    maxWidth: "100vw",
    marginTop: "3em",
    marginBottom: "3em",
  },
}));

export const Prize = () => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [loadingButton, setLoadingButton] = React.useState(false);
  const [lotteryResult, setLotteryResult] = React.useState(-1);

  const handleClickOpen = () => {
    setOpen(true);
    isWinner();
  };

  const isWinner = async () => {
    setLoading(true)
    var web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    debugger;
    if (accounts[0] !== undefined) {
      try {
        /*await lott.methods.claimPrize(accounts[0]).send({
          from: accounts[0],
        });*/
        var res = await lott.methods.isWinner(accounts[0]).call();
        console.log("lottery result is " + res);
        setLotteryResult(res);
      } catch (e) {
        console.error(e);
      }
    } else {
      console.log("Wallet not connected.");
    }

    setLoading(false);
  };

  const claimPrize = async () => {
    setLoadingButton(true);
    var web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    debugger;
    if (accounts[0] !== undefined) {
      try {
        await lott.methods.claimPrize(accounts[0]).send({
          from: accounts[0],
        });
        setLoadingButton(false);
        handleClose();
      } catch (e) {
        console.error(e);
      }
    } else {
      console.log("Wallet not connected.");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  function DialogFunc() {
    function DialogBody() {
      if (lotteryResult === -1) {
        //Wallet is not connected
        return (
          <>
            <BootstrapDialogTitle id="customized-dialog-title">
              Claim Prize
            </BootstrapDialogTitle>
            <div className="wrapper_text">
              <Typography variant="h5" component="h5">
                Please connect your wallet.
              </Typography>
            </div>
            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                Close
              </Button>
            </DialogActions>
          </>
        );
      } else if (lotteryResult === "0") {
        //Winner is not selected
        return (
          <>
            <BootstrapDialogTitle id="customized-dialog-title">
              Claim Prize
            </BootstrapDialogTitle>
            <div className="wrapper_text">
              <Typography variant="h5" component="h5">
                Winner is not yet selected.
              </Typography>
            </div>
            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                Close
              </Button>
            </DialogActions>
          </>
        );
      } else if (lotteryResult === "1") {
        //You lost.
        return (
          <>
            <BootstrapDialogTitle id="customized-dialog-title">
              Claim Prize
            </BootstrapDialogTitle>
            <div className="wrapper_text">
              <Typography variant="h5" component="h5">
                You lost. Better luck next time.
              </Typography>
            </div>
            <DialogActions>
              <Button autoFocus onClick={handleClose}>
                Close
              </Button>
            </DialogActions>
          </>
        );
      } else if (lotteryResult === "2") {
        //you win
        return (
          <>
            <BootstrapDialogTitle id="customized-dialog-title">
              Claim Prize
            </BootstrapDialogTitle>
            <div className="wrapper_text">
              <Confetti />
              <Typography variant="h5" component="h5">
                You won!!! Congratulations
              </Typography>
            </div>
            <DialogActions>
              <LoadingButton
                size="medium"
                onClick={claimPrize}
                loading={loadingButton}
                variant="contained"
              >
                <Typography variant="p" component="p">
                  Claim Your Prize
                </Typography>
              </LoadingButton>
            </DialogActions>
          </>
        );
      }
    }

    return loading ? (
      <BootstrapDialog
        //onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        fullWidth="true"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          //onClose={handleClose}
        >
          Checking Lottery Status...
        </BootstrapDialogTitle>
        <div className="wrapper">
          <Spinner animation="border" role="status" size="xl">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    ) : (
      <BootstrapDialog
        //onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        fullWidth="true"
        open={open}
      >
        <DialogBody></DialogBody>
      </BootstrapDialog>
    );
  }

  return (
    <section id="prize">
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
              Claim Prize
            </Typography>
          </div>
          <Button variant="contained" size="large" onClick={handleClickOpen}>
            Claim Prize
          </Button>
        </div>
      </Container>
      <DialogFunc></DialogFunc>
    </section>
  );
};
