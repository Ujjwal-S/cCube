import {Char} from './char.js';
import {Identifier} from './identifier.js';


export class CRDT {
    constructor(siteId) {
        this.struct = [];
        this.length = 0;
        this.siteId = siteId;
        this.counter = 0;
        this.text = "";
    }
    insertChar(char) {
        this.struct.push(char);
        this.struct = this.sortByIdentifier();
        this.updateText();
        return ++this.length;
    }
    localInsert(val, index) {
        this.incrementCounter();
        const newChar = this.generateChar(val, index);
        this.insertChar(newChar);
        return newChar;
    }
    generateChar(val, index) {
        const posBefore =
            (this.struct[index - 1] && this.struct[index - 1].position) || [];
        const posAfter =
            (this.struct[index] && this.struct[index].position) || [];
        const newPos = this.generatePosBetween(posBefore, posAfter);
        return new Char(val, this.counter, newPos);
    }
    generatePosBetween(pos1, pos2, newPos = []) {
        let id1 = pos1[0] || new Identifier(0, this.siteId);
        let id2 = pos2[0] || new Identifier(10, this.siteId);
        if (id2.digit - id1.digit > 1) {
            let newDigit = Math.floor((id1.digit + id2.digit) / 2);
            newPos.push(new Identifier(newDigit, this.siteId));
            return newPos;
        } else if (id2.digit - id1.digit === 1) {
            newPos.push(id1);
            return this.generatePosBetween(pos1.slice(1), [], newPos);
        } else if (id1.digit === id2.digit) {
            if (id1.siteId < id2.siteId) {
                newPos.push(id1);
                return this.generatePosBetween(pos1.slice(1), [], newPos);
            } else if (id1.siteId === id2.siteId) {
                newPos.push(id1);
                return this.generatePosBetween(
                    pos1.slice(1),
                    pos2.slice(1),
                    newPos
                );
            } else {
                throw new Error("Fix Position Sorting");
            }
        }
    }
    localDelete(index) {
        this.struct.splice(index, 1);
        this.incrementCounter();
        this.updateText();
        return --this.length;
    }

    updateText() {
        this.text = this.struct.map((char) => char.value).join("");
    }
    sortByIdentifier() {
        return this.struct.sort((char1, char2) =>
            char1.comparePositionTo(char2)
        );
    }
    incrementCounter() {
        this.counter++;
    }
    findInsertIndex(char) { 
        let left = 0;
        let right = this.struct.length - 1;
        let mid, compareNum;
    
        if (this.struct.length === 0 || char.comparePositionTo(this.struct[left]) < 0) {
          return left;
        } else if (char.comparePositionTo(this.struct[right]) > 0) {
          return this.struct.length;
        }
    
        while (left + 1 < right) {
          mid = Math.floor(left + (right - left) / 2);
          compareNum = char.comparePositionTo(this.struct[mid]);
    
          if (compareNum === 0) {
            return mid;
          } else if (compareNum > 0) {
            left = mid;
          } else {
            right = mid;
          }
        }
        return char.comparePositionTo(this.struct[left]) === 0 ? left : right
    }
    findIndexByPosition(char) {
        const charId = this.getStringId(char.position);
    
        const thisChar = this.struct.find(ch => {
          return charId === this.getStringId(ch.position);
        });
    
        const index = this.struct.indexOf(thisChar);
    
        if (index === -1) {
          throw new Error("Character does not exist in CRDT.");
        }
    
        return index;
    }
    
    getStringId(pos) {
        return pos.map(i => i.digit).join(".");
    }

    remoteInsert(char) {
        if (this.struct.counter === char.counter){
            if(this.siteId > char.position[0].siteId){
                return;
            }
        }

        const index = this.findInsertIndex(char);
        this.struct.splice(index, 0, char);
        this.updateText();
    
        return { char: char.value, index: index };
    }
    remoteDelete(char) {
        if (this.struct.counter === char.counter){
            if(this.siteId > char.position[0].siteId){
                return;
            }
        }

        const index = this.findIndexByPosition(char);
        this.struct.splice(index, 1);
        this.updateText();
    
        return index;
    }
}