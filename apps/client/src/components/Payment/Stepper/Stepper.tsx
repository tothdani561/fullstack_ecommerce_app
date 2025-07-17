import { useEffect, useRef, useState } from "react";

interface StepperProps {
    steps: string[];
    currentStep: number;
}

const Stepper = ({steps, currentStep}: StepperProps) => {
    const [newStep, setNewStep] = useState<{ description: string; complete: boolean; highlighted: boolean; selected: boolean; }[]>([]);
    const stepRef = useRef<{ description: string; complete: boolean; highlighted: boolean; selected: boolean; }[] | null>(null);

    const updateStep = (stepNumber: number, steps: any[]) => {
        const newSteps = [...steps];
        let count = 0;

        while (count < newStep.length) {

            if (count === stepNumber) {
                newSteps[count] = {
                    ... newSteps[count],
                    highlighted: true,
                    selected: true,
                    complete: true,
                };
                count++;
            } else if (count <stepNumber) {
                newSteps[count] = {
                    ... newSteps[count],
                    highlighted: false,
                    selected: true,
                    complete: true,
                };
                count++;
            } else {
                newSteps[count] = {
                    ... newSteps[count],
                    highlighted: false,
                    selected: false,
                    complete: false,
                };
                count++;
            }
        }
        return newSteps;
    };

    useEffect(() => {
        const stepsState = steps.map((step, index) => {
            return Object.assign({},{
                description: step,
                complete: false,
                highlighted: index === 0 ? true : false,
                selected: index === 0 ? true : false
            });
        });
        stepRef.current = stepsState;
        const current = updateStep(currentStep - 1, stepRef.current);
        setNewStep(current);
    },[steps, currentStep]);

    const displaySteps = newStep.map((step, index) => {
        return (
            <div key={index} className={index !== newStep.length - 1 ? "w-full flex items-center" : "flex items-center"}>
            <div className="relative flex flex-col items-center text-primary">
                <div className={`rounded-full transition duration-500 ease-in-out border-2 border-gray-300 h-12 w-12 flex items-center justify-center py-3
                    ${step.selected ? "bg-primary text-white font-bold border border-primary" : ""}`}>
                        {step.complete ? <span className="text-white font-bold text-xl">&#10003;</span> : (index + 1) }
                </div>
                <div className={`absolute top-0 text-center mt-16 w-32 text-xs font-medium uppercase
                    ${step.highlighted ? "text-gray-900" : "text-gray-400"}`}>{step.description}</div> {/*30:42*/}
            </div>
            <div className={`flex-auto border-t-2 transition duration-500 ease-in-out ${step.complete ? "border-primary" : "border-gray-300"}`}></div>
        </div>
        )
    });

    return (
        <div className="mx-4 p-4 flex justify-between items-center">
            {displaySteps}
        </div>
    )
}

export default Stepper