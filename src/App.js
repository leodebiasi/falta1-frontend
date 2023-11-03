import { ThemeProvider } from "@mui/material/styles";
import "./App.css";
import theme from "./theme";
import HomePage from "./views/HomePage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <HomePage />
      </div>
    </ThemeProvider>
  );
}

export default App;
