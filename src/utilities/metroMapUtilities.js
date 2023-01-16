const generatePaths = (line) => {
  const pathCoordinates = line.pathCoords;

  const endPointToEndPointCoordinates = [];
  for (let i = 0; i < pathCoordinates.length - 1; i++) {
    if (pathCoordinates[i].endPoint) {
      // add starting end point
      const coordinates = [pathCoordinates[i]];
      // add anything in between the two end points
      let j = i + 1;
      while (!pathCoordinates[j].endPoint) {
        coordinates.push(pathCoordinates[j]);
        j++;
      }
      // add ending end point
      coordinates.push(pathCoordinates[j]);
      endPointToEndPointCoordinates.push(coordinates);
    }
  }

  const labels = endPointToEndPointCoordinates.map((coordinates) => {
    const endingEndPoint = coordinates[coordinates.length - 1];
    return {
      id: endingEndPoint.source + "-" + endingEndPoint.target,
      label: endingEndPoint.edgeLabel || null,
      colour: endingEndPoint.edgeLabel
        ? endingEndPoint.edgeColour || line.colour
        : null,
      points: [coordinates[1], coordinates[coordinates.length - 2]],
      isChanged: endingEndPoint.isChanged || line.colour.isChanged || false,
    };
  });

  const paths = endPointToEndPointCoordinates.map((coordinates) => {
    const endingEndPoint = coordinates[coordinates.length - 1];
    return {
      id: endingEndPoint.source + "-" + endingEndPoint.target,
      path: coordinates,
      colour: endingEndPoint.edgeColour || line.colour,
      isChanged: endingEndPoint.isChanged || line.isChanged || false,
    };
  });

  return [paths, labels];
};

export { generatePaths };
