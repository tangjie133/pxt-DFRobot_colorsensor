
//%weight=100 color=#00A654  block="Colorsensor"
namespace DFRobot_ColorSensor{
    let TCS34725_ADDRESS              =  0X29
    let REG_TCS34725_ID               =  0X12
    let REG_TCS34725_COMMAND_BIT      =  0X80
   

    let REG_TCS34725_GAIN             =  0X0F
    let REG_TCS34725_ATIME            =  0X01
    let REG_TCS34725_ENABLE           =  0X00
    let TCS34725_ENABLE_AIEN          = 0X10   

    let REG_CLEAR_CHANNEL_L           =  0X14 
    let REG_RED_CHANNEL_L             =  0X16
    let REG_GREEN_CHANNEL_L           =  0X18
    let REG_BLUE_CHANNEL_L            =  0X1A             


    let TCS34725_RGBC_C               =  0
    let TCS34725_RGBC_R               =  0
    let TCS34725_RGBC_G               =  0
    let TCS34725_RGBC_B               =  0     
    let TCS34725_BEGIN                =  0

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

    function GetUInt16LE(addr:number,reg:number):number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8LE)
        return pins.i2cReadNumber(addr, NumberFormat.UInt16LE)
    }
    /**
     * TCS34725 Color Sensor Init
     */
    function Tcs34725Beging():boolean {
        TCS34725_BEGIN = 0;
       let id=ReadReg(TCS34725_ADDRESS,REG_TCS34725_ID|REG_TCS34725_COMMAND_BIT);
       if((id!=0x44)&&(id!=0x10)) return false;
       TCS34725_BEGIN = 1;
        WriteReg(TCS34725_ADDRESS, REG_TCS34725_ATIME|REG_TCS34725_COMMAND_BIT, 0XEB);
        WriteReg(TCS34725_ADDRESS, REG_TCS34725_GAIN|REG_TCS34725_COMMAND_BIT, 0X01);
        WriteReg(TCS34725_ADDRESS, REG_TCS34725_ENABLE|REG_TCS34725_COMMAND_BIT, 0X01);
        basic.pause(3)
        WriteReg(TCS34725_ADDRESS, REG_TCS34725_ENABLE|REG_TCS34725_COMMAND_BIT, 0X01|0X02);
        return true;
    }

    function GetRGBC() {
        if(!TCS34725_BEGIN) Tcs34725Beging();
        TCS34725_RGBC_C = GetUInt16LE(TCS34725_ADDRESS, REG_CLEAR_CHANNEL_L | REG_TCS34725_COMMAND_BIT);
        TCS34725_RGBC_R = GetUInt16LE(TCS34725_ADDRESS, REG_RED_CHANNEL_L | REG_TCS34725_COMMAND_BIT);
        TCS34725_RGBC_G = GetUInt16LE(TCS34725_ADDRESS, REG_GREEN_CHANNEL_L | REG_TCS34725_COMMAND_BIT);
        TCS34725_RGBC_B = GetUInt16LE(TCS34725_ADDRESS, REG_BLUE_CHANNEL_L |REG_TCS34725_COMMAND_BIT );

        basic.pause(50);
        let ret = ReadReg(TCS34725_ADDRESS, REG_TCS34725_ENABLE | REG_TCS34725_COMMAND_BIT);
        ret |= TCS34725_ENABLE_AIEN;
        WriteReg(TCS34725_ADDRESS, REG_TCS34725_ENABLE | REG_TCS34725_COMMAND_BIT, ret)


    }

    //%block="get read"
    export function GetRead():number {
        GetRGBC();
        let R = (Math.round(TCS34725_RGBC_R) / Math.round(TCS34725_RGBC_C)) * 255
        //serial.writeNumber(Math.round(R))
        return R
    }

    //%block = "get green"
    export function GetGreen():number {
        GetRGBC();
        let G = (Math.round(TCS34725_RGBC_G) / Math.round(TCS34725_RGBC_C)) * 255
        return G
    }

    //%block = "get blue"
    export function GetBlue() :number{
        GetRGBC();
        let B = (Math.round(TCS34725_RGBC_B) / Math.round(TCS34725_RGBC_C)) * 255
        return B
    }
    
    //%block ="get light"
    export function GetC():number {
        GetRGBC();
       return (Math.round(TCS34725_RGBC_C))  
    }
    
}