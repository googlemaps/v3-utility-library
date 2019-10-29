import { initialize } from "./index";

test("can initialize", () => {
  initialize();
  expect(new google.maps.Map(null)).toBeTruthy();
});
