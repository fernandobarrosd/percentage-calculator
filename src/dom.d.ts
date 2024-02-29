declare global {
    interface Result {
        decimal: number
        percentageValue: number
        action: "increase" | "decrease"
    }

    interface ElementEventMap {
        "resultUpdated": CustomEvent<Result>
    }
}

export {};