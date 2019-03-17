import profiler from "./screeps-profiler";

export function profile(target: () => void): void;
export function profile(target: object, key: string | symbol, _descriptor: TypedPropertyDescriptor<() => void>): void;
// tslint:disable-next-line: max-line-length
export function profile(target: object | void, key?: string | symbol, _descriptor?: TypedPropertyDescriptor<() => void>): void {

	if (key) {
		// case of method decorator
		profiler.registerFN(target as Function, key as string);
		return;
	}

	// case of class decorator
	const ctor = target as any;
	if (!ctor.prototype) {
		return;
	}

	const className = ctor.name;
	profiler.registerClass(target as Function, className);

}
