const puppeteer = require("puppeteer");
const constants = require("../constants.js");
let {answer} = require("./codes.js");
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
    let allQuesPromise = cTab.waitForSelector(
      'a[data-analytics="ChallengeListChallengeName"]'
    );
    return allQuesPromise;
  })
  .then(() => {
    const getAllQuesLinks = () => {
      let allElemArr = document.querySelectorAll(
        'a[data-analytics="ChallengeListChallengeName"]'
      );
      let linksArr = [];
      for (let ele of allElemArr) {
        linksArr.push(ele.getAttribute("href"));
      }
      return linksArr;
    };

    let linksArrPromise = cTab.evaluate(getAllQuesLinks);
    return linksArrPromise;
  })
  .then((linksArr) => {
    console.log("Links to all ques received");
    console.log(linksArr);

    // To solve ques here
    let QuesWillBeSolvedPromise = quesSolver(linksArr[0], 0 );
    return QuesWillBeSolvedPromise;
  })
  .then(() => console.log("Question is solved"))
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
      .then(() => {
        console.log("Algo Btn is clicked");
        resolve();
      })
      .catch((err) => {
        console.log(err);
      });
  });
  // promise.then(() => console.log("Wait and Click Promise Resolved!"))
  return promise;
}

function quesSolver(url, index){
  return new Promise((resolve, reject) => {
    let fullLink = `https://www.hackerrank.com/${url}`;
    let goToQuesPage = cTab.goto(fullLink);
    goToQuesPage.then(() => {
      console.log("Ques Page opened");
      let waitforCheckBoxandClickPromise = waitAndClick(".checkbox-input");
      return waitforCheckBoxandClickPromise;
    
    })
    .then(() => {
      let waitForTextBoxPromise = cTab.waitForSelector(".custominput");
      return waitForTextBoxPromise;
    })
    .then(() => {
      let codewillbetypedPromise = cTab.type(".custominput", answer[index]);
      return codewillbetypedPromise;
    })
    .then(() => {
      //Select code from box
      let controlPressedPromise = cTab.keyboard.down("Control");
      return controlPressedPromise;
    })
    .then(() => {
      let aPressedPromise = cTab.keyboard.press("a");
      return aPressedPromise;
    })
    .then(() => {
      let xPressedPromise = cTab.keyboard.press("x");
      return xPressedPromise;
    })
    .then(() => {
      //Select code from box
      let controlDownPromise = cTab.keyboard.up("Control");
      return controlDownPromise;
    })
    .then(() => {
      //select Editor
      let cursoronEditorPromise = cTab.click('.monaco-editor.no-user-select.vs');
      return cursoronEditorPromise;
    })
    .then(() => {
      let controlPressedPromise = cTab.keyboard.down("Control");
      return controlPressedPromise;
    })
    .then(() => {
      let aPressedPromise = cTab.keyboard.press("A", {delay:100});
      return aPressedPromise;
    })
    .then(() => {
      console.log("Solution Pasted");
      let vPressedPromise = cTab.keyboard.press("V", {delay:100});
      return vPressedPromise;
    })
    .then(() => {
      //Select code from box
      let controlDownPromise = cTab.keyboard.up("Control");
      return controlDownPromise;
    })
    .then(() => {
      let submitBtnPressedPromise = cTab.click(".hr-monaco-submit");
      return submitBtnPressedPromise;
    })
    
    .then(() => {
      console.log("Ques Submitted");
      resolve();
    })
    .catch((err) => {
     reject(err);
    })
  })
 
}
