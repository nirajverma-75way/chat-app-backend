
import { type IReplie } from "./replie.dto";
import ReplieSchema from "./replie.schema";

export const createReplie = async (data: IReplie) => {
    const result = await ReplieSchema.create({ ...data, active: true });
    return result;
};

export const updateReplie = async (id: string, data: IReplie) => {
    const result = await ReplieSchema.findOneAndUpdate({ _id: id }, data, {
        new: true,
    });
    return result;
};

export const editReplie = async (id: string, data: Partial<IReplie>) => {
    const result = await ReplieSchema.findOneAndUpdate({ _id: id }, data);
    return result;
};

export const deleteReplie = async (id: string) => {
    const result = await ReplieSchema.deleteOne({ _id: id });
    return result;
};

export const getReplieById = async (id: string) => {
    const result = await ReplieSchema.findById(id).lean();
    return result;
};

export const getAllReplie = async () => {
    const result = await ReplieSchema.find({}).lean();
    return result;
};
export const getReplieByEmail = async (email: string) => {
    const result = await ReplieSchema.findOne({ email }).lean();
    return result;
}

