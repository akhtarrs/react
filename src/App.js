import React, { useState, useEffect } from 'react';
import DynamicFlow from './DynamicFlow';

function App() {
  const [jsonData, setJsonData] = useState(null);
  useEffect(() => {
    // Simulating an API call
    setTimeout(() => {
      const response = {
        name: "Start",
        status: "completed",
        conclusion: "failed",
        toolTip: "2023-01-15T18:30:00.000Z",
        size: 150,
        childNode: {
          name: "NP",
          status: "completed",
          conclusion: "failed",
          toolTip: "Deployed Environment",
          size: 100,
          childNode: {
            name: "WorkFlow",
            status: "completed",
            conclusion: "failed",
            toolTip: "Event",
            size: 100,
            childNode: {
              name: "NNB8TY0",
              status: "completed",
              conclusion: "failed",
              toolTip: "Triggered By",
              size: 100,
              childNode: [
                {
                  name: "Job1",
                  status: "completed",
                  conclusion: "success",
                  toolTip: "2023-01-15T18:30:00.000Z",
                  size: 50,
                  childNode: [
                    { name: "Step1", toolTip: "2023-01-15T18:30:00.000Z", status: "completed", conclusion: "success", size: 40 },
                    { name: "Step2", toolTip: "2023-01-15T18:30:00.000Z", status: "completed", conclusion: "success", size: 40 },
                    { name: "Step3", toolTip: "2023-01-15T18:30:00.000Z", status: "completed", conclusion: "success", size: 40 },
                    { name: "Step4", toolTip: "2023-01-15T18:30:00.000Z", status: "completed", conclusion: "success", size: 40 },
                    { name: "Step5", toolTip: "2023-01-15T18:30:00.000Z", status: "completed", conclusion: "success", size: 40 },
                    { name: "Step6", toolTip: "2023-01-15T18:30:00.000Z", status: "completed", conclusion: "success", size: 40 },
                    { name: "Step7", toolTip: "2023-01-15T18:30:00.000Z", status: "completed", conclusion: "success", size: 40 },
                    { name: "Step8", toolTip: "2023-01-15T18:30:00.000Z", status: "completed", conclusion: "success", size: 40 }
                  ]
                },
                {
                  name: "Job2",
                  status: "completed",
                  conclusion: "failed",
                  toolTip: "2023-01-15T18:30:00.000Z",
                  size: 50,
                  childNode: [
                    { name: "Step1", toolTip: "2023-01-15T18:30:00.000Z", status: "completed", conclusion: "success", size: 10 },
                    { name: "Step2", toolTip: "2023-01-15T18:30:00.000Z", status: "completed", conclusion: "failed", size: 10 }
                  ]
                }
              ]
            }
          }
        }
      };
      setJsonData(response); // Update jsonData state after receiving API response
    }, 5000);
  }, []);


  const options = {
    color:"white", 
    border: '1px solid white', 
    successColor: 'green', 
    successBackground:'linear-gradient(90deg, #d4e157, green)', 
    failedColor:'red'
  }

  return (
    <div className="App">
      <h1>Dynamic React Flow</h1>
      <DynamicFlow
        jsonData={jsonData}
        options={options}
      />
    </div>
  );
}

export default App;
