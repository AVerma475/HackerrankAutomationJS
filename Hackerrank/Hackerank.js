const puppeteer = require("puppeteer");
const constants = require("./constants.js");
let cTab;

let browserOpenPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
    // executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // chrome://version
});
  
// If BrowserOpenPromise resolves
//Promise Chaining
browserOpenPromise
.then(function(browser){
    console.log("Browser Opened");
    //We get Browser Obj if BrowserOpenPromise is resolved
    console.log("Browser", browser);
    let allTabsPromise = browser.pages();
    return allTabsPromise;
})
.then(function(allTabsArr){
    cTab = allTabsArr[0];
    console.log("New Tab");

    // URL to navigate page to
    let visitingLoginPagePromise = cTab.goto("https://www.hackerrank.com/auth/login");
    return visitingLoginPagePromise;
})
.then(function() {
    console.log("Opened Hackerrank Login Page");
    let emailWillBeTypedPromise = cTab.type("input[id='input-1']", constants.email)
    return emailWillBeTypedPromise;
})
.then(function(){
    console.log("Email Typed Successfully");
    let passwordWillBeTypedPromise = cTab.type("input[id='input-2']", constants.password);
    return passwordWillBeTypedPromise;
})
.then(function(){
    console.log("Password Typed Successfully");
    let LoginButtonClickedPromise = cTab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled")
    return LoginButtonClickedPromise;
})
.then(function() {
    console.log("Logged In Successfully");
})
.catch(function(err){console.log(err);})