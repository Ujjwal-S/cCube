export class Identifier {
    constructor(digit, siteId) {
        this.digit = digit;
        this.siteId = siteId;
    }

    compareTo(otherId) {
        if (this.digit < otherId.digit) {
            return -1;
        } else if (this.digit > otherId.digit) {
            return 1;
        } else {
                return 0;
        }
    }
}