import React from "react";
import ReactDOM from "react-dom";
import Claims from "./sampledata";
import "./styles.css";

class App extends React.Component {
  parseClaim(claimString) {
    const claimArr = claimString.split(" ");
    const claimId = claimArr[0];
    const claimCoords = claimArr[2].replace(":", "");
    const claimSize = claimArr[3];
    return {
      id: claimId,
      x: parseInt(claimCoords.split(",")[0]),
      y: parseInt(claimCoords.split(",")[1]),
      width: parseInt(claimSize.split("x")[0]),
      height: parseInt(claimSize.split("x")[1])
    };
  }
  generateCanvas(claims) {
    let canvasObject = {};
    let xMax = 0;
    let yMax = 0;
    claims.forEach(claim => {
      let x1 = claim.x;
      let x2 = claim.x + claim.width - 1;
      let y1 = claim.y;
      let y2 = claim.y + claim.height - 1;
      let xIterator = x1;
      while (xIterator <= x2) {
        if (canvasObject[xIterator] == null) {
          canvasObject[xIterator] = {};
        }
        let yIterator = y1;
        while (yIterator <= y2) {
          if (!canvasObject[xIterator][yIterator]) {
            canvasObject[xIterator][yIterator] = [];
          }
          canvasObject[xIterator][yIterator].push(claim.id);
          yIterator++;
        }
        xIterator++;
      }
    });
    return canvasObject;
  }
  findOverlapInfo(canvasObject) {
    let overlapCoords = [];
    let overlappedClaimIds = new Set();
    Object.keys(canvasObject).forEach(xCoord => {
      const yCoords = canvasObject[xCoord];
      Object.keys(yCoords).forEach(yCoord => {
        if (canvasObject[xCoord][yCoord].length > 1) {
          overlapCoords.push(xCoord + "," + yCoord);
          canvasObject[xCoord][yCoord].forEach(claimId => {
            overlappedClaimIds.add(claimId);
          });
        }
      });
    });
    return {
      overlapCoords: overlapCoords,
      overlappedClaimIds: overlappedClaimIds
    };
  }
  render() {
    const parsedClaims = Claims.map(claimString =>
      this.parseClaim(claimString)
    );
    const canvasObject = this.generateCanvas(parsedClaims);
    const overlapInfo = this.findOverlapInfo(canvasObject);
    let cleanClaimIds = [];
    parsedClaims.forEach(claim => {
      if (!overlapInfo.overlappedClaimIds.has(claim.id)) {
        cleanClaimIds.push(claim.id);
      }
    });

    return (
      <div className="App">
        <div>Overlap in^2: {overlapInfo.overlapCoords.length}</div>
        <div>clean claims: {JSON.stringify(cleanClaimIds, null, 2)}</div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
