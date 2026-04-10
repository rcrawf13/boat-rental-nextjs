import { NumberField } from '@base-ui/react/number-field';
import cirlePlus from "./../../../assets/circle-add.svg";
import cirleMinus from "./../../../assets/circle-minus.svg";
import { motion } from "motion/react";
import { staticImportSrc } from "@/lib/staticImportSrc";
type updateCurrentPriceFnType = (value: null | number) => void;
interface NumberComponentProps {
    updateCurrentPrice:updateCurrentPriceFnType,
    totalAvailableBookingTime?:number,

}

const NumberComponent = ({totalAvailableBookingTime,updateCurrentPrice}:NumberComponentProps) => {

    return (
        <>
            <div className="custDurCont">
            
                <NumberField.Root                 
                    onValueChange={(e)=>{
                    
                    if(e) {
                        updateCurrentPrice(e)
                    }
                    // console.log(e)
                    // Could have state update the value by
                    // doing a truthy check on bool
                    // Checks if state was updated from calendar component

                }} step={1} defaultValue={2} min={2} max={totalAvailableBookingTime??8}  >
                <NumberField.ScrubArea>
                <NumberField.ScrubAreaCursor />
                </NumberField.ScrubArea>
                <NumberField.Group style={{display:'flex', alignItems:'center',justifyItems:'center'}}>
                    <NumberField.Decrement style={{border:'none', background:'none', cursor:'pointer'}}>
                        <motion.img 
                        whileTap={{scale:.8,pointerEvents:'none'}}
                        src={staticImportSrc(cirleMinus)} 
                        style={{height:'5dvh', width:'5dvh'}} />
                    </NumberField.Decrement>
                        <NumberField.Input
                        className={'test'} 
                        style={{textAlign:'center',color:'#2F6F66'}} />
                    <NumberField.Increment style={{border:'none', background:'none', cursor:'pointer'}} >
                        <motion.img 
                        whileTap={{scale:.8,pointerEvents:'none'}}
                        src={staticImportSrc(cirlePlus)} 
                        style={{height:'5dvh', width:'5dvh'}} />
                    </NumberField.Increment>
                </NumberField.Group >
                </NumberField.Root>                
            </div>
        </>
    )
    }
    
    
    

export default NumberComponent 