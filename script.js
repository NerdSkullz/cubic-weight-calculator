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

    if (next_page === null) {
      morePagesAvailable = false
    } else {
      next_page = next_page.replace("/api/products/", "")
    }
    data.objects.forEach(e => {
      if (e.category === "Air Conditioners") {
        allData.unshift(e);
      }
    })
  }
  return allData;
}

const truncateNumbers = number => {
  return Math.floor((number/100) * 100) / 100;
}

const convertCmToM = (size) => {
  return truncateNumbers(size)
}

const getAverageCubicWeight = (elements) => {
  let cubicWeights = [],
      reducer = (accumulator, currentValue) => accumulator + currentValue;
  elements.forEach(e => {
    let width = convertCmToM(e.size.width),
        lenght = convertCmToM(e.size.length),
        height = convertCmToM(e.size.height),
        cubicWeight = (lenght * height * width) * 250;
    cubicWeights.unshift(cubicWeight)
  })
  console.log(cubicWeights.reduce(reducer)/cubicWeights.length)
  document.querySelector('#average_label').innerHTML = cubicWeights.reduce(reducer)/cubicWeights.length;
}

(function (){
  requestAirConditiong().then(function(result) {
    getAverageCubicWeight(result)

  });
})()
