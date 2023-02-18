import * as d3 from "d3";
import * as d3Sankey from "d3-sankey";
import {
  NODEWIDTH,
  flatMap,
  MAX_ARTICLES,
  customerInterpolation,
} from "./util";

import { showTruth } from "./util";

const preprocessData = (metroMapData) => {
  metroMapData.nodes.forEach((node) => {
    if (node.articles.length > MAX_ARTICLES) {
      node.articles.splice(MAX_ARTICLES);
    }
  });
};

const generateMetroMapFullViewPositions = (
  paddedMetroMapWidth,
  paddedMetroMapHeight,
  metroMapData
) => {
  // Each link needs a value for d3sankey
  metroMapData.links.forEach((_, index) => {
    metroMapData.links[index] = { ...metroMapData.links[index], value: 1 };
  });

  // Build sankey generator
  const sankeyLayout = d3Sankey
    .sankey()
    .links(metroMapData.links)
    .nodes(metroMapData.nodes)
    .nodeAlign(d3Sankey.sankeyCenter)
    .size([paddedMetroMapWidth, paddedMetroMapHeight])
    .nodeId((node) => node.id);

  sankeyLayout(); // mutates data, adds x and y positions to nodes
};

const distributeNodesOnYAxis = (paddedMetroMapHeight, nodes) => {
  const maxDepth = d3.max(nodes.map((node) => node.depth));

  const columns = Array(maxDepth + 1)
    .fill(null)
    .map((_, depth) => {
      // depth in terms of x-axis, depth = 0 means left most position
      return (
        nodes
          .filter((node) => node.depth === depth)
          // for all nodes in that x-axis depth, which one should be put on top based on y0 (starting position of the node at y-axis)
          .sort((node1, node2) => node1.y0 - node2.y0)
      );
    })
    .map((column) => {
      // avoid division by 0
      const newY =
        column.length - 1
          ? paddedMetroMapHeight / (column.length - 1)
          : paddedMetroMapHeight;

      return column.map((node, index) => {
        node.y = newY * index;
        return node;
      });
    });

  return columns;
};

const generateNodesXPosition = (columns, width) => {
  const gapratio = 1 / 10; // ratio of columns : gaps
  const blockwidth = width / (columns.length * (1 + gapratio) - gapratio); // width of a column
  columns.forEach((column, i) => {
    const left = i * 1.1 * blockwidth; // left bound for the marker
    // initialise each node x and height
    column.forEach((node) => {
      node.x = left + blockwidth / 2;
      node.height = NODEWIDTH;
    });
  });
};

const storeNeighbouringNodes = (nodes, newNodes) => {
  // Save neighbouring nodes
  nodes.forEach((node) => {
    const linesIn = node.targetLinks; // links coming in
    const linesOut = node.sourceLinks; // links going out
    const neighbours = linesIn
      .map((line) => line.source)
      .concat(
        // preceding nodes
        linesOut.map((line) => line.target) // succeding nodes
      );

    const convertNodeWordsToArray = (nodeWords) => {
      const result = nodeWords
        ? typeof nodeWords === "string"
          ? nodeWords.split(",")
          : nodeWords
        : [];

      return result;
    };

    newNodes[node.id] = {
      ...node,
      node_words: convertNodeWordsToArray(node.node_words),
      connectedNodes: neighbours,
      width: node.width ? node.width : NODEWIDTH,
      height: node.height ? node.height : NODEWIDTH,
      labelPos: "right",
    };
  });
};

// gets node ids from list of source, target links
// e.g. [{source: "0_5", target: "1_5"}, {source: "1_5", target: "2_3"}] => ["0_5", "1_5", "2_3"]
const getNodesConnectedByOneLine = (links) => {
  const [firstEdge, ...edges] = links;
  return edges.reduce(
    (nodes, currentEdge) => nodes.concat(currentEdge.target),
    [firstEdge.source, firstEdge.target]
  );
};

const getAverageNodesYPosition = (newNodes, metroMapData) => (lineId) => {
  const passedNodes = getNodesConnectedByOneLine(
    metroMapData.lines.find((line) => line.id === lineId).links
  );
  return (
    passedNodes.reduce(
      (yPositionSum, currentNode) => newNodes[currentNode].y + yPositionSum,
      0
    ) / passedNodes.length
  );
};

const colourNodes = (nodes, lines, edges, useNodeWeight, useEdgeWeight) => {
  const processNodeColours = (nodeColours) => {
    // console.log("nodeColours", nodeColours);
    // since some nodes may have multiple lines passing through them, nodeColours may contain multiple colours for a single node
    // line may not be sorted based on weight, so reversing the array may not always give the correct behaviour
    const uniqueNodeColours = nodeColours.reduce(
      (accumulated, currentNodeColour) => {
        if (accumulated[currentNodeColour.nodeId]) {
          return {
            ...accumulated,
            [currentNodeColour.nodeId]:
              // get the colour associated to line with greater weight
              accumulated[currentNodeColour.nodeId].weight <
              currentNodeColour.weight
                ? currentNodeColour
                : accumulated[currentNodeColour.nodeId],
          };
        }
        return {
          ...accumulated,
          [currentNodeColour.nodeId]: currentNodeColour,
        };
      },
      {}
    );

    Object.values(uniqueNodeColours).forEach((nodeColour) => {
      nodes[nodeColour.nodeId].colour = nodeColour.colour;
      nodes[nodeColour.nodeId].isChanged = false;
    });

    // console.log("nodeColours", nodeColours);
  };

  if (useNodeWeight) {
    let nodeColours = [];
    console.log("useNodeWeight", useNodeWeight);

    Object.keys(nodes).forEach((key) => {
      let currentObj = nodes[key];
      nodeColours.push({
        nodeId: currentObj.id,
        colour: customerInterpolation(
          showTruth && currentObj["node_weight-truth"] !== undefined
            ? currentObj["node_weight-truth"]
            : currentObj.node_weight
        ),
        weight:
          showTruth && currentObj["node_weight-truth"] !== undefined
            ? currentObj["node_weight-truth"]
            : currentObj.node_weight,
      });
    });

    processNodeColours(nodeColours);
  } else {
    if (!useEdgeWeight) {
      console.log("useEdgeWeight", useEdgeWeight, useNodeWeight);
      const lineOrder = Object.keys(lines);

      const linesColoursAndNodes = lineOrder.map((lineId) => {
        const { colour, nodeIDs, weight } = lines[lineId];
        return { colour, nodeIDs, weight };
      });

      const nodeColours = flatMap(
        linesColoursAndNodes,
        ({ colour, nodeIDs, weight }) =>
          nodeIDs.map((nodeId) => {
            return { colour, nodeId, weight };
          })
      );

      processNodeColours(nodeColours);
    } else {
      const nodeColours = edges.reduce((accumulated, edge) => {
        return accumulated.concat(
          {
            nodeId: edge.source.id,
            colour: customerInterpolation(edge.edge_weight),
            weight: edge.edge_weight,
          },
          {
            nodeId: edge.target.id,
            colour: customerInterpolation(edge.edge_weight),
            weight: edge.edge_weight,
          }
        );
      }, []);

      processNodeColours(nodeColours);
    }
  }
};

const colourNeighbouringNodes = (nodes) => {
  Object.keys(nodes).forEach((nodeId) => {
    nodes[nodeId].connectedNodes.forEach((connectedNode) => {
      connectedNode.colour = nodes[connectedNode.id].colour;
    });
  });
};

const calculateMetroMapLayout = (
  metroMapWidth,
  metroMapHeight,
  metroMapData,
  margin
) => {
  // console.log("Calculating metro map layout...", metroMapData);
  // the greater the margin, the smaller the metromap will be
  const paddedMetroMapWidth = metroMapWidth * (1 - 2 * margin.x);
  const paddedMetroMapHeight = metroMapHeight * (1 - 2 * margin.y);

  const newNodes = {};
  const newLines = {};

  preprocessData(metroMapData);

  // console.log("Preprocessed data", metroMapData);

  generateMetroMapFullViewPositions(
    paddedMetroMapWidth,
    paddedMetroMapHeight,
    metroMapData
  );

  // console.log("Generated full view positions", metroMapData);

  const nodes = metroMapData.nodes;

  // console.log("Nodes", nodes);

  const columns = distributeNodesOnYAxis(paddedMetroMapHeight, nodes);

  generateNodesXPosition(columns, paddedMetroMapWidth);

  storeNeighbouringNodes(nodes, newNodes);

  // See which nodes each line passes through
  // initialise nodeLines object
  const nodeLines = nodes.reduce((accumulated, node) => {
    return {
      ...accumulated,
      [node.id]: [],
    };
  }, {});

  // Add passed nodes to nodeLines
  metroMapData.lines.forEach((line, lineIndex) => {
    getNodesConnectedByOneLine(line.links).forEach((nodeId) => {
      nodeLines[nodeId].push(line.id);
    });

    // add edge label & edge weight if available
    line.links.forEach((lineLink, linkIndex) => {
      const matchingLink = metroMapData.links.find(
        (link) =>
          (link.id === line.id || link.line_id === line.id) &&
          link.source.id === lineLink.source &&
          link.target.id === lineLink.target
      );

      metroMapData.lines[lineIndex].links[linkIndex] = {
        ...matchingLink,
        ...lineLink,
      };
    });
  });

  // Sort lines based on their nodes avg y position
  metroMapData.nodes.forEach((node) => {
    const getAverageNodesYPositionFromLine = getAverageNodesYPosition(
      newNodes,
      metroMapData
    );
    nodeLines[node.id].sort(
      (line1, line2) =>
        getAverageNodesYPositionFromLine(line1) -
        getAverageNodesYPositionFromLine(line2)
    );
  });

  // calculates path coordinates with 45deg bends
  const generatePath = (nodes, line) => {
    const path = [];

    // generates basic coordinate object
    const getEndPoint = (link) => (node) => {
      // console.log("link", link);
      return {
        source: link.source,
        target: link.target,
        x: node.x,
        y: node.y,
        start: null,
        end: null,
        endPoint: true,
        edgeColour:
          link.edge_weight !== undefined
            ? customerInterpolation(
                showTruth && link["edge_weight-truth"] !== undefined
                  ? link["edge_weight-truth"]
                  : link.edge_weight
              )
            : "white", // do not use link.edge_weight ? ... since 0 is a falsey value
        edgeLabel: link.edge_label !== undefined ? link.edge_label : null,
      };
    };

    line.links.forEach((link, index) => {
      // get starting and ending positions of an edge between two nodes
      const getLinkEndPoint = getEndPoint(link);
      const edgeStartingPoint = getLinkEndPoint(nodes[link.source]);
      const edgeEndingPoint = getLinkEndPoint(nodes[link.target]);

      // the first edge contains the starting point of the path
      if (index === 0) path.push(edgeStartingPoint);

      const angleBetweenTwoPoints =
        (Math.atan2(
          edgeEndingPoint.y - edgeStartingPoint.y,
          edgeEndingPoint.x - edgeStartingPoint.x
        ) *
          180) /
        Math.PI;

      if (Math.abs(angleBetweenTwoPoints) < 45) {
        // angle between  nodes is less than 45deg
        const avgX = (edgeEndingPoint.x + edgeStartingPoint.x) / 2;
        const halfYdist = Math.abs(
          (edgeEndingPoint.y - edgeStartingPoint.y) / 2
        );
        if (halfYdist < 5) {
          const wayPnt1 = {
            x: avgX - halfYdist,
            y: edgeStartingPoint.y,
            start: null,
            end: null,
            endPoint: false,
          };
          const wayPnt2 = {
            x: avgX + halfYdist,
            y: edgeEndingPoint.y,
            start: null,
            end: null,
            endPoint: false,
          };
          path.push(wayPnt1);
          path.push(wayPnt2);
        }
        // introduces 45deg to path
        else if (edgeEndingPoint.y > edgeStartingPoint.y) {
          //sloping down
          const wayPnt1 = {
            x: avgX - halfYdist,
            y: edgeStartingPoint.y,
            start: [-1, 0], // defines nature of curve
            end: [1, 1],
            endPoint: false,
          };
          const wayPnt2 = {
            x: avgX + halfYdist,
            y: edgeEndingPoint.y,
            start: [-1, -1],
            end: [1, 0],
            endPoint: false,
          };
          path.push(wayPnt1);
          path.push(wayPnt2);
        } else {
          // sloping up
          const wayPnt1 = {
            x: avgX - halfYdist,
            y: edgeStartingPoint.y,
            start: [-1, 0],
            end: [1, -1],
            endPoint: false,
          };
          const wayPnt2 = {
            x: avgX + halfYdist,
            y: edgeEndingPoint.y,
            start: [-1, 1],
            end: [1, 0],
            endPoint: false,
          };
          path.push(wayPnt1);
          path.push(wayPnt2);
        }
      } else {
        // angle between nodes is greater than 45deg
        const avgY = (edgeEndingPoint.y + edgeStartingPoint.y) / 2;
        const halfXdist = (edgeEndingPoint.x - edgeStartingPoint.x) / 2;
        const slope = Math.sign(edgeStartingPoint.y - edgeEndingPoint.y);
        // introduces 45deg to path
        const wayPnt1 = {
          x: edgeStartingPoint.x,
          y: avgY + slope * halfXdist,
          start: null,
          end: null,
          endPoint: false,
        };
        const wayPnt2 = {
          x: edgeEndingPoint.x,
          y: avgY - slope * halfXdist,
          start: null,
          end: null,
          endPoint: false,
        };
        path.push(wayPnt1);
        path.push(wayPnt2);
      }
      path.push(edgeEndingPoint); // added twice
    });
    return path;
  };

  // generate line properties path and colour
  metroMapData.lines.forEach((line) => {
    // console.log(line);
    newLines[`line_${line.id}`] = {
      ...line,
      line_label_start:
        line.line_label_start &&
        columns[0].find((node) => node.id === line.links[0].source)
          ? line.line_label_start
          : null,
      line_label_end:
        line.line_label_end &&
        columns[columns.length - 1].find(
          (node) => node.id === line.links[line.links.length - 1].target
        )
          ? line.line_label_end
          : null,
      nodeIDs: getNodesConnectedByOneLine(line.links),
      pathCoords: generatePath(newNodes, line),
      colour: line.weight ? customerInterpolation(line.weight) : "white",
      isChanged: false,
    };
  });

  colourNodes(
    // nodes, lines, edges, useNodeWeight, useEdgeWeight
    newNodes,
    newLines,
    metroMapData.links,
    metroMapData.nodes[0].node_weight !== undefined,
    metroMapData.links[0].edge_weight !== undefined
    // can not use node_weight ? ... since 0 is a falsey value as well
  );

  colourNeighbouringNodes(newNodes);

  // minimiseDuplicatedNodeWords(columns, newNodes);

  // console.log("newNodes from calculateMetroMap", newNodes);

  return [newNodes, newLines, columns];
};

export { calculateMetroMapLayout };
