import csvTransform from './csvTransform';
import jsonTransform from './jsonTransform';

const transforms = {
    csv: csvTransform,
    json: jsonTransform,
};

export default transforms;