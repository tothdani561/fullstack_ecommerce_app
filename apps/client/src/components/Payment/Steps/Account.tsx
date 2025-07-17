import { useContext } from "react"
import { StepperContext } from "../../../context/StepperContext"

const Account = () => {
    const stepperContext = useContext(StepperContext);
    if (!stepperContext) {
        return null;
    }

    return (
        <div>Account</div>
    )
}

export default Account