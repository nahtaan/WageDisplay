const validateRateInput = (e) => {
    if(e.key === "Backspace" || e.key === "Delete" || e.key === "ArrowLeft"|| e.key === "ArrowRight"|| e.key === "ArrowUp"|| e.key === "ArrowDown") {
        return true;
    }
    const ogValue = e.explicitOriginalTarget.value;
    if(ogValue.includes(".") && e.key === ".") {
        return false;
    }
    if(ogValue === "" && e.key === ".") {
        e.target.value = "0.";
        return false;
    }
    return /^[0-9.]$/.test(e.key);
}

const handleStart = () => {
    
}