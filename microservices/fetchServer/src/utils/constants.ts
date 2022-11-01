export const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
export const MONGO_PORT = parseInt(process.env.MONGO_PORT || '27017');
export const MONGO_DATABASE = process.env.MONGO_DATABASE || 'dodgeball';
export const MONG_USEERNAME = process.env.MONGO_USERNAME || 'root';
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'root';

export const RUN_ALL_ON_STARTUP = process.env.RUN_ALL_ON_STARTUP || true;