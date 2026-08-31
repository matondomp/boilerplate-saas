
export class Address {
    _name: string
    _number: string
    _house: string
    constructor (name: string, number: string, house: string) {
        this._house = house
        this._name = name
        this._number = number
    }
    get name (): string {
        return this._name
    }
    get number (): string {
        return this._number
    }
    get house (): string {
        return this._house
    }
    get address (): string {
        return (this._name + this._number + this._house)
    }
}