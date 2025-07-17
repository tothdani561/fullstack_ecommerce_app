import { useState } from "react";
import Navbar from "../../components/HomePage/Navbar/Navbar";
import Stepper from "../../components/Payment/Stepper/Stepper";
import StepperControl from "../../components/Payment/Stepper/StepperControl";
import Account from "../../components/Payment/Steps/Account";
import Details from "../../components/Payment/Steps/Details";
import Final from "../../components/Payment/Steps/Final";
import { StepperContext } from "../../context/StepperContext";
import Payment from "../../components/Payment/Steps/Payment";

export default function PaymentStepper() {
    const [currentStep, setCurrentStep] = useState(1);
    const [userData, setUserData] = useState('');
    const [finalData, setFinalData] = useState<any[]>([]);

    const steps = [
        "Account Information",
        "Personal Details",
        "Payment",
        "Complete"
    ];

    const displayStep = (step: number) => {
        switch(step) {
            case 1:
                return <Account />;
            case 2:
                return <Details />;
            case 3:
                return <Payment />;
            case 4:
                return <Final />;
            default:
        }
    }

    const handleClick = (direction?: string) => {
        let newStep = currentStep;
        direction === "next" ? newStep++ : newStep--;
        newStep > 0 && newStep <= steps.length && setCurrentStep(newStep);
    }

    return (
        <>
            <Navbar />
            <div className="md:w-[70%] mx-auto shadow-xl rounded-2xl pb-2 bg-white m-4">
                <div className="container horizontal mt-5">
                    <Stepper steps={steps} currentStep={currentStep} />
                    <div className="my-10 p-10 ">
                        <StepperContext.Provider value={{
                            userData,
                            setUserData,
                            finalData,
                            setFinalData
                        }}>
                            {displayStep(currentStep)}
                        </StepperContext.Provider>
                    </div>
                </div>
                    <StepperControl handleClick = {handleClick} currentStep = {currentStep} steps={steps} />
            </div>
        </>
    );
}
