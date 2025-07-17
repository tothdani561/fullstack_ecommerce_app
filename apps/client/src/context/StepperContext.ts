
import { createContext, Dispatch, SetStateAction } from "react";



interface StepperContextType {

    userData: any;

    setUserData: React.Dispatch<React.SetStateAction<any>>;

    finalData: any[];

    setFinalData: Dispatch<SetStateAction<any[]>>;

}



export const StepperContext = createContext<StepperContextType | null>(null);