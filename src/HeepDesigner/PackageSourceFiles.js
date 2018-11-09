import fileDownload from 'react-file-download'
import JSZip from 'jszip'
import randomNumber from 'random-number-csprng'

import { sys_phy_files } from './SystemPHYCompatibilities'

import { applications } from '../assets/inoFiles.js'

export const packageSourceFiles = (deviceDetails, controls) => {

  console.log("About to print application Name")
  console.log(deviceDetails.applicationName)
  //console.log(inoFiles.ClimateSensorFile);

  console.log("Device: ", deviceDetails);
  console.log("Controls: ", controls);
  
  var autoGenIncludes = '';

  var zip = new JSZip();

  switch (deviceDetails.systemType) {
    case "ESP8266" :

      packageESP8266Files(deviceDetails, controls, zip);
      autoGenIncludes = getIncludes_ESP8266(deviceDetails);

      break

    case "Simulation" :

      packageSimulationFiles(deviceDetails, controls, zip);
      autoGenIncludes = getIncludes_Simulation(deviceDetails);

      console.log(autoGenIncludes);
      break

    default :
      console.log("Did not match systemType");
  }

  var nameZip = removeSpacesFromString(deviceDetails.deviceName) + '.zip';

  setIDAndMAC((deviceIDarray, MACAddressArray) => {

    zip.file('HeepDeviceDefinitions.h', generateDeviceDefinitionsFile(deviceDetails.deviceName, deviceIDarray, MACAddressArray, autoGenIncludes));

    zip.generateAsync({type:"blob"})
    .then(function(content) {
        fileDownload(content, nameZip);
    });
  })
  

}

const removeSpacesFromString = (NameToConvert) => {
  return NameToConvert.split(' ').join('_');
}

const packageESP8266Files = (deviceDetails, controls, zip) => {

  zip.file(removeSpacesFromString(deviceDetails.deviceName) + ".ino", composeInoFile(deviceDetails, controls));

  return zip
}

const packageSimulationFiles = (deviceDetails, controls, zip) => {

  zip.file(removeSpacesFromString(deviceDetails.deviceName) + ".ino", composeInoFile(deviceDetails, controls));

  return zip
}

const getPreExistingInoFile = (deviceDetails) => {

  return applications[deviceDetails.applicationName].file;
}

const composeInoFile = (deviceDetails, controls) => {

  if(deviceDetails.applicationName != "Custom"){
    return getPreExistingInoFile(deviceDetails);
  }

var fileContent = `
#include "HeepDeviceDefinitions.h"\n`
+ initializeControls(controls)
+ createHardwareControlFunctionsArduinoSyntax(controls)
+ CreateReadFunctions(controls)
+ CreateWriteFunctions(controls)
+ `void setup()
{

  Serial.begin(115200);\n`
+ GetTabCharacter() + `InitializeControlHardware();\n`
+ setControls(controls)
+ GetTabCharacter() + `StartHeep(heepDeviceName, ` + deviceDetails.iconSelected + `);\n
}

void loop()
{
  PerformHeepTasks();\n`
+ GetReadWriteFunctionCalls(controls)
+ `\n}`

  return fileContent
}

var getPinDefineName = (control) => {
  var pinDefineStr = removeSpacesFromString(control.controlName).toUpperCase() + `_PIN`;
  return pinDefineStr;
}

var getPinDefine = (control) => {
  var pinDefineStr = `\n#define `+ getPinDefineName(control) + ` ` + control.pinNumber;
  return pinDefineStr;
}

var GetTabCharacter = () => {
  return `  `;
}

var GetReadFunctionName = (control) => {
  var ReadFunctionName = `Read` + removeSpacesFromString(control.controlName);
  return ReadFunctionName;
}

var GetWriteFunctionName = (control) => {
  var WriteFunctionName = `Write` + removeSpacesFromString(control.controlName);
  return WriteFunctionName;
}

var createHardwareControlFunctionsArduinoSyntax = (controls) => {
  var hardwareInitializations = `\nvoid InitializeControlHardware(){`;

  // output == 1, input == 0 
  // TODO: Make control direction into an enum with defined numbers just like Unity
  for (var i in controls) {

    if(controls[i].designerControlType == "Pin")
    {
      var arduinoDirection = "OUTPUT";
      if(controls[i].controlDirection == 1){
        arduinoDirection = "INPUT";
      }

      hardwareInitializations += `\n` + GetTabCharacter() + `pinMode(` + getPinDefineName(controls[i]) + `,` + arduinoDirection + `);`;
    }
  }

  hardwareInitializations += `\n}\n\n`;

  return hardwareInitializations;
}

var CreatePinControlReadFunction = (control) => {
  var readFunction = ``;

  var notSign = ``;
  if(control.pinNegativeLogic){
    notSign = `!`;
  }

  readFunction += `int ` + GetReadFunctionName(control) + `(){\n`
            + GetTabCharacter() + `int currentSetting = ` + notSign + control['analogOrDigital'] + `Read(` + getPinDefineName(control) + `);\n`
            + GetTabCharacter() + `SetControlValueByName("` + control.controlName + `",currentSetting);\n`
            + GetTabCharacter() + `return currentSetting;\n`
            + `}\n\n`;

  return readFunction;
}

var CreateVirtualControlReadFunction = (control) => {
  var readFunction = ``;

  readFunction += `int ` + GetReadFunctionName(control) + `(){\n`
            + GetTabCharacter() + `int currentSetting = 0; //ToDo: Add your custom control logic here\n`
            + GetTabCharacter() + `SetControlValueByName("` + control.controlName + `",currentSetting);\n`
            + GetTabCharacter() + `return currentSetting;\n`
            + `}\n\n`;

  return readFunction;
}

var CreateReadFunctions = (controls) => {
  var readFunctions = ``;

  // output == 1, input == 0 
  // TODO: Make control direction into an enum with defined numbers just like Unity
  for (var i in controls) {

    // Only react to outputs. Heep Outputs are Hardware Inputs
    if(controls[i].controlDirection == 1){
      if(controls[i].designerControlType == "Pin"){
          readFunctions += CreatePinControlReadFunction(controls[i]);
      }
      else{
          readFunctions += CreateVirtualControlReadFunction(controls[i]);
      }
    }
  }

  return readFunctions;

}

var CreatePinControlWriteunction = (control) => {
  var writeFunction = ``;

  var notSign = ``;
  if(control.pinNegativeLogic){
    notSign = `!`;
  }

  writeFunction += `int ` + GetWriteFunctionName(control) + `(){\n`
        + GetTabCharacter() + `int currentSetting = GetControlValueByName("` + control.controlName + `");\n`
        + GetTabCharacter() + control['analogOrDigital'] + `Write(` + getPinDefineName(control) + `,` + notSign + `currentSetting);\n`
        + GetTabCharacter() + `return currentSetting;\n`
        + `}\n\n`;

  return writeFunction;
}

var CreateVirtualControlWriteFunction = (control) => {
  var writeFunction = ``;

  writeFunction += `int ` + GetWriteFunctionName(control) + `(){\n`
        + GetTabCharacter() + `int currentSetting = GetControlValueByName("` + control.controlName + `");\n`
        + GetTabCharacter() + `//ToDo: Add your custom control logic here\n`
        + GetTabCharacter() + `return currentSetting;\n`
        + `}\n\n`;

  return writeFunction;
}

var CreateWriteFunctions = (controls) => {
  var writeFunctions = ``;

  // output == 1, input == 0 
  // TODO: Make control direction into an enum with defined numbers just like Unity
  for (var i in controls) {

    // Only react to inputs. Heep inputs are Hardware Outputs
    if(controls[i].controlDirection == 0){
      if(controls[i].designerControlType == "Pin"){
        writeFunctions += CreatePinControlWriteunction(controls[i]);
      }
      else{
        writeFunctions += CreateVirtualControlWriteFunction(controls[i]);
      }
    }
  }

  return writeFunctions;

}

var GetReadWriteFunctionCalls = (controls) => {
  var readWriteFunctions = ``;

  console.log("Enter readwrite function calls");

  // output == 1, input == 0 
  // TODO: Make control direction into an enum with defined numbers just like Unity
  for (var i in controls) {
    console.log("Readwrite " + i);

    if(controls[i].controlDirection == 1){
      readWriteFunctions += GetTabCharacter() + GetReadFunctionName(controls[i]) + `();`;
    }
    else{
      readWriteFunctions += GetTabCharacter() + GetWriteFunctionName(controls[i]) + `();`;
    }

    readWriteFunctions += `\n`;
  }

  console.log(readWriteFunctions);

  return readWriteFunctions;
}

const initializeControls = (controls) => {

  var controlDefs = ``;
  for (var i in controls) {
    if(controls[i].designerControlType == "Pin")
    {
      controlDefs += getPinDefine(controls[i]) + `\n`
    }
  }

  return controlDefs

}

const createOnOffControl = (control) => {
  var controlStringToReturn = ``;

   controlStringToReturn += GetTabCharacter() + `AddOnOffControl("` + control.controlName + `",`;

   if(control.controlDirection == 0){
    controlStringToReturn += "HEEP_INPUT,";
   }
   else {
    controlStringToReturn += "HEEP_OUTPUT,";
   }

   controlStringToReturn += control.curValue + `);\n`;
   
   return controlStringToReturn;
}

const createRangeControl = (control) => {
   var controlStringToReturn = ``;

   controlStringToReturn += GetTabCharacter() + `AddRangeControl("` + control.controlName + `",`;

   if(control.controlDirection == 0){
    controlStringToReturn += "HEEP_INPUT,";
   }
   else {
    controlStringToReturn += "HEEP_OUTPUT,";
   }

   controlStringToReturn += control.highValue + `,`;
   controlStringToReturn += control.lowValue + `,`;
   controlStringToReturn += control.curValue + `);\n`;
   
   return controlStringToReturn;
}

const setControls = (controls) => {
  var controlConfigs = ``;
  
  for (var i in controls) {
    console.log("Control Type: " + controls[i].controlType);
    if(controls[i].controlType == 0){
      controlConfigs += createOnOffControl(controls[i]);
    }
    else if(controls[i].controlType == 1){
      controlConfigs += createRangeControl(controls[i]);
    }
  }

  return controlConfigs
}

const setIDAndMAC = (launchDownloadCallback) => {

  var deviceIDArray = [];
  var MACAddressArray = [];

  randomNumber(0, 255)
  .then( (IDbyte1) => {

    deviceIDArray.push(IDbyte1);

    return randomNumber(0, 255)

  }).then((IDbyte2) => {

    deviceIDArray.push(IDbyte2);

    return randomNumber(0, 255);

  }).then((IDbyte3) => {

    deviceIDArray.push(IDbyte3);

    return randomNumber(0, 255);

  }).then((IDbyte4) => {
    
    deviceIDArray.push(IDbyte4);

    return randomNumber(0, 100);

  }).then((MACbyte1) => {
    
    MACAddressArray.push(MACbyte1);

    return randomNumber(0, 100);

  }).then((MACbyte2) => {
    
    MACAddressArray.push(MACbyte2);

    return randomNumber(0, 100);

  }).then((MACbyte3) => {
    
    MACAddressArray.push(MACbyte3);

    return randomNumber(0, 255);

  }).then((MACbyte4) => {
    
    MACAddressArray.push(MACbyte4);

    return randomNumber(0, 100);

  }).then((MACbyte5) => {
    
    MACAddressArray.push(MACbyte5);

    return randomNumber(0, 100);

  }).then((MACbyte6) => {
    
    MACAddressArray.push(MACbyte6);

    launchDownloadCallback(deviceIDArray, MACAddressArray);

  }).catch({code: "RandomGenerationError"}, (err) => {

    console.log("Something went wrong with promise chain...");

  });

}

const generateDeviceDefinitionsFile = (deviceName, deviceIDarray, MACAddressArray, autoGenIncludes) => {

  var autoGenContent = `#include <Heep_API.h>\n`;
  autoGenContent += autoGenIncludes;
  autoGenContent += `heepByte deviceIDByte [STANDARD_ID_SIZE] = {` + convertIntToHex(deviceIDarray) + `};\n`;
  autoGenContent += `uint8_t mac[6] = {` + convertIntToHex(MACAddressArray) + `};\n`;
  autoGenContent += `unsigned char clearMemory = 1;\n`;
  autoGenContent += `char* heepDeviceName = "` + deviceName + `";\n`;
  
  return autoGenContent
}

const convertIntToHex = (array) => {
  
  var commaString = '';

  for (var i in array) {
    commaString += '0x' + (array[i]).toString(16);

    if (i != array.length - 1) {
      commaString += ',';
    }
  }

  console.log("Hex Generated: ", commaString);

  return commaString
}

const getCommsFileName = (deviceDetails) => {
  var sys = deviceDetails.systemType;
  var phy = deviceDetails.physicalLayer;

  console.log(sys_phy_files);
  console.log(sys);
  console.log(phy);

  return sys_phy_files[sys][phy]["HeaderFile"];
}

const getIncludes_Simulation = (deviceDetails) => {
  return `#include "` + getCommsFileName(deviceDetails) + `"
#include "Simulation_NonVolatileMemory.h"
#include "Simulation_Timer.h" \n`
}

const getIncludes_ESP8266 = (deviceDetails) => {
  return `#include "` + getCommsFileName(deviceDetails) + `"
  #include "ESP8266_NonVolatileMemory.h"
  #include "Arduino_Timer.h" \n`
}


