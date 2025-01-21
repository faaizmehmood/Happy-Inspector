import { v4 as uuidv4 } from 'uuid';

export const generatePropertyID = async () => {
    return uuidv4();
};