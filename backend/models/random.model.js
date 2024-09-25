import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoose from "mongoose";

const randomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    
});

randomSchema.plugin(mongooseAggregatePaginate); //added aggreation plugin
export default mongoose.model("Random", randomSchema);
