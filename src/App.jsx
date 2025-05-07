import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});

let cancelAxios = null;

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

function App() {
  const { t, i18n } = useTranslation();

  const [dateAndTime, setDateAndTime] = useState("");
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  });

  const [local, setLocal] = useState("ar");

  // event handlers
  function handleLanguageChange() {
    if (local === "en") {
      setLocal("ar");
      i18n.changeLanguage("ar");
    } else {
      setLocal("en");
      i18n.changeLanguage("en");
    }
  }
  useEffect(() => {
    i18n.changeLanguage(local);
    const timer = setInterval(() => {
      setDateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
    }, 1000);
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=32.2211&lon=35.2544&appid=${apiKey}`,
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then(function (response) {
        // handle success
        const responseTemp = Math.round(response.data.main.temp - 272.15);
        const min = Math.round(response.data.main.temp_min - 272.15);
        const max = Math.round(response.data.main.temp_max - 272.15);
        const description = response.data.weather[0].description;
        const responseIcon = response.data.weather[0].icon;
        setTemp({
          number: responseTemp,
          description: description,
          min: min,
          max: max,
          icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`,
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
    return () => {
      clearInterval(timer);
      cancelAxios();
    };
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {/* card */}
          <div
            style={{
              width: "100%",
              backgroundColor: "rgb(28 52 91 / 36%)",
              color: "white",
              padding: "10px",
              borderRadius: "15px",
              boxShadow: "0px 11px 1px rgba(0,0,0,0.05)",
            }}
            dir={local === "en" ? "ltr" : "rtl"}
          >
            {/* content */}
            <div>
              {/* header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "start",
                }}
                dir={local === "en" ? "ltr" : "rtl"}
              >
                <Typography variant="h2" style={{ marginRight: "20px" }}>
                  {t("Nablus")}
                </Typography>
                <Typography variant="h5" style={{ marginRight: "20px" }}>
                  {dateAndTime}
                </Typography>
              </div>
              {/* ---header--- */}
              <hr />
              {/* container of degree and cloud icon */}
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                {/* degree & icon */}
                <div>
                  {/* degree */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h1" style={{ textAlign: "right" }}>
                      {temp.number}
                    </Typography>
                    {/* temp image */}
                    <img src={temp.icon} />
                    {/* ---temp image--- */}
                  </div>
                  {/* ---degree--- */}
                  <Typography variant="h6">{t(temp.description)}</Typography>
                  {/* min and max */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h5>
                      {t("min")} : {temp.min}
                    </h5>
                    <h5 style={{ margin: "0px 5px" }}>|</h5>
                    <h5>
                      {t("max")} : {temp.max}
                    </h5>
                  </div>
                </div>

                {/* ---degree & icon--- */}
                <CloudIcon style={{ color: "white", fontSize: "200px" }} />
              </div>
              {/* ---container of degree and cloud icon--- */}
            </div>
            {/* ---content--- */}
          </div>
          {/* ---card--- */}
          {/* translation button */}
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "end",
              marginTop: "20px",
            }}
            dir={local === "en" ? "ltr" : "rtl"}
          >
            <Button
              style={{ color: "white" }}
              variant="text"
              onClick={handleLanguageChange}
            >
              {local === "en" ? "Arabic" : "انجليزي"}
            </Button>
          </div>
          {/* ---translation button--- */}
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default App;
