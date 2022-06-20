/* eslint-disable no-unused-vars */
import React, { useEffect, useContext } from "react";
import { Container, Typography, Button, Box } from "@material-ui/core";
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
import { ThemeContext } from "../theme/ThemeProvider";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import "./Prize.css";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  backdropFilter: "blur(5px)",
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

export const Prize = ({ handlereload }) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [loadingButton, setLoadingButton] = React.useState(false);
  const [lotteryResult, setLotteryResult] = React.useState(-1);
  const { theme } = useContext(ThemeContext);
  const [color, setColor] = React.useState("");
  const [successOpen, setSuccessOpen] = React.useState(false);

  useEffect(() => {
    if (theme === "dark") {
      setColor("#424242");
    } else {
      setColor("#fff");
    }
  }, [theme]);

  const handleClickOpen = () => {
    setOpen(true);
    isWinner();
  };

  const isWinner = async () => {
    setLoading(true);
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
        handlereload(true);
        handlereload(false);
        setLoadingButton(false);
        setSuccessOpen(true);
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

  const handleSuccessClose = () => {
    setSuccessOpen(false);
  };

  function DialogFunc() {
    function DialogBody() {
      if (lotteryResult === -1) {
        //Wallet is not connected
        return (
          <>
            <BootstrapDialogTitle id="customized-dialog-title">
              <Paper className="MuiPaper-elevation1">
                <Typography variant="h5" component="h5">
                  Claim Prize
                </Typography>
              </Paper>
            </BootstrapDialogTitle>
            <div className="wrapper_text">
              <Paper className="MuiPaper-elevation1">
                <Typography variant="h5" component="h5">
                  Please connect your wallet.
                </Typography>
              </Paper>
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
              <Paper className="MuiPaper-elevation1">
                <Typography variant="h5" component="h5" underline="none">
                  Claim Prize
                </Typography>
              </Paper>
            </BootstrapDialogTitle>
            <div className="wrapper_text">
              <Paper className="MuiPaper-elevation1">
                <Typography variant="h4" component="h2">
                  Winner is not yet selected.
                </Typography>
              </Paper>
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
              <Paper className="MuiPaper-elevation1">
                <Typography variant="h5" component="h5" underline="none">
                  Claim Prize
                </Typography>
              </Paper>
            </BootstrapDialogTitle>
            <div className="wrapper_text">
              <Paper className="MuiPaper-elevation1">
                <Typography variant="h5" component="h5">
                  You lost. Better luck next time.
                </Typography>
              </Paper>
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
              <Paper className="MuiPaper-elevation1">
                <Typography variant="h5" component="h5" underline="none">
                  Claim Prize
                </Typography>
              </Paper>
            </BootstrapDialogTitle>
            <div className="wrapper_text">
              <Confetti />
              <Paper className="MuiPaper-elevation1">
                <Typography variant="h5" component="h5">
                  You won!!! Congratulations
                </Typography>
              </Paper>
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
        PaperProps={{
          style: {
            backgroundColor: color,
          },
        }}
        aria-labelledby="customized-dialog-title"
        fullWidth="true"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          //onClose={handleClose}
        >
          <Paper className="MuiPaper-elevation1">
            <Typography variant="h5" component="h5">
              Checking Lottery Status...
            </Typography>
          </Paper>
        </BootstrapDialogTitle>
        <div className="wrapper">
          <Spinner animation="border" role="status" size="xl">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>
    ) : (
      <BootstrapDialog
        //onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: color,
          },
        }}
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
            height: "90vh",
          }}
        >
          <Typography align="center" variant="h3" component="h2">
            Check The Results!
          </Typography>
          <div
            style={{
              margin: 80,
            }}
          >
            <Typography variant="h5" component="h2">
              Click the button below to see if you have won or not.
            </Typography>
          </div>
          <Button variant="contained" size="large" onClick={handleClickOpen}>
            Check Now!
          </Button>
        </div>
      </Container>
      <DialogFunc></DialogFunc>
      <Snackbar
        open={successOpen}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
      >
        <Alert
          onClose={handleSuccessClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          You successfully claimed your reward!
        </Alert>
      </Snackbar>
    </section>
  );
};
