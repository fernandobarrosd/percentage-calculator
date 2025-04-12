type ElementOrNull<T extends HTMLElement> = T | null;
type Action = "increase" | "decrease";

type StateData = {
    decimal: number,
    percentageValue: number,
    action: Action
}

type StateProxyType = {
    data: StateData
}

const $calculatorForm = document.forms[0];
const $inputs = document.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
const $result = document.querySelector("#result");
const $actionSymbol = document.querySelector("#action-symbol");
const $actionsSelect = document.querySelector("select#action") as ElementOrNull<HTMLSelectElement>;
const $decimalInput = document.querySelector("input#decimal-value") as ElementOrNull<HTMLInputElement>;
const $percentageInput = document.querySelector("input#percentage") as ElementOrNull<HTMLInputElement>;

const initialState : StateProxyType = {
    data: {
        decimal: 0, 
        percentageValue: 0,
        action: "increase"
    }
}
const state = new Proxy<StateProxyType>(initialState, {
    set(target, _, newTargetValue) {
        target.data = newTargetValue;

        const { decimal, percentageValue, action } = target.data;
        const percentage = percentageValue / 100;
        const newValue = calculatePercentage(action, decimal, percentage);
        const decimalValueFormatted = formatNumberTextToBRLNumberFormat(decimal.toString());
        const newValueFormatted = formatNumberTextToBRLNumberFormat(newValue.toString());
    
        if ($result) {
            $result.textContent = `${decimalValueFormatted} 
            ${action === "increase" ? "aumentou" : "diminuiu"}
                para ${newValueFormatted}`;
        }
        return true;
    }
});

function updateState(stateData: StateData) {
    state.data = stateData;
}

function calculatePercentage(action: Action, decimal: number, percentage: number) {
    if (action === "increase") {
        return decimal + (decimal * percentage);
    }
    return decimal - (decimal * percentage);
}


function formatNumberTextToBRLNumberFormat(numberString: string) {
    const numberFormatter = new Intl.NumberFormat("pt-br", {});
    return numberFormatter.format(parseInt(numberString));
}


$inputs.forEach($input => {
    $input.addEventListener("input", (e) => {
        const target = e.target as HTMLInputElement;
        const { value } = target;

        const valueWithoutCharacters = value.replace(/\D/g, "");

        if (valueWithoutCharacters) {
            target.value = formatNumberTextToBRLNumberFormat(valueWithoutCharacters);   
        }
    });
});


$actionsSelect?.addEventListener("input", e => {
    const { selectedIndex, options } = e.target as HTMLSelectElement;
    const $selectedOption = options[selectedIndex];

    if ($actionSymbol) {
        
        if ($selectedOption.value === "increase") {
            $actionSymbol.textContent = "+";
        }
        else {
            $actionSymbol.textContent = "-";
        }
    }
});



$calculatorForm.addEventListener("submit", e => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const decimalValue = formData.get("value")?.toString();
    const percentageValue = formData.get("percentage")?.toString();
    const actionValue = formData.get("action")?.toString();


    if (decimalValue && percentageValue && actionValue) {
        const percentage = parseInt(percentageValue.replace(".", ""));
        const decimal = parseInt(decimalValue.replace(".", ""));
        const action = actionValue as "increase" | "decrease";

        updateState({
            decimal: decimal,
            percentageValue: percentage,
            action
        })
    }
});