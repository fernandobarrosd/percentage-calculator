const $calculatorForm = document.forms[0];
const $inputs = document.querySelectorAll("input") as NodeListOf<HTMLInputElement>;
const $result = document.querySelector("#result");
const $actionSymbol = document.querySelector("#action-symbol");
const $actionsSelect = document.querySelector("select#action") as HTMLSelectElement | null;
const $decimal = document.querySelector("input#decimal-value") as HTMLInputElement | null;
const $percentage = document.querySelector("input#percentage") as HTMLInputElement | null;

type StateProxyType = {
    data: {
        decimal: number,
        percentageValue: number,
        action: "increase" | "decrease"
    }
}

const numberFormatter = new Intl.NumberFormat("pt-br", {})
const state = new Proxy<StateProxyType>({
    data: {
        decimal: 0, 
        percentageValue: 0,
        action: "increase"
    }
}, {
    set(target, _, newTargetValue) {
        target.data = newTargetValue;

        const { decimal, percentageValue, action } = target.data;
        const percentage = percentageValue / 100;
        let newValue = 0;
            
            
        if (action === "increase") {
            newValue = decimal + (decimal * percentage);
        }
        else {
            newValue = decimal - (decimal * percentage);
        }
        newValue = parseInt(newValue.toString());
            
        if ($result) {
            $result.textContent = `${decimal} ${action === "increase" ? "aumentou" : "diminuiu"}
                para ${newValue}`;
        }
        return true;
    }
});

$inputs.forEach($input => {
    $input.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault();
        }
    });

    $input.addEventListener("input", (e) => {
        const target = e.target as HTMLInputElement;
        const { value } = target;
        const valueWithoutCharacters = value.replace(/\D/g, "");
        if (valueWithoutCharacters) {
            const valueFormatted = numberFormatter.format(parseInt(valueWithoutCharacters));
            target.value = valueFormatted;
        }
    });
});

$result?.addEventListener("resultUpdated", e => {
    const { percentageValue, action, decimal } = e.detail;
    const percentage = percentageValue / 100;
    let newValue = 0;
        
        
    if (action === "increase") {
        newValue = decimal + (decimal * percentage);
    }
    else {
        newValue = decimal - (decimal * percentage);
    }
    newValue = parseInt(newValue.toString());
        
    if ($result) {
        $result.textContent = `${decimal} ${action === "increase" ? "aumentou" : "diminuiu"}
            para ${newValue}`;
    }
})

$actionsSelect?.addEventListener("input", e => {
    const { selectedIndex, options } = e.target as HTMLSelectElement;
    const $selectedOption = options[selectedIndex];
    const action = $selectedOption.value as "increase" | "decrease"

    if ($actionSymbol) {
        
        if ($selectedOption.value === "increase") {
            $actionSymbol.textContent = "+";
        }
        else {
            $actionSymbol.textContent = "-";
        }
    }

    if ($decimal && $percentage) {
        const decimal = $decimal.valueAsNumber;
        const percentage = $percentage.valueAsNumber;
        state.data = {
            decimal,
            percentageValue: percentage,
            action
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
        const percentage = parseInt(percentageValue);
        const decimal = parseInt(decimalValue!);
        const action = actionValue as "increase" | "decrease";

        state.data = {
            decimal,
            percentageValue: percentage,
            action
        }
    }
});