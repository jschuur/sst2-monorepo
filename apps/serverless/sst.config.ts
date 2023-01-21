import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack"

export default {
  config(_input) {
    return {
      name: "sst2-next",
      region: "us-east-1"
    }
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: "nodejs16.x",
      architecture: "arm_64",
    })
    app.stack(API)
  }
} satisfies SSTConfig
