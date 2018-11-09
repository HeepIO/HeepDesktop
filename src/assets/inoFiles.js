import ClimateSensorInoFile from '../../DeviceBuilderExamples/ClimateSensor/ClimateSensor/ClimateSensor.ino'
import CloseOpenSensorInoFile from '../../DeviceBuilderExamples/CloseOpenSensor/CloseOpenSensor/CloseOpenSensor.ino'
import EncoderInoFile from '../../DeviceBuilderExamples/EncoderReader/Encoder/Encoder.ino'
import PiezoBuzzerInoFile from '../../DeviceBuilderExamples/PiezoBuzzer/PiezoBuzzer/PiezoBuzzer.ino'
import PassiveIRInoFile from '../../DeviceBuilderExamples/PassiveIRSensor/PassiveIR/PassiveIR.ino'
import ServoInoFile from '../../DeviceBuilderExamples/ServoController/Servo/Servo.ino'
import SoilSensorInoFile from '../../DeviceBuilderExamples/SoilHygrometer/SoilHygrometer/SoilHygrometer.ino'

export const applications = {
	Custom :  {
		name: "Custom",
		file: null
	},
	ClimateSensor : {
		name: "Climate Sensor",
		file: ClimateSensorInoFile
	},
	CloseOpenSensor : {
		name: "Close Open Sensor",
		file: CloseOpenSensorInoFile
	},
	Encoder : {
		name: "Encoder",
		file: EncoderInoFile
	},
	PiezoBuzzer : {
		name: "Piezo Buzzer",
		file: PiezoBuzzerInoFile
	},
	PassiveIR : {
		name: "Passive IR",
		file: PassiveIRInoFile
	},
	Servo : {
		name: "Servo",
		file: ServoInoFile
	},
	SoilSensor : {
		name: "Soil Sensor",
		file: SoilSensorInoFile
	}
}