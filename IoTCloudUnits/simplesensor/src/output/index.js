import httpOutput from './httpOutput';
import mqttOutput from './mqttOutput';
import consoleOutput from './consoleOuput';

const outputs = {
    http: httpOutput,
    mqtt: mqttOutput,
    console: consoleOutput,
};

export default outputs;