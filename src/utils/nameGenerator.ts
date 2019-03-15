import hat from "hat";

const rack = hat.rack(32, 4, 64);

export default (prefix: string) => {
	return prefix + rack(null);
};
