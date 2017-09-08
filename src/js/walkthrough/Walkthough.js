export default class Walkthrough {
    constructor(walkthrough) {
        this.walkthrough = walkthrough;
    }

    generateHighlightId() {
        return Math.random().toString(36).substr(2, 9);
    }
}
