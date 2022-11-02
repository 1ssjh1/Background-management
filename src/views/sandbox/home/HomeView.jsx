import React from "react";
import { Button } from "antd";
import axios from "axios";

export default function HomeView() {
  return (
    <div>
      <div>Home</div>
      <Button
        type="primary"
        onClick={() => {
          axios.get("/rights?_embed=children").then((data) => {
            console.log(data.data);
          });
        }}
      >
        Primary Button
      </Button>
      <Button>Default Button</Button>
      <Button type="dashed">Dashed Button</Button>
    </div>
  );
}
