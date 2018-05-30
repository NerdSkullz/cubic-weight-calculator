// Fetching API
const requestAirConditiong = async () => {
  let allData = [];
  let morePagesAvailable = true;
  let currentPage = 0;
  while(morePagesAvailable) {
    currentPage++;
    let url = 'http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com/api/products/' + currentPage;
    const response = await fetch(url);
    let data = await response.json(),
        next_page = data.next;
    // Special check if there are other pages since the field next doesn't play nice and it responds with a letter
    if (next_page === null) {
      morePagesAvailable = false
    } else {
      next_page = next_page.replace("/api/products/", "")
    }
    // Looping the array of objects to find JUST air conditioners
    data.objects.forEach(e => {
      if (e.category === "Air Conditioners") {
        allData.unshift(e);
      }
    })
  }
  return allData;
}

// Funciton to truncate numbers without rounding them
const truncateNumbers = number => {
  return Math.floor((number/100) * 100) / 100;
}

const convertCmToM = (size) => {
  return truncateNumbers(size)
}

// Caluculating average cubic weight
const getAverageCubicWeight = (elements) => {
  let cubicWeights = [],
      reducer = (accumulator, currentValue) => accumulator + currentValue;
  // Looping array of Air Conditioners to get sizes and add them into a new array
  elements.forEach(e => {
    let width = convertCmToM(e.size.width),
        lenght = convertCmToM(e.size.length),
        height = convertCmToM(e.size.height),
        cubicWeight = (lenght * height * width) * 250;
    cubicWeights.unshift(cubicWeight)
  })
  // Reduce array adding single cubic weight and dividing the result by the lenght of the array
  document.querySelector('#average_label').innerHTML = cubicWeights.reduce(reducer)/cubicWeights.length;
}

(function (){
  // Calling fetch function
  requestAirConditiong().then(function(result) {
    // Calling caluculating function AFTER API has resolved promise
    getAverageCubicWeight(result)
  });
})()
