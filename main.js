const fs = require("fs");

// Function to decode a value from a given base to decimal
function decodeValue(base, value) {
  return parseInt(value, base);
}

// Function to calculate the constant term (c) using Newton's Divided Differences method
function newtonInterpolation(points) {
  const n = points.length;
  let coeffs = []; // Divided difference coefficients

  // Calculate the divided differences table
  for (let i = 0; i < n; i++) {
    coeffs[i] = points[i][1]; // Initialize with y values
  }

  for (let j = 1; j < n; j++) {
    for (let i = n - 1; i >= j; i--) {
      coeffs[i] =
        (coeffs[i] - coeffs[i - 1]) / (points[i][0] - points[i - j][0]);
    }
  }

  // The constant term c is the first coefficient in the table after the division
  return coeffs[0];
}

// Function to process an array of test cases and find the constant term for each case
function findConstantTermsFromFile(filePath) {
  // Read the input JSON file
  const rawData = fs.readFileSync(filePath, "utf8");
  const dataArray = JSON.parse(rawData);

  // Loop through each test case in the array
  dataArray.forEach((testCase) => {
    const { keys, pointsData } = testCase;
    const points = [];

    // Loop through the points and decode them
    for (let key in pointsData) {
      const entry = pointsData[key];
      const x = parseInt(key); // The key is the x-value
      const base = parseInt(entry.base); // Base of the y-value
      const value = entry.value; // Encoded y-value
      const y = decodeValue(base, value); // Decode the y-value

      // Gather points (x, y)
      points.push([x, y]);
    }

    // Apply Newton's Divided Differences interpolation method
    const constantTerm = newtonInterpolation(points);

    // Output the result on a new line for each test case
    console.log("Constant term (c):", constantTerm);
  });
}

// Example usage with the file path
const filePath = "data.json"; // Replace with the path to your JSON file
findConstantTermsFromFile(filePath);
