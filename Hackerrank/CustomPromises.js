// Custom Promise

let customPromise = new Promise(function (resolve, reject) {
  let num1 = 1;
  let num2 = 2;

  if (num1 + num2 == 11) {
    resolve("Success");
  } else {
    reject("Failure");
  }
});

customPromise
  .then((data) => console.log(data))
  .catch((data) => console.log(data));
