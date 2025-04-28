// This is where the code for the focus parts will be
// TODO: fix the frontend to include this script from the start

// Creates a pie chart for the given state
// Parameters: state (string) - a given state
function createPieChart(state) {
    let color = d3.scaleOrdinal(["#264653", "#f4a261"]);
    let stateData = null;

    let data = d3.csv(`data/healthInsurance.csv`).then(output => {
        for(let i = 0; i < output.length; ++i) {
            if(output[i].State == state) {
                stateData = output[i];
                break;
            }
        }
    });

    console.log(stateData)

}

createPieChart("Massachusetts");