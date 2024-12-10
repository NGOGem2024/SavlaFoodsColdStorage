    // src/private/webapis/performance/Performance.js
const Performance = {
    mark: (markName) => {
      console.log(`Mark: ${markName}`);
    },
    measure: (measureName, startMark, endMark) => {
      console.log(`Measure: ${measureName}, Start: ${startMark}, End: ${endMark}`);
    },
    clearMarks: (markName) => {
      console.log(`Clear marks: ${markName}`);
    },
    clearMeasures: (measureName) => {
      console.log(`Clear measures: ${measureName}`);
    }
  };
  
  export default Performance;