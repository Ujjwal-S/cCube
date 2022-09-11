export class Char {
    constructor(value, counter, identifiers) {
        this.position = identifiers;
        this.counter = counter;
        this.value = value;
    }

    comparePositionTo(otherChar) {
        const pos1 = this.position;
        const pos2 = otherChar.position;
        for (let i = 0; i < Math.min(pos1.length, pos2.length); i++) {
            let comp = pos1[i].compareTo(pos2[i]);

            if (comp === 0 && i === Math.min(pos1.length, pos2.length) -1){
                if (pos1[i].siteId < pos2[i].siteId) {
                    return -1;
                } else if (pos1[i].siteId > pos2[i].siteId) {
                    return 1;
                }
            }

            if (comp !== 0) {
                return comp;
            }
        }

        if (pos1.length < pos2.length) {
            return -1;
        } else if (pos1.length > pos2.length) {
            return 1;
        } else {
            return 0;
        }
    }
}
