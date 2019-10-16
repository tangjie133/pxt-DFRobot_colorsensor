// Add your code here
//%weight=100 color=#00A654  block="Colorsensor"
namespace DFRobot_ColorSensor{
    let TCS34725_ADDRESS          =  0X29
    let REG_TCS34725_ID           =  0X12
    let REG_TCS34725_COMMAND_BIT  =  0X80
    let TCS34725_BEGIN            =  0
    let REG_TCS34725_GAIN             =  0X0F
    let REG_TCS34725_ATIME            =  0X01
    let REG_TCS34725_ENABLE           =  0X00

    function ReadReg(addr:number,reg:number):number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.Int8LE);
        return pins.i2cReadNumber(addr, NumberFormat.Int8LE);
    }

    function WriteReg(addr:number,reg:number,dat:number) {
        let buf=pins.createBuffer(2);
        buf[0]=reg;
        buf[1]=dat;
        pins.i2cWriteBuffer(addr, buf);
    }

    /**
     * TCS34725 Color Sensor Init
     */
    function Tcs34725Beging():boolean {
        TCS34725_BEGIN = 0;
       let id=ReadReg(TCS34725_ADDRESS,REG_TCS34725_ID|REG_TCS34725_COMMAND_BIT);
       if((id!=0x44)&&(id!=0x10)) return false;
       TCS34725_BEGIN = 1;
        WriteReg(TCS34725_ADDRESS, REG_TCS34725_ATIME|REG_TCS34725_COMMAND_BIT, 0XEB)
        WriteReg(TCS34725_ADDRESS, REG_TCS34725_GAIN|REG_TCS34725_COMMAND_BIT, 0X01)
        WriteReg(TCS34725_ADDRESS, REG_TCS34725_ENABLE|REG_TCS34725_COMMAND_BIT, 0X01)
        basic.pause(3)
        WriteReg(TCS34725_ADDRESS, REG_TCS34725_ENABLE|REG_TCS34725_COMMAND_BIT, 0X01|0X02)
        return true;
    }

    function GetRGB() {
        
    }

    //%block="get read"
    export function GetRead() {
        
    }
    
}