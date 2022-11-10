/**
 * Définition abstraite de l'état d'une cellule
 */
class State {
    constructor() {
        if (this.constructor === State) {
            throw new TypeError('Abstract class "State" cannot be instantiated directly');
        }
    }
    get state() {
        throw new Error('You must implement this function');
    }

    get color() {
        throw new Error('You must implement this function');
    }

    handle() {
        throw new Error('You must implement this function');
    }
}

class EmptyState extends State {
    constructor() {
        super();
    }

    /**
     * Retourne le numéro de l'état de la cellule
     * @return {number}
     */
    get state() {
        return 0;
    }

    /**
     * Retourne la couleur de la cellule
     * @return {string}
     */
    get color() {
        return "#000000";
    }

    /**
     * Retourne le nouvel état de la cellule
     * @returns {State}
     */
    handle() {
        return new FisrtState();
    }
}

class FisrtState extends State {
    constructor() {
        super();
    }

    /**
     * Retourne le numéro de l'état de la cellule
     * @return {number}
     */
    get state() {
        return 1;
    }

    /**
     * Retourne la couleur de la cellule
     * @return {string}
     */
    get color() {
        return "#000000";
    }

    /**
     * Retourne le nouvel état de la cellule
     * @returns {State}
     */
    handle() {
        return new SecondState();
    }
}

class SecondState extends State {
    constructor() {
        super();
    }

    /**
     * Retourne le numéro de l'état de la cellule
     * @return {number}
     */
    get state() {
        return 2;
    }

    /**
     * Retourne la couleur de la cellule
     * @return {string}
     */
    get color() {
        return "#000000";
    }

    /**
     * Retourne le nouvel état de la cellule
     * @returns {State}
     */
    handle() {
        return new EmptyState();
    }
}