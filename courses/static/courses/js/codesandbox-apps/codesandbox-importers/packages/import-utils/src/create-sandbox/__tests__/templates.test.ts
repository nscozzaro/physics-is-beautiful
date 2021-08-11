import { getTemplate } from "../templates";

describe("template detection", () => {
  it("detects a react template", () => {
    expect(
      getTemplate(
        {
          dependencies: {},
          devDependencies: {
            "react-scripts": "latest",
          },
        },
        {}
      )
    ).toEqual("create-react-app");
  });

  it("detects a nuxt template", () => {
    expect(
      getTemplate(
        {
          dependencies: {},
          devDependencies: {
            nuxt: "latest",
          },
        },
        {}
      )
    ).toEqual("nuxt");
  });

  it("detects an apollo template", () => {
    expect(
      getTemplate(
        {
          dependencies: {},
          devDependencies: {
            "apollo-server": "latest",
          },
        },
        {}
      )
    ).toEqual("apollo");
  });
});
