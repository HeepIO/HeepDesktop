import { createMuiTheme } from 'material-ui/styles';
import bluegrey from 'material-ui/colors/blueGrey';
import lightblue from 'material-ui/colors/lightblue';

const Theme = createMuiTheme({
  palette: {
    primary: {
      main: bluegrey[700],
      contrastText: '#FFF'
    },
    secondary: {
      main: lightblue[500],
      contrastText: "#000"
    }
  },
  typography: {
    headline: {
      color: "rgba(0, 0, 0, 0.6)",
    },
    title: {
      color: "rgba(0, 0, 0, 0.6)",
    },
    subheading: {
      color: "rgba(0, 0, 0, 0.7)"
    },
    body2: {
      color: "rgba(0, 0, 0, 0.7)"
    },
    body1: {
      color: "rgba(0, 0, 0, 0.7)"
    },
  },
});

export default Theme;
