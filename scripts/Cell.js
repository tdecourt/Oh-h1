class Cell {
    constructor(x, y) {
        this._x = x;
        this._y = y;
        this._state = new EmptyState();
    }

    toggleState() {
        this._state = this._state.handle();
        return this._state.color;
    }
}