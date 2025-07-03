import { APP_DATA } from "../assets/data/js/fetchAppData.js";

const APP_NAME = (await APP_DATA.manifest())?.name.toLowerCase().trim();

export const CONSTANTS = {
	APP_NAME,
};
