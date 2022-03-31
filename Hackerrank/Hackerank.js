const puppeteer = require("puppeteer");
const constants = require("../constants.js");
let cTab;

let browserOpenPromise = puppeteer.launch({
  headless: false,
  defaultViewport: null,
  args: ["--start-maximized"],
  // executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // chrome://version
});

//If BrowserOpenPromise resolves, we get instance of browser
//Promise Chaining
browserOpenPromise
  .then(function (browser) {
    console.log("Browser Opened");
    //We get Browser Obj if BrowserOpenPromise is resolved
    console.log("Browser", browser);
    let allTabsPromise = browser.pages();
    return allTabsPromise;
  })
  .then(function (allTabsArr) {
    cTab = allTabsArr[0];
    console.log("New Tab");

    // URL to navigate page to
    let visitingLoginPagePromise = cTab.goto(
      "https://www.hackerrank.com/auth/login"
    );
    return visitingLoginPagePromise;
  })
  .then(function () {
    console.log("Opened Hackerrank Login Page");
    let emailWillBeTypedPromise = cTab.type(
      "input[id='input-1']",
      constants.email
    );
    return emailWillBeTypedPromise;
  })
  .then(function () {
    console.log("Email Typed Successfully");
    let passwordWillBeTypedPromise = cTab.type(
      "input[id='input-2']",
      constants.password
    );
    return passwordWillBeTypedPromise;
  })
  .then(function () {
    console.log("Password Typed Successfully");
    let LoginButtonClickedPromise = cTab.click(
      ".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled"
    );
    return LoginButtonClickedPromise;
  })
  .then(function () {
    console.log("Logged In Successfully");
    // wait for selector will wait for the entire web page to load and it will find the needed element and then click the element/node.
    let AlgoTabWillBeOpenedPromise = waitAndClick(
      "div[data-automation='algorithms']"
    );
    return AlgoTabWillBeOpenedPromise;
  })
  .then(function () {
    console.log("Algo Tab Opened");
  })
  .catch(function (err) {
    console.log(err);
  });

function waitAndClick(algoBtn) {
  let promise = new Promise((resolve, reject) => {
    let waitForSelectorPromise = cTab.waitForSelector(algoBtn);
    waitForSelectorPromise
      .then(() => {
        let clickPromise = cTab.click(algoBtn);
        return clickPromise;
      })
      .then(() => resolve())
      .catch((err) => {
        console.log(err);
      });
  });
  promise.then(() => console.log("Wait and Click Promise Resolved!"))
  return promise;
}
