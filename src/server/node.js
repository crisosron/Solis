// Represents a node on the gameBoard
const BOUNDING_BOX_WIDTH = 5;
const BOUNDING_BOX_HEIGHT = 5;

class Node{

    // Construct a Node at a given position
    constructor(xPos, yPos){
        this.adjacentNodes = Array(0);
        this.positionX = xPos;
        this.positionY = yPos;
        this.generateStarPosition();

        this.colony = null;
    }

    // Generate where to display the star that displays the node
    generateStarPosition(){
        // Positions are [-BOUNDING_BOX, BOUNDING_BOX]
        this.starX = Math.floor(Math.random() * 2 * BOUNDING_BOX_WIDTH) + 1 - BOUNDING_BOX_WIDTH;
        this.starY = Math.floor(Math.random() * 2 * BOUNDING_BOX_HEIGHT) + 1 - BOUNDING_BOX_HEIGHT;
    }

    // Remove the colony on this node
    removeColony(){
        this.colony = null;
    }

}

export default Node;