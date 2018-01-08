import mongoose from '../db';

var Testrig = mongoose.model('Testrig', {
    location: String,
    createdAt: Number,
    sliceId: String,
    testrigId: String,
});

export default Testrig;
