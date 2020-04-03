import React, { useEffect, useState } from "react";
import axios from "axios";
import Scream from "../components/Scream";

import { Grid } from "@material-ui/core";

function Home() {
  const [screams, setScreams] = useState([]);

  useEffect(() => {
    getScreams();
  }, []);

  const getScreams = () => {
    axios
      .get("https://us-central1-socialapp-2a20a.cloudfunctions.net/api/screams")
      .then(res => {
        setScreams(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Grid container spacing={16}>
      <Grid item sm={8} xs={12}>
        {screams.length > 0 ? (
          screams.map(scream => {
            return <Scream scream={scream} key={scream.screamId} />;
          })
        ) : (
          <p>Loading ...</p>
        )}
      </Grid>
      <Grid item sm={4} xs={12}>
        <p>profile...</p>
      </Grid>
    </Grid>
  );
}

export default Home;
