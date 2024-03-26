import { HTMLAttributes } from 'react';
import * as React from 'react';

import { PinPadKey } from 'components/PinPadKey';

export type inputProps = {
    value: string;
  };
const Input = ({value}: inputProps) => {
    let className = "";
   
    return (
      <div id="input-container">
        <input
          disabled
          type="password"
          className={className}
          value={value}
        />
      </div>
    );
  };

  

export const PinPad = () => {
    const [inputValue, setInputValue] = React.useState<string>("");
    const handlePinPadKeyClick = (value: number) => {
        let newInputValue = inputValue + `${value}`;
        setInputValue(newInputValue);
    
        if (newInputValue.length > 4) {
          //setUnlocked(false);
          //setWrong(false);
          setInputValue(`${value}`);
        } else if (newInputValue.length === 4) {
          //newInputValue === PASSCODE ? setUnlocked(true) : setWrong(true);
        }
      };
    return (
        <div>
            <Input value={inputValue}/>
            <section className="numbers">
                <section className="row">
                    <PinPadKey value={1} onClick={handlePinPadKeyClick} />
                    <PinPadKey value={2} onClick={handlePinPadKeyClick} />
                    <PinPadKey value={3} onClick={handlePinPadKeyClick} />
                </section>
                <section className="row">
                    <PinPadKey value={4} onClick={handlePinPadKeyClick} />
                    <PinPadKey value={5} onClick={handlePinPadKeyClick} />
                    <PinPadKey value={6} onClick={handlePinPadKeyClick} />
                </section>
                    <section className="row">
                    <PinPadKey value={7} onClick={handlePinPadKeyClick} />
                    <PinPadKey value={8} onClick={handlePinPadKeyClick} />
                    <PinPadKey value={9} onClick={handlePinPadKeyClick} />
                </section>
                    <section className="row">
                    <PinPadKey value={0} onClick={handlePinPadKeyClick} />
                </section>
        </section>
  </div>
  )}